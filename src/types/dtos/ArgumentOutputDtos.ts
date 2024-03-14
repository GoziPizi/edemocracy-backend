import { Argument } from "@prisma/client";

export type ArgumentWithVoteOutput = Argument & { hasVote: boolean | null}