import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto, ProductQueryDto } from './dto';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
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
        price: import("@prisma/client/runtime/library").Decimal;
        attributes: import("@prisma/client/runtime/library").JsonValue | null;
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
        price: import("@prisma/client/runtime/library").Decimal;
        attributes: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
