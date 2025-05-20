# Backend API với NestJS

Backend cho hệ thống ZBase, xây dựng bằng NestJS, Prisma ORM và PostgreSQL.

## Cài đặt

1. Cài đặt các dependencies:
```bash
npm install
```

2. Cấu hình PostgreSQL trong file `.env`.

3. Chạy script cài đặt tự động (thiết lập database và tạo dữ liệu mẫu):
```bash
npm run setup
```

Script sẽ tự động:
- Kiểm tra cấu hình database
- Chuyển đổi Prisma schema nếu cần
- Chạy migrations
- Tạo dữ liệu mẫu

Nếu bạn muốn cài đặt thủ công, hãy làm theo các bước sau:

```bash
# Tạo database và áp dụng migrations
npx prisma migrate dev --name init

# Tạo dữ liệu mẫu
npm run db:seed
```

## Chạy ứng dụng

### Development mode:
```bash
npm run start:dev
```

### Production mode:
```bash
npm run build
npm run start:prod
```

API sẽ khả dụng tại `http://localhost:8000/api`.
Health check endpoint: `http://localhost:8000/api/health`.

## Các API Endpoints

### Auth

- `POST /api/auth/register` - Đăng ký tài khoản mới
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/profile` - Lấy thông tin profile (yêu cầu xác thực)

### Users

- `GET /api/users` - Lấy danh sách người dùng (chỉ ADMIN)
- `GET /api/users/:id` - Lấy thông tin một người dùng
- `PATCH /api/users/:id` - Cập nhật thông tin người dùng (chỉ ADMIN)
- `DELETE /api/users/:id` - Xóa người dùng (chỉ ADMIN)

### Posts

- `POST /api/posts` - Tạo bài viết mới
- `GET /api/posts` - Lấy danh sách bài viết
- `GET /api/posts/:id` - Lấy thông tin một bài viết
- `PATCH /api/posts/:id` - Cập nhật bài viết
- `DELETE /api/posts/:id` - Xóa bài viết

### Comments

- `POST /api/comments` - Tạo bình luận mới
- `GET /api/comments?postId=:postId` - Lấy danh sách bình luận của một bài viết
- `GET /api/comments/:id` - Lấy thông tin một bình luận
- `PATCH /api/comments/:id` - Cập nhật bình luận
- `DELETE /api/comments/:id` - Xóa bình luận

## Tài khoản demo

- Admin: `admin@example.com` / `password`
- User: `user@example.com` / `password`
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
