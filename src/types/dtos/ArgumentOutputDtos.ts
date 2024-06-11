import { Affiliation, Argument } from "@prisma/client";

export type ArgumentOutputDto = Argument & { personalInformations?: {userName?: string, userPoliticSide?: Affiliation, userWork?: string} }

export type ArgumentWithVoteOutputDto = ArgumentOutputDto & { hasVote: boolean | null, childDebateId: string | null}