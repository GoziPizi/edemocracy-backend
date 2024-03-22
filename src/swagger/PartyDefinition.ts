import { PartyCreateInput } from "@/types/dtos/PartyDto";
import { Affiliation } from "@prisma/client";

export const PartyCreateInputDefinition: PartyCreateInput = {
    name: 'string',
    description: 'optional',
    reason: 'optional',
    founderId: 'string',
    politicSide: Affiliation.LEFT,
    createdAt: new Date(),
    updatedAt: new Date()
}