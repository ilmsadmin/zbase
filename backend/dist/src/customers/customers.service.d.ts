import { PrismaService } from '../prisma/prisma.service';
import { CreateCustomerDto, UpdateCustomerDto } from './dto';
import { Customer } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
export declare class CustomersService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<Customer[]>;
    findOne(id: number): Promise<Customer>;
    create(createCustomerDto: CreateCustomerDto): Promise<Customer>;
    update(id: number, updateCustomerDto: UpdateCustomerDto): Promise<Customer>;
    remove(id: number): Promise<void>;
    getInvoices(id: number): Promise<any[]>;
    getDebt(id: number): Promise<{
        debt: Decimal;
        transactions: any[];
    }>;
}
