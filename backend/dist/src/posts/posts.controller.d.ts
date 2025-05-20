import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
export declare class PostsController {
    private readonly postsService;
    constructor(postsService: PostsService);
    create(createPostDto: CreatePostDto, req: any): Promise<{
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
    findAll(req: any): Promise<({
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
    findOne(id: number, req: any): Promise<{
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
    update(id: number, updatePostDto: UpdatePostDto, req: any): Promise<{
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
    remove(id: number, req: any): Promise<{
        id: number;
        content: string;
        authorId: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        published: boolean;
    }>;
}
