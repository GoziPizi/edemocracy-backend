-- AlterTable
ALTER TABLE "Argument" ADD COLUMN     "isFlaged" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Debate" ADD COLUMN     "isFlaged" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "popularityScore" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Follow" ADD COLUMN     "nbUpdatesSinceLastView" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Notifications" ALTER COLUMN "type" DROP NOT NULL;

-- AlterTable
ALTER TABLE "PartyComment" ADD COLUMN     "isFlaged" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "reputation" INTEGER NOT NULL DEFAULT 0;
