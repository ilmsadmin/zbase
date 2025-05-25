import { IsString, IsOptional, IsBoolean, IsDateString, IsJSON, IsEnum, IsNumber, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum MessageStatus {
  PENDING = 'PENDING',
  READ = 'READ',
  UNREAD = 'UNREAD',
  REPLIED = 'REPLIED',
  ARCHIVED = 'ARCHIVED',
  PROCESSED = 'PROCESSED',
  SENT = 'SENT',
}

export enum MessageType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO',
  FILE = 'FILE',
  STICKER = 'STICKER',
  REACTION = 'REACTION',
  SENT = 'SENT',
  RECEIVED = 'RECEIVED',
}

export class FacebookMessageDto {
  @ApiProperty({ description: 'Facebook Message ID' })
  @IsString()
  id: string;

  @ApiProperty({ description: 'Conversation ID' })
  @IsString()
  conversationId: string;

  @ApiProperty({ description: 'Sender Facebook ID' })
  @IsString()
  fromId: string;

  @ApiProperty({ description: 'Sender name' })
  @IsString()
  fromName: string;

  @ApiPropertyOptional({ description: 'Sender email if available' })
  @IsOptional()
  @IsString()
  fromEmail?: string;

  @ApiProperty({ description: 'Message content' })
  @IsString()
  message: string;

  @ApiProperty({ 
    description: 'Message type',
    enum: MessageType,
    default: MessageType.TEXT,
  })
  @IsEnum(MessageType)
  messageType: MessageType;

  @ApiPropertyOptional({ description: 'Attachments metadata' })
  @IsOptional()
  @IsJSON()
  attachments?: any;

  @ApiProperty({ description: 'Whether message is from page (sent) or received' })
  @IsBoolean()
  isFromPage: boolean;

  @ApiProperty({ description: 'Whether message has been read' })
  @IsBoolean()
  isRead: boolean;

  @ApiPropertyOptional({ description: 'When message was read' })
  @IsOptional()
  @IsDateString()
  readAt?: string;

  @ApiPropertyOptional({ description: 'Original message ID if this is a reply' })
  @IsOptional()
  @IsString()
  replyToId?: string;

  @ApiProperty({ 
    description: 'Processing status',
    enum: MessageStatus,
    default: MessageStatus.PENDING,
  })
  @IsEnum(MessageStatus)
  status: MessageStatus;

  @ApiPropertyOptional({ description: 'When message was processed' })
  @IsOptional()
  @IsDateString()
  processedAt?: string;

  @ApiProperty({ description: 'When message was sent on Facebook' })
  @IsDateString()
  sentAt: string;
}

export class CreateFacebookMessageDto {
  @ApiProperty({ description: 'Facebook Message ID' })
  @IsString()
  id: string;

  @ApiProperty({ description: 'Conversation ID' })
  @IsString()
  conversationId: string;

  @ApiProperty({ description: 'Sender Facebook ID' })
  @IsString()
  fromId: string;

  @ApiProperty({ description: 'Sender name' })
  @IsString()
  fromName: string;

  @ApiPropertyOptional({ description: 'Sender email if available' })
  @IsOptional()
  @IsString()
  fromEmail?: string;

  @ApiProperty({ description: 'Message content' })
  @IsString()
  message: string;

  @ApiPropertyOptional({ 
    description: 'Message type',
    enum: MessageType,
    default: MessageType.TEXT,
  })
  @IsOptional()
  @IsEnum(MessageType)
  messageType?: MessageType;

  @ApiPropertyOptional({ description: 'Attachments metadata' })
  @IsOptional()
  attachments?: any;

  @ApiPropertyOptional({ description: 'Whether message is from page (sent) or received' })
  @IsOptional()
  @IsBoolean()
  isFromPage?: boolean;

  @ApiPropertyOptional({ description: 'Original message ID if this is a reply' })
  @IsOptional()
  @IsString()
  replyToId?: string;

  @ApiProperty({ description: 'Facebook Page ID' })
  @IsString()
  pageId: string;

  @ApiProperty({ description: 'When message was sent on Facebook' })
  @IsDateString()
  sentAt: string;
}

export class ReplyToMessageDto {
  @ApiProperty({ description: 'Reply message content' })
  @IsString()
  message: string;

