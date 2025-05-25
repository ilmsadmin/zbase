import { IsString, IsOptional, IsBoolean, IsDateString, IsIn, IsNumber, Min, IsArray, ArrayMinSize, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CommentStatus, CommentType } from '@prisma/client';

export class CommentQueryDto {
  @ApiPropertyOptional({
    description: 'Filter by specific page ID',
  })
  @IsOptional()
  @IsString()
  pageId?: string;

  @ApiPropertyOptional({
    description: 'Filter by specific post ID',
  })
  @IsOptional()
  @IsString()
  postId?: string;

  @ApiPropertyOptional({
    description: 'Filter by comment status',
    enum: CommentStatus,
  })
  @IsOptional()
  @IsIn(Object.values(CommentStatus))
  status?: CommentStatus;

  @ApiPropertyOptional({
    description: 'Filter by comment type',
    enum: CommentType,
  })
  @IsOptional()
  @IsIn(Object.values(CommentType))
  type?: CommentType;

  @ApiPropertyOptional({
    description: 'Filter comments from this date',
    example: '2025-01-01T00:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @ApiPropertyOptional({
    description: 'Filter comments until this date',
    example: '2025-01-31T23:59:59Z',
  })
  @IsOptional()
  @IsDateString()
  toDate?: string;

  @ApiPropertyOptional({
    description: 'Search in comment content',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  search?: string;

  @ApiPropertyOptional({
    description: 'Number of results to skip for pagination',
    minimum: 0,
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  skip?: number;

  @ApiPropertyOptional({
    description: 'Maximum number of results to return',
    minimum: 1,
    maximum: 100,
    default: 25,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  take?: number;

  @ApiPropertyOptional({
    description: 'Sort field',
    enum: ['createdAt', 'updatedAt', 'likeCount', 'fromName'],
    default: 'createdAt',
  })
  @IsOptional()
  @IsIn(['createdAt', 'updatedAt', 'likeCount', 'fromName'])
  sortBy?: 'createdAt' | 'updatedAt' | 'likeCount' | 'fromName';

  @ApiPropertyOptional({
    description: 'Sort order',
    enum: ['asc', 'desc'],
    default: 'desc',
  })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc';
}

export class ReplyCommentDto {
  @ApiProperty({
    description: 'Reply content',
    example: 'Thank you for your feedback! We appreciate your comment.',
    maxLength: 8000,
  })
  @IsString()
  @MaxLength(8000)
  content: string;

  @ApiPropertyOptional({
    description: 'Attachments for the reply (images, files, etc.)',
  })
  @IsOptional()
  attachments?: any[];

  @ApiPropertyOptional({
    description: 'Include private message offer',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  offerPrivateMessage?: boolean;

  @ApiPropertyOptional({
    description: 'Auto-translate reply if needed',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  autoTranslate?: boolean;
}

export class UpdateCommentDto {
  @ApiPropertyOptional({
    description: 'Update comment status',
    enum: CommentStatus,
  })
  @IsOptional()
  @IsIn(Object.values(CommentStatus))
  status?: CommentStatus;

  @ApiPropertyOptional({
    description: 'Update comment type',
    enum: CommentType,
  })
  @IsOptional()
  @IsIn(Object.values(CommentType))
  type?: CommentType;

  @ApiPropertyOptional({
    description: 'Admin notes for internal use',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  adminNotes?: string;

  @ApiPropertyOptional({
    description: 'Mark comment as important',
  })
  @IsOptional()
  @IsBoolean()
  isImportant?: boolean;

  @ApiPropertyOptional({
    description: 'Assign comment to team member',
  })
  @IsOptional()
  @IsString()
  assignedTo?: string;

  @ApiPropertyOptional({
    description: 'Set follow-up reminder date',
    example: '2025-01-15T10:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  followUpDate?: string;
}

export class ReplyToCommentDto {
  @ApiProperty({
    description: 'Reply content',
    example: 'Thank you for your feedback! We appreciate your comment.',
    maxLength: 8000,
  })
  @IsString()
  @MaxLength(8000)
  content: string;

  @ApiPropertyOptional({
    description: 'Include private message offer',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  offerPrivateMessage?: boolean;

  @ApiPropertyOptional({
    description: 'Auto-translate reply if needed',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  autoTranslate?: boolean;
}

export class CommentFiltersDto {
  @ApiPropertyOptional({
    description: 'Filter by specific page ID',
  })
  @IsOptional()
  @IsString()
  pageId?: string;

  @ApiPropertyOptional({
    description: 'Filter by specific post ID',
  })
  @IsOptional()
  @IsString()
  postId?: string;

  @ApiPropertyOptional({
    description: 'Filter by comment status',
    enum: CommentStatus,
  })
  @IsOptional()
  @IsIn(Object.values(CommentStatus))
  status?: CommentStatus;

  @ApiPropertyOptional({
    description: 'Filter by comment type',
    enum: CommentType,
  })
  @IsOptional()
  @IsIn(Object.values(CommentType))
  type?: CommentType;

  @ApiPropertyOptional({
    description: 'Filter by parent comment ID (null for top-level comments)',
  })
  @IsOptional()
  @IsString()
  parentCommentId?: string | null;

  @ApiPropertyOptional({
    description: 'Filter comments from this date',
    example: '2025-01-01T00:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @ApiPropertyOptional({
    description: 'Filter comments until this date',
    example: '2025-01-31T23:59:59Z',
  })
  @IsOptional()
  @IsDateString()
  toDate?: string;

  @ApiPropertyOptional({
    description: 'Search in comment content',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter by commenter name',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  fromName?: string;

  @ApiPropertyOptional({
    description: 'Filter comments that have replies',
  })
  @IsOptional()
  @IsBoolean()
  hasReply?: boolean;

  @ApiPropertyOptional({
    description: 'Filter by minimum like count',
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minLikes?: number;

  @ApiPropertyOptional({
    description: 'Number of results to skip',
    minimum: 0,
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  offset?: number;

  @ApiPropertyOptional({
    description: 'Maximum number of results to return',
    minimum: 1,
    maximum: 100,
    default: 25,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  limit?: number;

  @ApiPropertyOptional({
    description: 'Sort field',
    enum: ['createdAt', 'likeCount', 'fromName'],
    default: 'createdAt',
  })
  @IsOptional()
  @IsIn(['createdAt', 'likeCount', 'fromName'])
  sortBy?: 'createdAt' | 'likeCount' | 'fromName';

  @ApiPropertyOptional({
    description: 'Sort order',
    enum: ['asc', 'desc'],
    default: 'desc',
  })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc';
}

export class CommentActionDto {
  @ApiProperty({
    description: 'Action to perform on comments',
    enum: ['hide', 'delete', 'approve', 'reply'],
  })
  @IsIn(['hide', 'delete', 'approve', 'reply'])
  action: 'hide' | 'delete' | 'approve' | 'reply';

  @ApiPropertyOptional({
    description: 'Reply content (required if action is reply)',
    maxLength: 8000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(8000)
  replyContent?: string;

  @ApiPropertyOptional({
    description: 'Reason for the action (for logging)',
    maxLength: 200,
  })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  reason?: string;

  @ApiPropertyOptional({
    description: 'Send notification to page admins',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  notifyAdmins?: boolean;
}

export class BulkCommentActionDto {
  @ApiProperty({
    description: 'List of comment IDs to perform action on',
    type: [String],
    minItems: 1,
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  commentIds: string[];

  @ApiProperty({
    description: 'Action details',
  })
  action: CommentActionDto;

  @ApiPropertyOptional({
    description: 'Additional data for the action',
  })
  @IsOptional()
  data?: any;
}

export class CommentModerationDto {
  @ApiProperty({
    description: 'Enable auto-moderation',
    default: false,
  })
  @IsBoolean()
  enabled: boolean;

  @ApiPropertyOptional({
    description: 'Keywords to trigger auto-moderation',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  keywords?: string[];

  @ApiPropertyOptional({
    description: 'Action to take on flagged comments',
    enum: ['hide', 'delete', 'flag'],
    default: 'flag',
  })
  @IsOptional()
  @IsIn(['hide', 'delete', 'flag'])
  action?: 'hide' | 'delete' | 'flag';

  @ApiPropertyOptional({
    description: 'Enable sentiment analysis',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  sentimentAnalysis?: boolean;

  @ApiPropertyOptional({
    description: 'Minimum sentiment score to allow (-1 to 1)',
    minimum: -1,
    maximum: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(-1)
  minSentimentScore?: number;
}

export class CommentTemplateDto {
  @ApiProperty({
    description: 'Template name',
    maxLength: 100,
  })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiProperty({
    description: 'Template content',
    maxLength: 8000,
  })
  @IsString()
  @MaxLength(8000)
  content: string;

  @ApiPropertyOptional({
    description: 'Template category',
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  category?: string;

  @ApiPropertyOptional({
    description: 'Template tags for filtering',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({
    description: 'Is template active',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class CommentStatsDto {
  @ApiPropertyOptional({
    description: 'Start date for statistics',
    example: '2025-01-01T00:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @ApiPropertyOptional({
    description: 'End date for statistics',
    example: '2025-01-31T23:59:59Z',
  })
  @IsOptional()
  @IsDateString()
  toDate?: string;

  @ApiPropertyOptional({
    description: 'Group by period',
    enum: ['day', 'week', 'month'],
    default: 'day',
  })
  @IsOptional()
  @IsIn(['day', 'week', 'month'])
  groupBy?: 'day' | 'week' | 'month';

  @ApiPropertyOptional({
    description: 'Include sentiment analysis',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  includeSentiment?: boolean;
}

export class CommentExportDto extends CommentFiltersDto {
  @ApiPropertyOptional({
    description: 'Export format',
    enum: ['csv', 'json', 'xlsx'],
    default: 'csv',
  })
  @IsOptional()
  @IsIn(['csv', 'json', 'xlsx'])
  format?: 'csv' | 'json' | 'xlsx';

  @ApiPropertyOptional({
    description: 'Include replies in export',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  includeReplies?: boolean;

  @ApiPropertyOptional({
    description: 'Include comment metadata',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  includeMetadata?: boolean;
}
