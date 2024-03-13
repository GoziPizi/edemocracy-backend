import { Prisma, Personality } from "@prisma/client";
import { UserPublicOutputDto } from "./UserDto";

export type PersonalityOutput = Personality & { user: UserPublicOutputDto }