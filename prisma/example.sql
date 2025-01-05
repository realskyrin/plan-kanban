-- 创建 uuid 扩展，如果扩展不存在
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- code/sql/create_tables.sql
-- 创建 User 表
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
    "email" TEXT NOT NULL UNIQUE,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- 创建 UserProject 表
CREATE TABLE "UserProject" (
    "userId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'VIEWER',
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assignedBy" TEXT,

    CONSTRAINT "UserProject_pkey" PRIMARY KEY ("userId","projectId")
);

-- 创建 Project 表
CREATE TABLE "Project" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
    "title" TEXT NOT NULL,
    "description" TEXT,
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE'
);

-- 创建 Task 表
CREATE TABLE "Task" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
    "title" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "projectId" TEXT NOT NULL,
    "assigneeId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'TODO',
    "priority" TEXT NOT NULL DEFAULT 'MEDIUM'
);

-- 创建 ProjectStatus 枚举类型
CREATE TYPE "ProjectStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'ARCHIVED');
ALTER TABLE "Project" ALTER COLUMN "status" TYPE "ProjectStatus" USING status::"ProjectStatus";

-- 创建 TaskStatus 枚举类型
CREATE TYPE "TaskStatus" AS ENUM ('TODO', 'IN_PROGRESS', 'DONE');
ALTER TABLE "Task" ALTER COLUMN "status" TYPE "TaskStatus" USING status::"TaskStatus";

-- 创建 TaskPriority 枚举类型
CREATE TYPE "TaskPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH');
ALTER TABLE "Task" ALTER COLUMN "priority" TYPE "TaskPriority" USING priority::"TaskPriority";

-- 创建 UserRole 枚举类型
CREATE TYPE "UserRole" AS ENUM ('OWNER', 'EDITOR', 'VIEWER');
ALTER TABLE "UserProject" ALTER COLUMN "role" TYPE "UserRole" USING role::"UserRole";

-- 添加外键约束
ALTER TABLE "UserProject" ADD CONSTRAINT "UserProject_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE "UserProject" ADD CONSTRAINT "UserProject_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE "UserProject" ADD CONSTRAINT "UserProject_assignedBy_fkey" FOREIGN KEY ("assignedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

ALTER TABLE "Project" ADD CONSTRAINT "Project_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

ALTER TABLE "Task" ADD CONSTRAINT "Task_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE "Task" ADD CONSTRAINT "Task_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- 创建索引
CREATE INDEX "UserProject_projectId_idx" ON "UserProject"("projectId");
CREATE INDEX "UserProject_userId_idx" ON "UserProject"("userId");
CREATE INDEX "Project_ownerId_idx" ON "Project"("ownerId");
CREATE INDEX "Task_projectId_idx" ON "Task"("projectId");
CREATE INDEX "Task_assigneeId_idx" ON "Task"("assigneeId");