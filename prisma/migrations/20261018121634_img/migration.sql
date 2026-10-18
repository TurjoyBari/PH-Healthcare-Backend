-- AlterTable
ALTER TABLE "users" ADD COLUMN     "imagePublicId" TEXT DEFAULT '',
ADD COLUMN     "imageUrl" TEXT DEFAULT '',
ALTER COLUMN "password" DROP NOT NULL;
