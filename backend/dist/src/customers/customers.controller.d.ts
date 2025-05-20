import { CustomersService } from './customers.service';
import { CreateCustomerDto, UpdateCustomerDto } from './dto';
export declare class CustomersController {
    private readonly customersService;
    constructor(customersService: CustomersService);
    findAll(): Promise<{
        id: number;
        createdAt: Date;
        name: string;
        phone: string | null;
        email: string | null;
        address: string | null;
        debt: import("@prisma/client/runtime/library").Decimal;
    }[]>;
    findOne(id: number): Promise<{
        id: number;
        createdAt: Date;
        name: string;
        phone: string | null;
        email: string | null;
        address: string | null;
        debt: import("@prisma/client/runtime/library").Decimal;
    }>;
    create(createCustomerDto: CreateCustomerDto): Promise<{
        id: number;
        createdAt: Date;
        name: string;
        phone: string | null;
        email: string | null;
        address: string | null;
        debt: import("@prisma/client/runtime/library").Decimal;
    }>;
    update(id: number, updateCustomerDto: UpdateCustomerDto): Promise<{
        id: number;
        createdAt: Date;
        name: string;
        phone: string | null;
        email: string | null;
        address: string | null;
        debt: import("@prisma/client/runtime/library").Decimal;
    }>;
    remove(id: number): Promise<void>;
    getInvoices(id: number): Promise<any[]>;
    getDebt(id: number): Promise<{
        debt: import("@prisma/client/runtime/library").Decimal;
        transactions: any[];
    }>;
}
