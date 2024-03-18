import { Prisma } from "@prisma/client";

export type PartyCreateInput = Omit<Prisma.PartyCreateInput, "logo">;