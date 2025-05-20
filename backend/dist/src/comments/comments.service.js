"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const role_enum_1 = require("../common/enums/role.enum");
let CommentsService = class CommentsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createCommentDto, userId) {
        const post = await this.prisma.post.findUnique({
            where: { id: createCommentDto.postId }
        });
        if (!post) {
            throw new common_1.NotFoundException('Post not found');
        }
        if (!post.published && post.authorId !== userId) {
            throw new common_1.ForbiddenException('Cannot comment on unpublished posts');
        }
        return this.prisma.comment.create({
            data: {
                content: createCommentDto.content,
                post: {
                    connect: { id: createCommentDto.postId },
                },
                author: {
                    connect: { id: userId },
                },
            },
            include: {
                author: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                    },
                },
                post: {
                    select: {
                        id: true,
                        title: true,
                    },
                },
            },
        });
    }
    async findAll(postId) {
        const post = await this.prisma.post.findUnique({
            where: { id: postId }
        });
        if (!post) {
            throw new common_1.NotFoundException('Post not found');
        }
        return this.prisma.comment.findMany({
            where: { postId },
            include: {
                author: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
    async findOne(id) {
        const comment = await this.prisma.comment.findUnique({
            where: { id },
            include: {
                author: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                    },
                },
                post: {
                    select: {
                        id: true,
                        title: true,
                        published: true,
                    },
                },
            },
        });
        if (!comment) {
            throw new common_1.NotFoundException(`Comment with ID ${id} not found`);
        }
        return comment;
    }
    async update(id, updateCommentDto, userId, userRole) {
        const comment = await this.findOne(id);
        if (comment.author.id !== userId && userRole !== role_enum_1.Role.ADMIN) {
            throw new common_1.ForbiddenException('You do not have permission to update this comment');
        }
        return this.prisma.comment.update({
            where: { id },
            data: {
                content: updateCommentDto.content,
            },
            include: {
                author: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                    },
                },
            },
        });
    }
    async remove(id, userId, userRole) {
        const comment = await this.findOne(id);
        if (comment.author.id !== userId && userRole !== role_enum_1.Role.ADMIN) {
            throw new common_1.ForbiddenException('You do not have permission to delete this comment');
        }
        return this.prisma.comment.delete({
            where: { id },
        });
    }
};
exports.CommentsService = CommentsService;
exports.CommentsService = CommentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CommentsService);
//# sourceMappingURL=comments.service.js.map