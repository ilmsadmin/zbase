import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Role } from '../common/enums/role.enum';
export declare class PostsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createPostDto: CreatePostDto, userId: number): Promise<{
        author: {
            id: number;
            email: string;
            name: string;
        };
    } & {
        id: number;
        content: string;
        authorId: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        published: boolean;
    }>;
    findAll(userId: number, userRole: Role): Promise<({
        author: {
            id: number;
            email: string;
            name: string;
        };
    } & {
        id: number;
        content: string;
        authorId: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        published: boolean;
    })[]>;
    findOne(id: number, userId: number, userRole: Role): Promise<{
        author: {
            id: number;
            email: string;
            name: string;
        };
        comments: ({
            author: {
                id: number;
                email: string;
                name: string;
            };
        } & {
            id: number;
            content: string;
            postId: number;
            authorId: number;
            createdAt: Date;
            updatedAt: Date;
        })[];
    } & {
        id: number;
        content: string;
        authorId: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        published: boolean;
    }>;
    update(id: number, updatePostDto: UpdatePostDto, userId: number, userRole: Role): Promise<{
        author: {
            id: number;
            email: string;
            name: string;
        };
    } & {
        id: number;
        content: string;
        authorId: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        published: boolean;
    }>;
    remove(id: number, userId: number, userRole: Role): Promise<{
        id: number;
        content: string;
        authorId: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        published: boolean;
    }>;
}
