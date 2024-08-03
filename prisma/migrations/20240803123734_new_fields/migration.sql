-- AlterTable
ALTER TABLE "Party" ALTER COLUMN "logo" SET DEFAULT '';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "actualSex" TEXT,
ADD COLUMN     "birthSex" TEXT,
ADD COLUMN     "formationDuration" TEXT,
ADD COLUMN     "formationName" TEXT,
ADD COLUMN     "religion" TEXT,
ADD COLUMN     "sexualOrientation" TEXT,
ALTER COLUMN "profession" DROP NOT NULL;
