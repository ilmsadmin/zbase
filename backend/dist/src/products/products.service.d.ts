import { PrismaService } from '../prisma/prisma.service';
import { PosCacheService } from '../redis/pos-cache.service';
import { CreateProductDto, UpdateProductDto, ProductQueryDto } from './dto';
import { Prisma } from '@prisma/client';
export declare class ProductsService {
    private readonly prisma;
    private readonly cacheService;
    private readonly logger;
    constructor(prisma: PrismaService, cacheService: PosCacheService);
    create(createProductDto: CreateProductDto): Promise<{
        category: {
            id: number;
            name: string;
            description: string | null;
        } | null;
    } & {
        id: number;
        name: string;
        createdAt: Date;
        code: string;
        categoryId: number | null;
        price: Prisma.Decimal;
        attributes: Prisma.JsonValue | null;
    }>;
    findAll(query: ProductQueryDto): Promise<any>;
    findOne(id: number): Promise<any>;
    update(id: number, updateProductDto: UpdateProductDto): Promise<{
        category: {
            id: number;
            name: string;
            description: string | null;
        } | null;
    } & {
        id: number;
        name: string;
        createdAt: Date;
        code: string;
        categoryId: number | null;
        price: Prisma.Decimal;
        attributes: Prisma.JsonValue | null;
    }>;
    remove(id: number): Promise<{
        message: string;
    }>;
    private invalidateCache;
}
