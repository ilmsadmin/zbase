import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class PushPostsDto {
  @ApiProperty({ 
    description: 'Array of post IDs to push to WordPress',
    type: [Number],
    example: [1, 2, 3]
  })
  @IsArray()
  @IsNotEmpty({ message: 'Post IDs array is required' })
  @IsNumber({}, { each: true, message: 'Each post ID must be a number' })
  postIds: number[];
}
