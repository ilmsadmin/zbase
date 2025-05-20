import { PrismaService } from '../prisma/prisma.service';
import { PosCacheService } from '../redis/pos-cache.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';
export declare class CategoriesService {
    private readonly prisma;
    private readonly cacheService;
    private readonly logger;
    constructor(prisma: PrismaService, cacheService: PosCacheService);
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
    private invalidateCache;
}
