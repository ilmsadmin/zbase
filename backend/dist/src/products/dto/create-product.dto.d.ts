export declare class CreateProductDto {
    code: string;
    name: string;
    categoryId?: number;
    price: number | string;
    attributes?: Record<string, any>;
}
