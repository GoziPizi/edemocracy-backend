-- CreateEnum
CREATE TYPE "ArgumentType" AS ENUM ('FOR', 'AGAINST', 'SOLUTION');

-- AlterTable
ALTER TABLE "Argument" ADD COLUMN     "childDebateId" TEXT,
ADD COLUMN     "type" "ArgumentType" NOT NULL DEFAULT 'FOR';
