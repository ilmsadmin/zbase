/*
  Warnings:

  - A unique constraint covering the columns `[sku]` on the table `Product` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "CommentStatus" AS ENUM ('PENDING', 'REPLIED', 'HIDDEN', 'DELETED', 'IGNORED', 'APPROVED', 'PUBLISHED');

-- CreateEnum
CREATE TYPE "CommentType" AS ENUM ('COMMENT', 'REPLY', 'MENTION', 'REVIEW');

-- CreateEnum
CREATE TYPE "MessageStatus" AS ENUM ('PENDING', 'READ', 'UNREAD', 'REPLIED', 'ARCHIVED', 'PROCESSED', 'SENT');

-- CreateEnum
CREATE TYPE "MessageType" AS ENUM ('TEXT', 'IMAGE', 'VIDEO', 'AUDIO', 'FILE', 'STICKER', 'REACTION', 'SENT', 'RECEIVED');

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "dimensions" TEXT,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "maxStockLevel" DECIMAL(10,2),
ADD COLUMN     "minStockLevel" DECIMAL(10,2),
ADD COLUMN     "price" DECIMAL(15,2),
ADD COLUMN     "reorderLevel" DECIMAL(10,2),
ADD COLUMN     "sku" TEXT,
ADD COLUMN     "weight" DECIMAL(10,3);

-- AlterTable
ALTER TABLE "ProductCategory" ADD COLUMN     "description" TEXT;

-- CreateTable
CREATE TABLE "facebook_users" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "name" TEXT,
    "profilePicture" TEXT,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT,
    "tokenExpiresAt" TIMESTAMP(3),
    "scopes" TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "userId" INTEGER NOT NULL,
    "connectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSyncAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "facebook_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "facebook_pages" (
    "id" TEXT NOT NULL,
    "facebookPageId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT,
    "profilePicture" TEXT,
    "pictureUrl" TEXT,
    "coverPhoto" TEXT,
    "about" TEXT,
    "website" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "fanCount" INTEGER NOT NULL DEFAULT 0,
    "accessToken" TEXT NOT NULL,
    "permissions" TEXT[],
    "isConnected" BOOLEAN NOT NULL DEFAULT true,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "settings" JSONB,
    "facebookUserId" TEXT NOT NULL,
    "connectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSyncAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "facebook_pages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "facebook_messages" (
    "id" TEXT NOT NULL,
    "facebookMessageId" TEXT,
    "facebookPageId" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "fromId" TEXT NOT NULL,
    "fromName" TEXT NOT NULL,
    "fromEmail" TEXT,
    "message" TEXT NOT NULL,
    "content" TEXT,
    "messageType" "MessageType" NOT NULL DEFAULT 'TEXT',
    "type" "MessageType" NOT NULL DEFAULT 'TEXT',
    "attachments" JSONB,
    "isFromPage" BOOLEAN NOT NULL DEFAULT false,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3),
    "replyToId" TEXT,
    "pageId" TEXT NOT NULL,
    "status" "MessageStatus" NOT NULL DEFAULT 'PENDING',
    "processedAt" TIMESTAMP(3),
    "processedBy" INTEGER,
    "sentAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "facebook_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "facebook_comments" (
    "id" TEXT NOT NULL,
    "facebookCommentId" TEXT NOT NULL,
    "facebookPageId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "fromId" TEXT NOT NULL,
    "fromName" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "content" TEXT,
    "attachmentType" TEXT,
    "attachmentUrl" TEXT,
    "isHidden" BOOLEAN NOT NULL DEFAULT false,
    "canRemove" BOOLEAN NOT NULL DEFAULT false,
    "canHide" BOOLEAN NOT NULL DEFAULT false,
    "canReply" BOOLEAN NOT NULL DEFAULT true,
    "hasReply" BOOLEAN NOT NULL DEFAULT false,
    "parentId" TEXT,
    "parentCommentId" TEXT,
    "pageId" TEXT NOT NULL,
    "status" "CommentStatus" NOT NULL DEFAULT 'PENDING',
    "type" "CommentType" NOT NULL DEFAULT 'COMMENT',
    "processedAt" TIMESTAMP(3),
    "processedBy" INTEGER,
    "replyText" TEXT,
    "repliedAt" TIMESTAMP(3),
    "hiddenAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),
    "approvedAt" TIMESTAMP(3),
    "likeCount" INTEGER NOT NULL DEFAULT 0,
    "createdTime" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "facebook_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "facebook_activity_logs" (
    "id" SERIAL NOT NULL,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT,
    "facebookUserId" TEXT,
    "pageId" TEXT,
    "systemUserId" INTEGER,
    "details" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "status" TEXT NOT NULL DEFAULT 'success',
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "facebook_activity_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "facebook_users_userId_key" ON "facebook_users"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "facebook_pages_facebookPageId_key" ON "facebook_pages"("facebookPageId");

-- CreateIndex
CREATE INDEX "facebook_messages_pageId_sentAt_idx" ON "facebook_messages"("pageId", "sentAt");

-- CreateIndex
CREATE INDEX "facebook_messages_conversationId_idx" ON "facebook_messages"("conversationId");

-- CreateIndex
CREATE INDEX "facebook_messages_status_idx" ON "facebook_messages"("status");

-- CreateIndex
CREATE UNIQUE INDEX "facebook_comments_facebookCommentId_key" ON "facebook_comments"("facebookCommentId");

-- CreateIndex
CREATE INDEX "facebook_comments_pageId_createdTime_idx" ON "facebook_comments"("pageId", "createdTime");

-- CreateIndex
CREATE INDEX "facebook_comments_postId_idx" ON "facebook_comments"("postId");

-- CreateIndex
CREATE INDEX "facebook_comments_status_idx" ON "facebook_comments"("status");

-- CreateIndex
CREATE INDEX "facebook_activity_logs_facebookUserId_createdAt_idx" ON "facebook_activity_logs"("facebookUserId", "createdAt");

-- CreateIndex
CREATE INDEX "facebook_activity_logs_pageId_createdAt_idx" ON "facebook_activity_logs"("pageId", "createdAt");

-- CreateIndex
CREATE INDEX "facebook_activity_logs_action_createdAt_idx" ON "facebook_activity_logs"("action", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Product_sku_key" ON "Product"("sku");

-- AddForeignKey
ALTER TABLE "facebook_users" ADD CONSTRAINT "facebook_users_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "facebook_pages" ADD CONSTRAINT "facebook_pages_facebookUserId_fkey" FOREIGN KEY ("facebookUserId") REFERENCES "facebook_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "facebook_messages" ADD CONSTRAINT "facebook_messages_replyToId_fkey" FOREIGN KEY ("replyToId") REFERENCES "facebook_messages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "facebook_messages" ADD CONSTRAINT "facebook_messages_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "facebook_pages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "facebook_messages" ADD CONSTRAINT "facebook_messages_processedBy_fkey" FOREIGN KEY ("processedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "facebook_comments" ADD CONSTRAINT "facebook_comments_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "facebook_comments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "facebook_comments" ADD CONSTRAINT "facebook_comments_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "facebook_pages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "facebook_comments" ADD CONSTRAINT "facebook_comments_processedBy_fkey" FOREIGN KEY ("processedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "facebook_activity_logs" ADD CONSTRAINT "facebook_activity_logs_facebookUserId_fkey" FOREIGN KEY ("facebookUserId") REFERENCES "facebook_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "facebook_activity_logs" ADD CONSTRAINT "facebook_activity_logs_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "facebook_pages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "facebook_activity_logs" ADD CONSTRAINT "facebook_activity_logs_systemUserId_fkey" FOREIGN KEY ("systemUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
