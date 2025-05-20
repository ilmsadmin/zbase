import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async create(createCommentDto: CreateCommentDto, userId: number) {
    // Check if post exists and is published
    const post = await this.prisma.post.findUnique({ 
      where: { id: createCommentDto.postId } 
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (!post.published && post.authorId !== userId) {
      throw new ForbiddenException('Cannot comment on unpublished posts');
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

  async findAll(postId: number) {
    // Check if post exists
    const post = await this.prisma.post.findUnique({ 
      where: { id: postId } 
    });

    if (!post) {
      throw new NotFoundException('Post not found');
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

  async findOne(id: number) {
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
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }

    return comment;
  }

  async update(id: number, updateCommentDto: UpdateCommentDto, userId: number, userRole: Role) {
    // Check if comment exists
    const comment = await this.findOne(id);

    // Check permissions - only author or admin can update
    if (comment.author.id !== userId && userRole !== Role.ADMIN) {
      throw new ForbiddenException('You do not have permission to update this comment');
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

  async remove(id: number, userId: number, userRole: Role) {
    // Check if comment exists
    const comment = await this.findOne(id);

    // Check permissions - only author or admin can delete
    if (comment.author.id !== userId && userRole !== Role.ADMIN) {
      throw new ForbiddenException('You do not have permission to delete this comment');
    }

    return this.prisma.comment.delete({
      where: { id },
    });
  }
}
