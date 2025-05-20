import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
export declare class CommentsController {
    private readonly commentsService;
    constructor(commentsService: CommentsService);
    create(createCommentDto: CreateCommentDto, req: any): Promise<{
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
    update(id: number, updateCommentDto: UpdateCommentDto, req: any): Promise<{
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
    remove(id: number, req: any): Promise<{
        id: number;
        content: string;
        postId: number;
        authorId: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
