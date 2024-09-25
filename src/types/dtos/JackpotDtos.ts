import { PersonalJackpot } from "@prisma/client";

export type PersonalJackpotOutputDto = Omit<PersonalJackpot, 'userId' | 'createdAt' | 'updatedAt' >

export type AdminViewPersonalJackpot = Omit<PersonalJackpot, 'createdAt' | 'updatedAt' >