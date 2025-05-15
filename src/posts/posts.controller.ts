import { Controller, Get, Post, Body, Param, Put, Delete, Query, UseGuards, Logger, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { BadRequestException } from '@nestjs/common';

@ApiTags('Posts')
@ApiBearerAuth()
@Controller('posts')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PostsController {
  private readonly logger = new Logger(PostsController.name);
  
  constructor(private readonly postsService: PostsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all posts' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'List of all posts',
  })
  async findAll() {
    this.logger.log('Getting all posts');
    return this.postsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get post by ID' })
  @ApiParam({ name: 'id', description: 'Post ID' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'The post with the given ID',
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Post not found'
  })
  async findOne(@Param('id') id: string) {
    this.logger.log(`Getting post with ID: ${id}`);
    return this.postsService.findOne(+id);
  }

  @Post()
  @Roles('admin', 'editor')
  @ApiOperation({ summary: 'Create a new post' })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'Post created successfully',
  })
  async create(@Body() createPostDto: CreatePostDto) {
    this.logger.log(`Creating new post: ${createPostDto.title}`);
    return this.postsService.create(createPostDto);
  }

  @Put(':id')
  @Roles('admin', 'editor')
  @ApiOperation({ summary: 'Update post by ID' })
  @ApiParam({ name: 'id', description: 'Post ID' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Post updated successfully',
  })
  async update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    this.logger.log(`Updating post with ID: ${id}`);
    return this.postsService.update(+id, updatePostDto);
  }

  @Delete(':id')
  @Roles('admin', 'editor')
  @ApiOperation({ summary: 'Delete post by ID' })
  @ApiParam({ name: 'id', description: 'Post ID' })
  @ApiResponse({ 
    status: HttpStatus.NO_CONTENT, 
    description: 'Post deleted successfully'
  })
  async remove(@Param('id') id: string) {
    this.logger.log(`Deleting post with ID: ${id}`);
    return this.postsService.remove(+id);
  }

  @Get('/site/:siteId')
  @ApiOperation({ summary: 'Get posts by site ID' })
  @ApiParam({ name: 'siteId', description: 'Site ID' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Posts from the specified site',
  })
  async findBySiteId(@Param('siteId') siteId: string) {
    this.logger.log(`Getting posts from site with ID: ${siteId}`);
    return this.postsService.findBySiteId(+siteId);
  }
  @Post('push')
  @Roles('admin', 'editor')
  @ApiOperation({ summary: 'Push posts to WordPress sites' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Posts pushed successfully',
  })
  async pushPosts(@Body() body: any) {
    this.logger.log(`Received push request for posts: ${JSON.stringify(body)}`);
    
    // Xử lý nhiều trường hợp khác nhau của dữ liệu nhận được
    let postIds: number[] = [];
    
    if (Array.isArray(body)) {
      // Nếu body là một mảng, sử dụng trực tiếp
      postIds = body;
    } else if (body && Array.isArray(body.postIds)) {
      // Nếu body có thuộc tính postIds là một mảng (từ PushPostsDto)
      postIds = body.postIds;
    } else if (body && typeof body === 'object') {
      // Nếu body là một đối tượng, thử chuyển đổi các giá trị thành mảng
      postIds = Object.values(body).filter(value => !isNaN(Number(value))).map(Number);
    }
    
    if (postIds.length === 0) {
      this.logger.error('No valid post IDs found in request');
      throw new BadRequestException('No valid post IDs provided in request');
    }
    
    this.logger.log(`Pushing posts with IDs: ${postIds.join(', ')}`);
    return this.postsService.pushPosts(postIds);
  }

  @Post('sync')
  @Roles('admin', 'editor')
  @ApiOperation({ summary: 'Sync posts from WordPress sites' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Posts synchronized successfully',
  })
  async syncPosts(@Body() siteIds: number[]) {
    this.logger.log(`Syncing posts from sites with IDs: ${siteIds.join(', ')}`);
    return this.postsService.syncPosts(siteIds);
  }
}
