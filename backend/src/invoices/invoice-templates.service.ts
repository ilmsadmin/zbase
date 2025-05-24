import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInvoiceTemplateDto, UpdateInvoiceTemplateDto } from './dto';

@Injectable()
export class InvoiceTemplatesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createInvoiceTemplateDto: CreateInvoiceTemplateDto, userId: number) {
    // If this is set as default, unset the current default for this type
    if (createInvoiceTemplateDto.isDefault) {
      await this.prisma.invoiceTemplate.updateMany({
        where: {
          type: createInvoiceTemplateDto.type,
          isDefault: true,
        },
        data: {
          isDefault: false,
        },
      });
    }

    return this.prisma.invoiceTemplate.create({
      data: {
        ...createInvoiceTemplateDto,
        createdById: userId,
      },
    });
  }

  async findAll(type?: string) {
    const where = type ? { type } : {};
    
    return this.prisma.invoiceTemplate.findMany({
      where,
      orderBy: [
        { isDefault: 'desc' },
        { createdAt: 'desc' },
      ],
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    const template = await this.prisma.invoiceTemplate.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!template) {
      throw new NotFoundException(`Invoice template with ID ${id} not found`);
    }

    return template;
  }

  async findDefault(type: string = 'default') {
    const template = await this.prisma.invoiceTemplate.findFirst({
      where: {
        type,
        isDefault: true,
      },
    });

    if (!template) {
      // Return the most recently created template of this type if no default exists
      return this.prisma.invoiceTemplate.findFirst({
        where: { type },
        orderBy: { createdAt: 'desc' },
      });
    }

    return template;
  }

  async update(id: number, updateInvoiceTemplateDto: UpdateInvoiceTemplateDto) {
    // Verify the template exists
    const template = await this.prisma.invoiceTemplate.findUnique({
      where: { id },
    });

    if (!template) {
      throw new NotFoundException(`Invoice template with ID ${id} not found`);
    }

    // If setting as default, unset any other default of the same type
    if (updateInvoiceTemplateDto.isDefault) {
      await this.prisma.invoiceTemplate.updateMany({
        where: {
          type: updateInvoiceTemplateDto.type || template.type,
          isDefault: true,
          id: { not: id },
        },
        data: {
          isDefault: false,
        },
      });
    }

    return this.prisma.invoiceTemplate.update({
      where: { id },
      data: updateInvoiceTemplateDto,
    });
  }

  async remove(id: number) {
    const template = await this.prisma.invoiceTemplate.findUnique({
      where: { id },
    });

    if (!template) {
      throw new NotFoundException(`Invoice template with ID ${id} not found`);
    }

    // Don't allow deleting the default template
    if (template.isDefault) {
      throw new BadRequestException('Cannot delete the default template');
    }

    return this.prisma.invoiceTemplate.delete({
      where: { id },
    });
  }

  async setAsDefault(id: number) {
    const template = await this.prisma.invoiceTemplate.findUnique({
      where: { id },
    });

    if (!template) {
      throw new NotFoundException(`Invoice template with ID ${id} not found`);
    }

    // Unset any other default of the same type
    await this.prisma.invoiceTemplate.updateMany({
      where: {
        type: template.type,
        isDefault: true,
      },
      data: {
        isDefault: false,
      },
    });

    // Set this one as default
    return this.prisma.invoiceTemplate.update({
      where: { id },
      data: {
        isDefault: true,
      },
    });
  }
}
