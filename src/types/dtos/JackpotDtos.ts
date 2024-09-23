import { PersonalJackpot } from "@prisma/client";

export type PersonalJackpotOutputDto = Omit<PersonalJackpot, 'userId' | 'createdAt' | 'updatedAt' >