import { CategoriesService } from './categories.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    create(createCategoryDto: CreateCategoryDto): Promise<{
        id: number;
        name: string;
        description: string | null;
    }>;
    findAll(): Promise<any>;
    findOne(id: number): Promise<any>;
    update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<{
        id: number;
        name: string;
        description: string | null;
    }>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
