import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    // Nếu có một trường dữ liệu cụ thể được yêu cầu, chỉ trả về trường đó
    if (data) {
      return user?.[data];
    }

    // Nếu không, trả về toàn bộ đối tượng người dùng
    return user;
  },
);
