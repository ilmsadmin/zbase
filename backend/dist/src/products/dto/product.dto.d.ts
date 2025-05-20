export declare class ProductDto {
    id: number;
    code: string;
    name: string;
    categoryId?: number;
    price: number;
    attributes?: Record<string, any>;
    createdAt?: Date;
}
