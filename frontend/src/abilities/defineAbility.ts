import { AbilityBuilder, Ability, AbilityClass, Subject } from "@casl/ability";
import { User } from "@/types/auth";

// Định nghĩa các actions có thể thực hiện
export type Actions = 'create' | 'read' | 'update' | 'delete' | 'manage';

// Định nghĩa các đối tượng trong hệ thống
export type Subjects = 'User' | 'Post' | 'Comment' | 'all';

// Định nghĩa kiểu cho AppAbility
export type AppAbility = Ability<[Actions, Subjects]>;
export const AppAbility = Ability as AbilityClass<AppAbility>;

// Interface cho bài viết và bình luận
interface Post {
  id: string;
  authorId: string;
  isPublic?: boolean;
}

interface Comment {
  id: string;
  authorId: string;
  isPublic?: boolean;
}

// Hàm tạo khả năng dựa trên người dùng
export function defineRulesForUser(user: User | null): AppAbility {
  const { can, cannot, build } = new AbilityBuilder(AppAbility);
    if (!user) {
    // Người dùng chưa đăng nhập chỉ có thể đọc nội dung công khai
    can('read', 'Post');
    can('read', 'Comment');
    return build();
  }

  // Chuẩn hóa role để xử lý không phân biệt chữ hoa/thường
  const normalizedRole = user.role?.toUpperCase();
  
  if (normalizedRole === 'ADMIN') {
    // Admin có thể làm mọi thứ
    can('manage', 'all');
  } else if (normalizedRole === 'USER') {
    // Người dùng thường có thể đọc tất cả bài viết và bình luận
    can('read', 'Post');
    can('read', 'Comment');
    
    // Có thể tạo bài viết và bình luận
    can('create', 'Post');
    can('create', 'Comment');
    
    // Chỉ cập nhật và xóa nội dung của chính mình
    can(['update', 'delete'], 'Post');
    can(['update', 'delete'], 'Comment');
  }
  return build();
}

// Hook để kiểm tra khả năng trong React components
export function createAbilityFor(user: User | null): AppAbility {
  return defineRulesForUser(user);
}
