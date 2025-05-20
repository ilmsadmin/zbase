import { Module, forwardRef } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { AuthModule } from '../auth/auth.module';
import { PermissionsModule } from '../permissions/permissions.module';

@Module({
  imports: [
    forwardRef(() => AuthModule), 
    forwardRef(() => PermissionsModule)
  ],
  controllers: [PostsController],
  providers: [PostsService]
})
export class PostsModule {}
