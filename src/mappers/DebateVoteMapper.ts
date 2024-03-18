import { DebateVoteType } from "@prisma/client";

export const toValue = (value: DebateVoteType) => {
    switch (value) {
        case DebateVoteType.AGAINST:
            return -1;
        case DebateVoteType.FOR:
            return 1;
        case DebateVoteType.NEUTRAL:
            return 0;
        case DebateVoteType.REALLY_AGAINST:
            return -2;
        case DebateVoteType.REALLY_FOR:
            return 2;
    }
};