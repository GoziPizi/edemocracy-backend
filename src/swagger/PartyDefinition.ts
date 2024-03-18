import { PartyCreateInput } from "@/types/dtos/PartyDto";

export const PartyCreateInputDefinition: PartyCreateInput = {
    name: 'string',
    description: 'optional',
    reason: 'optional',
    founder: { connect: { id: 'founderId' } },
    createdAt: new Date(),
    updatedAt: new Date()
}