import Jwt from "@/classes/Jwt";
import ArgumentRepository from "@/repositories/ArgumentRepository";
import DebateRepository from "@/repositories/DebateRepository";
import { ArgumentWithVoteOutput } from "@/types/dtos/ArgumentOutputDtos";
import { Argument } from "@prisma/client";

class DebateService {

    private static debateRepository: DebateRepository = new DebateRepository()
    private static argumentRepository: ArgumentRepository = new ArgumentRepository()

    static async getDebateById(id: string) {
        const debate = await this.debateRepository.getDebateById(id);
        return debate
    }

    static async getDebateArguments(id: string, token: string) {
        const userId = Jwt.decode(token).payload.id;
        const debateArguments = await this.debateRepository.getDebateArguments(id);
        const debateArgumentsWithUserVote: ArgumentWithVoteOutput[] = await Promise.all(debateArguments.map(async (argument: Argument) => {
            const userVote = await this.argumentRepository.getUserVote(userId, argument.id);
            const vote = userVote ? userVote.value : null;
            return {
                ...argument,
                hasVote: vote
            }
        }));
        return debateArgumentsWithUserVote;
    }

}

export default DebateService;