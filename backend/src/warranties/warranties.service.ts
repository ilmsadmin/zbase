import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWarrantyDto, FilterWarrantyDto, UpdateWarrantyDto, WarrantyStatus } from './dto';
import { Prisma, Warranty } from '@prisma/client';

@Injectable()
export class WarrantiesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Generate a unique warranty code
   */
  private async generateWarrantyCode(): Promise<string> {
    const date = new Date();
    const dateStr = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
    
    // Get count of today's warranties
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);
    
    const count = await this.prisma.warranty.count({
      where: {
        createdAt: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
    });
    
    // Format: WR-YYYYMMDD-XXXX (XXXX is a sequential number)
    return `WR-${dateStr}-${String(count + 1).padStart(4, '0')}`;
  }

  /**
   * Create a new warranty request
   */
  async create(createWarrantyDto: CreateWarrantyDto): Promise<Warranty> {
    try {
      // Generate code if not provided
      const code = createWarrantyDto.code || await this.generateWarrantyCode();

      // Verify that required entities exist
      if (createWarrantyDto.customerId) {
        const customer = await this.prisma.customer.findUnique({
          where: { id: createWarrantyDto.customerId },
        });
        if (!customer) {
          throw new BadRequestException(`Customer with ID ${createWarrantyDto.customerId} not found`);
        }
      }

      if (createWarrantyDto.productId) {
        const product = await this.prisma.product.findUnique({
          where: { id: createWarrantyDto.productId },
        });
        if (!product) {
          throw new BadRequestException(`Product with ID ${createWarrantyDto.productId} not found`);
        }
      }

      if (createWarrantyDto.invoiceId) {
        const invoice = await this.prisma.invoice.findUnique({
          where: { id: createWarrantyDto.invoiceId },
        });
        if (!invoice) {
          throw new BadRequestException(`Invoice with ID ${createWarrantyDto.invoiceId} not found`);
        }
      }

      // Create the warranty record
      return this.prisma.warranty.create({
        data: {
          ...createWarrantyDto,
          code,
          status: createWarrantyDto.status || WarrantyStatus.PENDING,
          receivedDate: createWarrantyDto.receivedDate || new Date(),
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException('Warranty code must be unique');
        }
        if (error.code === 'P2003') {
          throw new BadRequestException('Foreign key constraint failed');
        }
      }
      throw error;
    }
  }

  /**
   * Find all warranties with optional filtering
   */
  async findAll(filters: FilterWarrantyDto = {}): Promise<Warranty[]> {
    const {
      code,
      customerId,
      productId,
      invoiceId,
      serialNumber,
      status,
      creatorId,
      technicianId,
      startDate,
      endDate,
    } = filters;

    const where: Prisma.WarrantyWhereInput = {};

    if (code) where.code = { contains: code, mode: 'insensitive' };
    if (customerId) where.customerId = parseInt(customerId);
    if (productId) where.productId = parseInt(productId);
    if (invoiceId) where.invoiceId = parseInt(invoiceId);
    if (serialNumber) where.serialNumber = { contains: serialNumber, mode: 'insensitive' };
    if (status) where.status = status;
    if (creatorId) where.creatorId = parseInt(creatorId);
    if (technicianId) where.technicianId = parseInt(technicianId);
    
    if (startDate || endDate) {
      where.receivedDate = {};
      if (startDate) where.receivedDate.gte = new Date(startDate);
      if (endDate) where.receivedDate.lte = new Date(endDate);
    }

    return this.prisma.warranty.findMany({
      where,
      include: {
        customer: true,
        product: true,
        invoice: true,
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        technician: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        receivedDate: 'desc',
      },
    });
  }

  /**
   * Find a specific warranty by ID
   */
  async findOne(id: number): Promise<Warranty> {
    const warranty = await this.prisma.warranty.findUnique({
      where: { id },
      include: {
        customer: true,
        product: true,
        invoice: true,
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        technician: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!warranty) {
      throw new NotFoundException(`Warranty with ID ${id} not found`);
    }

    return warranty;
  }

  /**
   * Find a specific warranty by code
   */
  async findByCode(code: string): Promise<Warranty> {
    const warranty = await this.prisma.warranty.findUnique({
      where: { code },
      include: {
        customer: true,
        product: true,
        invoice: true,
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        technician: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!warranty) {
      throw new NotFoundException(`Warranty with code ${code} not found`);
    }

    return warranty;
  }

  /**
   * Update a warranty by ID
   */
  async update(id: number, updateWarrantyDto: UpdateWarrantyDto): Promise<Warranty> {
    await this.findOne(id);

    try {
      // Update automatically actualReturnDate if status is set to COMPLETED and actualReturnDate is not provided
      if (updateWarrantyDto.status === WarrantyStatus.COMPLETED && !updateWarrantyDto.actualReturnDate) {
        updateWarrantyDto.actualReturnDate = new Date();
      }

      return await this.prisma.warranty.update({
        where: { id },
        data: updateWarrantyDto,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException('Warranty code must be unique');
        }
      }
      throw error;
    }
  }

  /**
   * Remove a warranty by ID
   */
  async remove(id: number): Promise<Warranty> {
    await this.findOne(id);
    return this.prisma.warranty.delete({
      where: { id },
    });
  }
}
