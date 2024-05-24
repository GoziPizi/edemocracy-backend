/*
  Warnings:

  - You are about to drop the column `nbVotes` on the `DebateResult` table. All the data in the column will be lost.
  - You are about to drop the column `score` on the `DebateResult` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "DebateResult" DROP COLUMN "nbVotes",
DROP COLUMN "score",
ADD COLUMN     "nbAgainst" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "nbFor" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "nbNeutral" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "nbReallyAgainst" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "nbReallyFor" INTEGER NOT NULL DEFAULT 0;
