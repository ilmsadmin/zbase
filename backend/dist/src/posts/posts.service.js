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
exports.PostsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const role_enum_1 = require("../common/enums/role.enum");
let PostsService = class PostsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createPostDto, userId) {
        return this.prisma.post.create({
            data: {
                ...createPostDto,
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
            },
        });
    }
    async findAll(userId, userRole) {
        if (userRole === role_enum_1.Role.ADMIN) {
            return this.prisma.post.findMany({
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
        else {
            return this.prisma.post.findMany({
                where: {
                    OR: [
                        { published: true },
                        { authorId: userId },
                    ],
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
                orderBy: {
                    createdAt: 'desc',
                },
            });
        }
    }
    async findOne(id, userId, userRole) {
        const post = await this.prisma.post.findUnique({
            where: { id },
            include: {
                author: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                    },
                },
                comments: {
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
                },
            },
        });
        if (!post) {
            throw new common_1.NotFoundException(`Post with ID ${id} not found`);
        }
        if (!post.published && post.author.id !== userId && userRole !== role_enum_1.Role.ADMIN) {
            throw new common_1.ForbiddenException('You do not have permission to view this post');
        }
        return post;
    }
    async update(id, updatePostDto, userId, userRole) {
        const post = await this.findOne(id, userId, userRole);
        if (post.author.id !== userId && userRole !== role_enum_1.Role.ADMIN) {
            throw new common_1.ForbiddenException('You do not have permission to update this post');
        }
        return this.prisma.post.update({
            where: { id },
            data: updatePostDto,
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
        const post = await this.findOne(id, userId, userRole);
        if (post.author.id !== userId && userRole !== role_enum_1.Role.ADMIN) {
            throw new common_1.ForbiddenException('You do not have permission to delete this post');
        }
        return this.prisma.post.delete({
            where: { id },
        });
    }
};
exports.PostsService = PostsService;
exports.PostsService = PostsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PostsService);
//# sourceMappingURL=posts.service.js.map