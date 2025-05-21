import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}
  async create(createPostDto: CreatePostDto, userId: number) {
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

  async findAll(userId: number, userRole: Role) {
    // Admin can see all posts, regular users can see only published posts or their own
    if (userRole === Role.ADMIN) {
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
    } else {
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

  async findOne(id: number, userId: number, userRole: Role) {
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
      throw new NotFoundException(`Post with ID ${id} not found`);
    }    // Check if user has permission to view unpublished post
    if (!post.published && post.authorId !== userId && userRole !== Role.ADMIN) {
      throw new ForbiddenException('You do not have permission to view this post');
    }

    return post;
  }

  async update(id: number, updatePostDto: UpdatePostDto, userId: number, userRole: Role) {
    // Check if post exists
    const post = await this.findOne(id, userId, userRole);    // Check if user has permission to update this post
    if (post.authorId !== userId && userRole !== Role.ADMIN) {
      throw new ForbiddenException('You do not have permission to update this post');
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

  async remove(id: number, userId: number, userRole: Role) {
    // Check if post exists
    const post = await this.findOne(id, userId, userRole);

    // Check if user has permission to delete this post
    if (post.author.id !== userId && userRole !== Role.ADMIN) {
      throw new ForbiddenException('You do not have permission to delete this post');
    }

    return this.prisma.post.delete({
      where: { id },
    });
  }
}
