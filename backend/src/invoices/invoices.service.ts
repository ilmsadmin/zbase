import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInvoiceDto, UpdateInvoiceDto, CreatePaymentDto, SendEmailDto } from './dto';
import { Prisma } from '@prisma/client';
import { InventoryService } from '../inventory/inventory.service';
import { MailService } from '../mail/mail.service';
import { InvoiceTemplatesService } from './invoice-templates.service';
import * as PDFDocument from 'pdfkit';

@Injectable()
export class InvoicesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly inventoryService: InventoryService,
    private readonly mailService: MailService,
    private readonly invoiceTemplatesService: InvoiceTemplatesService,
  ) {}

  async create(createInvoiceDto: CreateInvoiceDto) {
    const { items, ...invoiceData } = createInvoiceDto;

    // Generate unique invoice code
    const invoiceCode = await this.generateInvoiceCode();
    
    // Calculate totals
    let subtotal = 0;
    let taxAmount = 0;
    let totalAmount = 0;
    
    // Validate items and prepare them for creation
    const preparedItems = items.map(item => {
      const itemSubtotal = Number(item.quantity) * Number(item.unitPrice);
      const itemDiscount = Number(item.discountAmount || 0);
      const itemTax = Number(item.taxAmount || 0);
      const itemTotal = itemSubtotal - itemDiscount + itemTax;
      
      subtotal += itemSubtotal;
      taxAmount += itemTax;
      totalAmount += itemTotal;
      
      return {
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        discountRate: item.discountRate || 0,
        discountAmount: item.discountAmount || 0,
        taxRate: item.taxRate || 0,
        taxAmount: item.taxAmount || 0,
        totalAmount: itemTotal,
        locationId: item.locationId,
        serialNumbers: item.serialNumbers,
        serialNumber: item.serialNumber,
        warrantyExpiration: item.warrantyExpiration,
        notes: item.notes,
      };
    });
    
    // Apply the total discount if provided
    const finalDiscountAmount = invoiceData.discountAmount || 0;
    totalAmount -= finalDiscountAmount;
    
    // Create the invoice with its items in a transaction
    try {
      const result = await this.prisma.$transaction(async (prisma) => {
        // Create the invoice
        const invoice = await prisma.invoice.create({
          data: {
            code: invoiceCode,
            customerId: invoiceData.customerId,
            userId: invoiceData.userId,
            shiftId: invoiceData.shiftId,
            warehouseId: invoiceData.warehouseId,
            invoiceDate: invoiceData.invoiceDate || new Date(),
            subtotal,
            taxAmount,
            discountAmount: finalDiscountAmount,
            totalAmount,
            paidAmount: invoiceData.paidAmount || 0,
            paymentMethod: invoiceData.paymentMethod,
            status: invoiceData.status || 'pending',
            notes: invoiceData.notes,
            items: {
              create: preparedItems,
            },
          },
          include: {
            items: true,
            customer: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            warehouse: true,
          },
        });
        
        // Update inventory for each item
        for (const item of invoice.items) {
          await this.inventoryService.decreaseStock(
            item.productId,
            invoice.warehouseId,
            item.locationId || null,
            Number(item.quantity),
            {
              referenceType: 'invoice',
              referenceId: invoice.id,
              userId: invoice.userId,
            }
          );
        }
        
        return invoice;
      });
      
      return result;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException('Duplicate invoice code');
        }
        if (error.code === 'P2003') {
          throw new BadRequestException('Referenced record does not exist');
        }
      }
      throw error;
    }
  }

  async findAll(
    customerId?: number,
    userId?: number,
    warehouseId?: number,
    status?: string,
    startDate?: Date,
    endDate?: Date,
    search?: string,
    page: number = 1,
    limit: number = 20,
  ) {
    const skip = (page - 1) * limit;

    // Build where clause based on filters
    const where: Prisma.InvoiceWhereInput = {};

    if (customerId) where.customerId = customerId;
    if (userId) where.userId = userId;
    if (warehouseId) where.warehouseId = warehouseId;
    if (status) where.status = status;
    
    // Add date range filter
    if (startDate || endDate) {
      where.invoiceDate = {};
      if (startDate) where.invoiceDate.gte = startDate;
      if (endDate) where.invoiceDate.lte = endDate;
    }

    // Add search filter
    if (search) {
      where.OR = [
        { code: { contains: search, mode: 'insensitive' } },
        { customer: { name: { contains: search, mode: 'insensitive' } } },
        { notes: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.invoice.findMany({
        where,
        skip,
        take: limit,
        include: {
          customer: {
            select: {
              id: true,
              name: true,
              phone: true,
              code: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
            },
          },
          warehouse: {
            select: {
              id: true,
              name: true,
            },
          },
          _count: {
            select: {
              items: true,
            },
          },
        },
        orderBy: {
          invoiceDate: 'desc',
        },
      }),
      this.prisma.invoice.count({ where }),
    ]);

    return {
      items,
      meta: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
            location: true,
          },
        },
        customer: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        warehouse: true,
        shift: true,
        transactions: true,
      },
    });

    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }

    return invoice;
  }

  async findByCode(code: string) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { code },
      include: {
        items: {
          include: {
            product: true,
            location: true,
          },
        },
        customer: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        warehouse: true,
        shift: true,
        transactions: true,
      },
    });

    if (!invoice) {
      throw new NotFoundException(`Invoice with code ${code} not found`);
    }

    return invoice;
  }

  async update(id: number, updateInvoiceDto: UpdateInvoiceDto) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }

    // If invoice is already paid or canceled, don't allow updates
    if (invoice.status === 'paid' || invoice.status === 'canceled') {
      throw new BadRequestException(`Cannot update invoice with status ${invoice.status}`);
    }

    // Only allow updates to specific fields to avoid inconsistency
    const { notes, status, paidAmount, paymentMethod } = updateInvoiceDto;

    // Update only allowed fields
    return this.prisma.invoice.update({
      where: { id },
      data: {
        notes,
        status,
        paidAmount,
        paymentMethod,
        updatedAt: new Date(),
      },
      include: {
        items: true,
        customer: true,
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async cancelInvoice(id: number, reason: string) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }

    // If invoice is already canceled, return it
    if (invoice.status === 'canceled') {
      return invoice;
    }

    // If invoice is paid, don't allow cancellation
    if (invoice.status === 'paid') {
      throw new BadRequestException('Cannot cancel a paid invoice');
    }

    try {
      // Cancel the invoice and restore inventory in a transaction
      return await this.prisma.$transaction(async (prisma) => {
        // Update invoice status
        const updatedInvoice = await prisma.invoice.update({
          where: { id },
          data: {
            status: 'canceled',
            notes: invoice.notes 
              ? `${invoice.notes}\nCancellation reason: ${reason}`
              : `Cancellation reason: ${reason}`,
            updatedAt: new Date(),
          },
          include: {
            items: true,
            customer: true,
            warehouse: true,
          },
        });
        
        // Restore inventory for each item
        for (const item of invoice.items) {
          await this.inventoryService.increaseStock(
            item.productId,
            invoice.warehouseId,
            item.locationId || null,
            Number(item.quantity),
            {
              referenceType: 'invoice_cancel',
              referenceId: invoice.id,
              notes: `Restored due to invoice cancellation: ${reason}`,
            }
          );
        }
        
        return updatedInvoice;
      });
    } catch (error) {
      throw new BadRequestException(`Failed to cancel invoice: ${error.message}`);
    }
  }

  async remove(id: number) {
    // Invoices shouldn't be deleted, only canceled
    throw new BadRequestException('Invoices cannot be deleted, use cancel method instead');
  }
  private async generateInvoiceCode(): Promise<string> {
    const date = new Date();
    const prefix = `INV${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    // Get the last invoice with this prefix
    const lastInvoice = await this.prisma.invoice.findFirst({
      where: {
        code: {
          startsWith: prefix,
        },
      },
      orderBy: {
        code: 'desc',
      },
    });

    let sequenceNumber = 1;
    if (lastInvoice) {
      const lastSequence = parseInt(lastInvoice.code.slice(prefix.length));
      sequenceNumber = isNaN(lastSequence) ? 1 : lastSequence + 1;
    }

    return `${prefix}${String(sequenceNumber).padStart(5, '0')}`;
  }

  async addPayment(id: number, createPaymentDto: CreatePaymentDto) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id },
    });

    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }

    if (invoice.status === 'canceled') {
      throw new BadRequestException('Cannot add payment to a canceled invoice');
    }

    if (invoice.status === 'paid') {
      throw new BadRequestException('Invoice is already fully paid');
    }

    // Calculate new paid amount
    const newPaidAmount = Number(invoice.paidAmount) + Number(createPaymentDto.amount);
    const remainingBalance = Number(invoice.totalAmount) - Number(invoice.paidAmount);

    // Validate payment amount
    if (createPaymentDto.amount <= 0) {
      throw new BadRequestException('Payment amount must be greater than zero');
    }

    if (createPaymentDto.amount > remainingBalance) {
      throw new BadRequestException(`Payment amount exceeds remaining balance. Maximum allowed: ${remainingBalance}`);
    }

    try {
      return await this.prisma.$transaction(async (prisma) => {
        // Create payment record
        const payment = await prisma.invoicePayment.create({
          data: {
            invoiceId: id,
            amount: createPaymentDto.amount,
            paymentMethod: createPaymentDto.paymentMethod,
            referenceNumber: createPaymentDto.referenceNumber,
            notes: createPaymentDto.notes,
          },
        });

        // Update invoice paid amount and status if fully paid
        const updatedInvoice = await prisma.invoice.update({
          where: { id },
          data: {
            paidAmount: newPaidAmount,
            status: newPaidAmount >= Number(invoice.totalAmount) ? 'paid' : 'pending',
            paymentMethod: createPaymentDto.paymentMethod, // Update with the latest payment method
            updatedAt: new Date(),
          },
          include: {
            customer: true,
          },
        });

        return {
          payment,
          invoice: updatedInvoice,
        };
      });
    } catch (error) {
      throw new BadRequestException(`Failed to add payment: ${error.message}`);
    }
  }

  async getInvoicePayments(id: number) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id },
    });

    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }

    const payments = await this.prisma.invoicePayment.findMany({
      where: { invoiceId: id },
      orderBy: { createdAt: 'desc' },
    });

    return {
      invoiceId: id,
      invoiceNumber: invoice.code,
      totalAmount: invoice.totalAmount,
      paidAmount: invoice.paidAmount,
      balance: Number(invoice.totalAmount) - Number(invoice.paidAmount),
      payments,
    };
  }

  async markAsPaid(id: number, paymentData: CreatePaymentDto) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id },
    });

    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }

    if (invoice.status === 'canceled') {
      throw new BadRequestException('Cannot mark a canceled invoice as paid');
    }

    if (invoice.status === 'paid') {
      throw new BadRequestException('Invoice is already marked as paid');
    }

    try {
      return await this.prisma.$transaction(async (prisma) => {
        // Create payment record for the full amount
        const remainingBalance = Number(invoice.totalAmount) - Number(invoice.paidAmount);
        const paymentAmount = paymentData.amount || remainingBalance;

        if (paymentAmount > remainingBalance) {
          throw new BadRequestException(`Payment amount exceeds remaining balance. Maximum allowed: ${remainingBalance}`);
        }

        const payment = await prisma.invoicePayment.create({
          data: {
            invoiceId: id,
            amount: paymentAmount,
            paymentMethod: paymentData.paymentMethod,
            referenceNumber: paymentData.referenceNumber,
            notes: paymentData.notes || 'Full payment',
          },
        });

        // Update invoice as paid
        const updatedInvoice = await prisma.invoice.update({
          where: { id },
          data: {
            paidAmount: {
              increment: paymentAmount
            },
            status: paymentAmount >= remainingBalance ? 'paid' : 'pending',
            paymentMethod: paymentData.paymentMethod,
            updatedAt: new Date(),
          },
          include: {
            customer: true,
            items: true,
          },
        });

        return {
          payment,
          invoice: updatedInvoice,
        };
      });
    } catch (error) {
      throw new BadRequestException(`Failed to mark invoice as paid: ${error.message}`);
    }
  }
  async generatePdf(id: number, templateId?: number): Promise<Buffer> {
    const invoice = await this.findOne(id);
    
    // Create a new PDF document
    const doc = new PDFDocument({ margin: 50 });
    
    // Buffer to store PDF
    const chunks: Buffer[] = [];
    doc.on('data', (chunk) => chunks.push(chunk));
    
    // Try to get a template
    try {
      let template;
      if (templateId) {
        // Use the specified template if provided
        template = await this.invoiceTemplatesService.findOne(templateId);
      } else {
        // Otherwise try to get the default template
        template = await this.invoiceTemplatesService.findDefault('invoice');
      }
      
      if (template) {
        // Add content to PDF using the template
        await this.buildPdfContentFromTemplate(doc, invoice, template);
      } else {
        // Fall back to default if no template is found
        this.buildPdfContent(doc, invoice);
      }
    } catch (error) {
      // If template retrieval fails, fall back to default
      this.buildPdfContent(doc, invoice);
    }
    
    // Finalize the PDF
    doc.end();
    
    // Return a promise that resolves with the complete PDF buffer
    return new Promise((resolve) => {
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(chunks);
        resolve(pdfBuffer);
      });
    });
  }

  private buildPdfContent(doc: PDFKit.PDFDocument, invoice: any) {
    // Company info
    doc.fontSize(20).text('INVOICE', { align: 'center' });
    doc.moveDown();
    
    // Header with company and customer info
    doc.fontSize(12);
    doc.text('ZBase Company', { align: 'left' });
    doc.text('123 Business Street', { align: 'left' });
    doc.text('Business City, Country', { align: 'left' });
    doc.text('Phone: +1234567890', { align: 'left' });
    doc.moveDown();
    
    // Invoice details
    doc.fontSize(14).text('Invoice Details', { underline: true });
    doc.fontSize(12);
    doc.text(`Invoice Number: ${invoice.code}`);
    doc.text(`Date: ${new Date(invoice.invoiceDate).toLocaleDateString()}`);
    doc.text(`Status: ${invoice.status.toUpperCase()}`);
    doc.moveDown();
    
    // Customer details
    doc.fontSize(14).text('Customer Details', { underline: true });
    doc.fontSize(12);
    doc.text(`Name: ${invoice.customer.name}`);
    doc.text(`Phone: ${invoice.customer.phone || 'N/A'}`);
    doc.text(`Email: ${invoice.customer.email || 'N/A'}`);
    doc.moveDown();
    
    // Invoice items table
    doc.fontSize(14).text('Invoice Items', { underline: true });
    doc.moveDown();
    
    // Table header
    let y = doc.y;
    doc.fontSize(10);
    doc.text('Product', 50, y);
    doc.text('Quantity', 250, y);
    doc.text('Unit Price', 320, y);
    doc.text('Discount', 390, y);
    doc.text('Total', 480, y);
    
    doc.moveTo(50, doc.y + 5)
       .lineTo(550, doc.y + 5)
       .stroke();
    doc.moveDown();
    
    // Table rows
    invoice.items.forEach(item => {
      y = doc.y;
      doc.text(item.product?.name || 'Unknown Product', 50, y);
      doc.text(String(item.quantity), 250, y);
      doc.text(`$${Number(item.unitPrice).toFixed(2)}`, 320, y);
      doc.text(`$${Number(item.discountAmount || 0).toFixed(2)}`, 390, y);
      doc.text(`$${Number(item.totalAmount).toFixed(2)}`, 480, y);
      doc.moveDown();
    });
    
    doc.moveTo(50, doc.y)
       .lineTo(550, doc.y)
       .stroke();
    doc.moveDown();
    
    // Totals
    doc.fontSize(12);
    doc.text(`Subtotal: $${Number(invoice.subtotal).toFixed(2)}`, { align: 'right' });
    if (invoice.taxAmount > 0) {
      doc.text(`Tax: $${Number(invoice.taxAmount).toFixed(2)}`, { align: 'right' });
    }
    if (invoice.discountAmount > 0) {
      doc.text(`Discount: $${Number(invoice.discountAmount).toFixed(2)}`, { align: 'right' });
    }
    doc.text(`Total: $${Number(invoice.totalAmount).toFixed(2)}`, { align: 'right' });
    doc.text(`Amount Paid: $${Number(invoice.paidAmount).toFixed(2)}`, { align: 'right' });
    doc.text(`Balance Due: $${(Number(invoice.totalAmount) - Number(invoice.paidAmount)).toFixed(2)}`, { align: 'right' });
    
    // Notes if any
    if (invoice.notes) {
      doc.moveDown();
      doc.fontSize(14).text('Notes', { underline: true });
      doc.fontSize(12).text(invoice.notes);
    }
    
    // Footer
    const footerY = doc.page.height - 50;
    doc.fontSize(10).text('Thank you for your business!', 50, footerY, { align: 'center' });
  }

  private async buildPdfContentFromTemplate(doc: PDFKit.PDFDocument, invoice: any, template: any) {
    try {
      // Parse the template content
      const content = template.content;
      
      // Basic template parsing and substitution
      // In a real application, this could be a more sophisticated templating engine
      let renderedContent = content;
      
      // Replace placeholders with actual data
      renderedContent = renderedContent.replace(/{{invoice\.code}}/g, invoice.code || '');
      renderedContent = renderedContent.replace(/{{invoice\.date}}/g, new Date(invoice.invoiceDate).toLocaleDateString() || '');
      renderedContent = renderedContent.replace(/{{invoice\.status}}/g, invoice.status?.toUpperCase() || '');
      renderedContent = renderedContent.replace(/{{invoice\.subtotal}}/g, Number(invoice.subtotal).toFixed(2) || '0.00');
      renderedContent = renderedContent.replace(/{{invoice\.tax}}/g, Number(invoice.taxAmount).toFixed(2) || '0.00');
      renderedContent = renderedContent.replace(/{{invoice\.discount}}/g, Number(invoice.discountAmount).toFixed(2) || '0.00');
      renderedContent = renderedContent.replace(/{{invoice\.total}}/g, Number(invoice.totalAmount).toFixed(2) || '0.00');
      renderedContent = renderedContent.replace(/{{invoice\.paid}}/g, Number(invoice.paidAmount).toFixed(2) || '0.00');
      renderedContent = renderedContent.replace(/{{invoice\.balance}}/g, (Number(invoice.totalAmount) - Number(invoice.paidAmount)).toFixed(2) || '0.00');
      renderedContent = renderedContent.replace(/{{invoice\.notes}}/g, invoice.notes || '');
      
      // Customer information
      renderedContent = renderedContent.replace(/{{customer\.name}}/g, invoice.customer?.name || '');
      renderedContent = renderedContent.replace(/{{customer\.phone}}/g, invoice.customer?.phone || '');
      renderedContent = renderedContent.replace(/{{customer\.email}}/g, invoice.customer?.email || '');
      renderedContent = renderedContent.replace(/{{customer\.address}}/g, invoice.customer?.address || '');
      
      // Process items section
      if (invoice.items && invoice.items.length > 0) {
        let itemsHtml = '';
        invoice.items.forEach((item, index) => {
          let itemTemplate = `
            <tr>
              <td>${index + 1}</td>
              <td>${item.product?.name || 'Unknown Product'}</td>
              <td>${item.quantity}</td>
              <td>$${Number(item.unitPrice).toFixed(2)}</td>
              <td>$${Number(item.discountAmount || 0).toFixed(2)}</td>
              <td>$${Number(item.totalAmount).toFixed(2)}</td>
            </tr>
          `;
          itemsHtml += itemTemplate;
        });
        renderedContent = renderedContent.replace(/{{invoice\.items}}/g, itemsHtml);
      }
      
      // Handle HTML to PDF conversion
      // For simplicity, we'll just add basic text, but in a real app
      // you'd want to use a proper HTML to PDF renderer
      doc.fontSize(12);
      
      // Split content by newlines and add to document
      const lines = renderedContent.split('\n');
      lines.forEach(line => {
        // Strip HTML tags for this simple implementation
        const cleanLine = line.replace(/<[^>]*>/g, '').trim();
        if (cleanLine.length > 0) {
          doc.text(cleanLine);
        } else {
          doc.moveDown();
        }
      });
      
      return true;
    } catch (error) {
      console.error('Error rendering template:', error);
      // Fall back to default template in case of error
      this.buildPdfContent(doc, invoice);
      return false;
    }
  }
  
  async sendInvoiceByEmail(id: number, sendEmailDto: SendEmailDto) {
    const invoice = await this.findOne(id);
    
    // Generate PDF with template if specified
    const pdfBuffer = await this.generatePdf(id, sendEmailDto.templateId);
    
    // Prepare email content
    const subject = sendEmailDto.subject || `Invoice ${invoice.code}`;
    const text = sendEmailDto.message || 
      `Dear ${invoice.customer?.name || 'Customer'},

Please find attached your invoice ${invoice.code} dated ${new Date(invoice.invoiceDate).toLocaleDateString()}.

Total Amount: $${Number(invoice.totalAmount).toFixed(2)}
Amount Paid: $${Number(invoice.paidAmount).toFixed(2)}
Balance Due: $${(Number(invoice.totalAmount) - Number(invoice.paidAmount)).toFixed(2)}

Thank you for your business.

Regards,
ZBase Team`;

    try {
      // Send email with PDF attachment
      await this.mailService.sendMailWithAttachments(
        sendEmailDto.to,
        subject,
        text,
        undefined, // No HTML content for now
        [
          {
            filename: `invoice-${invoice.code}.pdf`,
            content: pdfBuffer,
            contentType: 'application/pdf',
          },
        ]
      );
      
      return {
        success: true,
        message: `Email with invoice ${invoice.code} sent to ${sendEmailDto.to}`,
      };
    } catch (error) {
      throw new BadRequestException(`Failed to send email: ${error.message}`);
    }
  }

  async getInvoiceStatistics(startDate?: Date, endDate?: Date) {
    // Build date filter
    const dateFilter: Prisma.InvoiceWhereInput = {};
    if (startDate || endDate) {
      dateFilter.invoiceDate = {};
      if (startDate) dateFilter.invoiceDate.gte = startDate;
      if (endDate) dateFilter.invoiceDate.lte = endDate;
    }
    
    // Get counts by status
    const statusCounts = await this.prisma.invoice.groupBy({
      by: ['status'],
      where: dateFilter,
      _count: {
        id: true,
      },
      _sum: {
        totalAmount: true,
      },
    });
    
    // Total invoice count in period
    const totalCount = await this.prisma.invoice.count({
      where: dateFilter,
    });
    
    // Total revenue (paid invoices)
    const paidInvoices = await this.prisma.invoice.aggregate({
      where: {
        ...dateFilter,
        status: 'paid',
      },
      _sum: {
        totalAmount: true,
      },
      _count: {
        id: true,
      },
    });
    
    // Outstanding amount (pending invoices)
    const pendingInvoices = await this.prisma.invoice.aggregate({
      where: {
        ...dateFilter,
        status: 'pending',
      },
      _sum: {
        totalAmount: true,
      },
      _count: {
        id: true,
      },
    });
    
    // Get monthly revenue data for charts
    const monthlyData = await this.getMonthlyRevenueData(startDate, endDate);
    
    // Format the statistics
    return {
      totalInvoices: totalCount,
      totalRevenue: paidInvoices._sum.totalAmount || 0,
      outstandingAmount: pendingInvoices._sum.totalAmount || 0,
      statusBreakdown: statusCounts.map(item => ({
        status: item.status,
        count: item._count.id,
        amount: item._sum.totalAmount || 0,
      })),
      paidCount: paidInvoices._count.id,
      pendingCount: pendingInvoices._count.id,
      monthlyData,
    };
  }
    private async getMonthlyRevenueData(startDate?: Date, endDate?: Date) {
    // Default to current year if no dates provided
    const currentYear = new Date().getFullYear();
    const effectiveStartDate = startDate || new Date(currentYear, 0, 1);
    const effectiveEndDate = endDate || new Date(currentYear, 11, 31);
    
    // Get all invoices in the period
    const invoices = await this.prisma.invoice.findMany({
      where: {
        invoiceDate: {
          gte: effectiveStartDate,
          lte: effectiveEndDate,
        },
        status: {
          in: ['paid', 'pending'],
        },
      },
      select: {
        invoiceDate: true,
        totalAmount: true,
        paidAmount: true,
        status: true,
      },
    });
    
    // Define type for monthly data
    interface MonthlyData {
      revenue: number;
      outstanding: number;
      count: number;
    }
    
    // Group by month
    const monthlyData: Record<string, MonthlyData> = {};
    
    // Initialize all months with zero
    for (let i = 0; i < 12; i++) {
      const date = new Date(currentYear, i, 1);
      const monthKey = date.toLocaleString('default', { month: 'short' });
      monthlyData[monthKey] = {
        revenue: 0,
        outstanding: 0,
        count: 0,
      };
    }
    
    // Aggregate invoice data by month
    invoices.forEach(invoice => {
      const date = new Date(invoice.invoiceDate);
      const monthKey = date.toLocaleString('default', { month: 'short' });
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          revenue: 0,
          outstanding: 0,
          count: 0,
        };
      }
      
      monthlyData[monthKey].count += 1;
        if (invoice.status === 'paid') {
        monthlyData[monthKey].revenue += Number(invoice.totalAmount);
      } else {
        monthlyData[monthKey].revenue += Number(invoice.paidAmount || 0);
        monthlyData[monthKey].outstanding += Number(invoice.totalAmount) - Number(invoice.paidAmount || 0);
      }
    });
    
    // Convert to array format for charts
    return Object.entries(monthlyData).map(([month, data]) => ({
      month,
      revenue: data.revenue,
      outstanding: data.outstanding,
      count: data.count
    }));
  }
}
