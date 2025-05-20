import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Role } from '../common/enums/role.enum';
export declare class CommentsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createCommentDto: CreateCommentDto, userId: number): Promise<{
        post: {
            id: number;
            title: string;
        };
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
    }>;
    findAll(postId: number): Promise<({
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
    })[]>;
    findOne(id: number): Promise<{
        post: {
            id: number;
            title: string;
            published: boolean;
        };
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
    }>;
    update(id: number, updateCommentDto: UpdateCommentDto, userId: number, userRole: Role): Promise<{
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
    }>;
    remove(id: number, userId: number, userRole: Role): Promise<{
        id: number;
        content: string;
        postId: number;
        authorId: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