  @ApiPropertyOptional({ 
    description: 'Message type',
    enum: MessageType,
    default: MessageType.TEXT,
  })
  @IsOptional()
  @IsEnum(MessageType)
  messageType?: MessageType;

  @ApiPropertyOptional({ description: 'Attachments for the reply' })
  @IsOptional()
  attachments?: any;
}

export class MessageQueryDto {
  @ApiPropertyOptional({ description: 'Filter by page ID' })
  @IsOptional()
  @IsString()
  pageId?: string;

  @ApiPropertyOptional({ description: 'Filter by conversation ID' })
  @IsOptional()
  @IsString()
  conversationId?: string;

  @ApiPropertyOptional({ description: 'Filter by read status' })
  @IsOptional()
  @IsBoolean()
  isRead?: boolean;

  @ApiPropertyOptional({ description: 'Filter by sender (page or customer)' })
  @IsOptional()
  @IsBoolean()
  isFromPage?: boolean;

  @ApiPropertyOptional({ description: 'Search in message content' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Date range start' })
  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @ApiPropertyOptional({ description: 'Date range end' })
  @IsOptional()
  @IsDateString()
  dateTo?: string;

  @ApiPropertyOptional({ description: 'Sort by field' })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiPropertyOptional({ description: 'Sort order' })
  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc';

  @ApiPropertyOptional({ description: 'Number of results to skip' })
  @IsOptional()
  @IsNumber()
  skip?: number;

  @ApiPropertyOptional({ description: 'Number of results to take' })
  @IsOptional()
  @IsNumber()
  take?: number;

  // Additional filter properties for MessageFiltersDto compatibility
  @ApiPropertyOptional({ 
    description: 'Filter by message status',
    enum: MessageStatus,
  })
  @IsOptional()
  @IsEnum(MessageStatus)
  status?: MessageStatus;

  @ApiPropertyOptional({ 
    description: 'Filter by message type',
    enum: MessageType,
  })
  @IsOptional()
  @IsEnum(MessageType)
  type?: MessageType;

  @ApiPropertyOptional({ description: 'From date filter' })
  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @ApiPropertyOptional({ description: 'To date filter' })
  @IsOptional()
  @IsDateString()
  toDate?: string;

  @ApiPropertyOptional({ description: 'Pagination offset' })
  @IsOptional()
  @IsNumber()
  offset?: number;

  @ApiPropertyOptional({ description: 'Pagination limit' })
  @IsOptional()
  @IsNumber()
  limit?: number;
}

export class SendMessageDto {
  @ApiProperty({ description: 'Message content' })
  @IsString()
  message: string;

  @ApiProperty({ description: 'Message content (alias for compatibility)' })
  @IsString()
  content: string;

  @ApiProperty({ description: 'Recipient Facebook ID or conversation ID' })
  @IsString()
  recipientId: string;

  @ApiPropertyOptional({ 
    description: 'Message type',
    enum: MessageType,
    default: MessageType.TEXT,
  })
  @IsOptional()
  @IsEnum(MessageType)
  messageType?: MessageType;

  @ApiPropertyOptional({ description: 'Attachments for the message' })
  @IsOptional()
  attachments?: any;
}

export class UpdateMessageDto {
  @ApiPropertyOptional({ description: 'Update message status' })
  @IsOptional()
  @IsEnum(MessageStatus)
  status?: MessageStatus;

  @ApiPropertyOptional({ description: 'Mark as read' })
  @IsOptional()
  @IsBoolean()
  isRead?: boolean;

  @ApiPropertyOptional({ description: 'Add notes to message' })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class BulkActionDto {
  @ApiProperty({ description: 'Action to perform', enum: ['markRead', 'markUnread', 'archive', 'delete'] })
  @IsString()
  action: 'markRead' | 'markUnread' | 'archive' | 'delete';

  @ApiProperty({ description: 'Message IDs to apply action to', type: [String] })
  @IsArray()
  @IsString({ each: true })
  messageIds: string[];

  @ApiPropertyOptional({ description: 'Additional data for the action' })
  @IsOptional()
  data?: any;
}

export class MarkMessageReadDto {
  @ApiProperty({ description: 'Facebook Message ID to mark as read' })
  @IsString()
  messageId: string;
}

// Alias for backward compatibility
export class MessageFiltersDto extends MessageQueryDto {}
