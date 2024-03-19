-- CreateTable
CREATE TABLE "_PartyMembers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_PartyMembers_AB_unique" ON "_PartyMembers"("A", "B");

-- CreateIndex
CREATE INDEX "_PartyMembers_B_index" ON "_PartyMembers"("B");

-- AddForeignKey
ALTER TABLE "_PartyMembers" ADD CONSTRAINT "_PartyMembers_A_fkey" FOREIGN KEY ("A") REFERENCES "Party"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PartyMembers" ADD CONSTRAINT "_PartyMembers_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
