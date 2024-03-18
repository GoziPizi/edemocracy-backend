import Jwt from "@/classes/Jwt";
import { toValue } from "@/mappers/DebateVoteMapper";
import ArgumentRepository from "@/repositories/ArgumentRepository";
import DebateRepository from "@/repositories/DebateRepository";
import DebateVoteRepository from "@/repositories/DebateVoteRepository";
import { ArgumentWithVoteOutput } from "@/types/dtos/ArgumentOutputDtos";
import { Argument, DebateVoteType } from "@prisma/client";

class DebateService {

    private static debateRepository: DebateRepository = new DebateRepository()
    private static argumentRepository: ArgumentRepository = new ArgumentRepository()
    private static debateVoteRepository: DebateVoteRepository = new DebateVoteRepository()

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

    static async voteForDebate(debateId: string, userId: string, value: DebateVoteType) {
        const actualeVote = await this.debateRepository.getDebateVote(debateId, userId);
        const debate = await this.debateRepository.getDebateById(debateId);
        if(!debate) {
            throw new Error('Debate not found');
        }
        if(actualeVote) {
            await this.debateVoteRepository.updateVote(actualeVote.id, value);
            const score = debate.score - toValue(actualeVote.value) + toValue(value);
            await this.debateRepository.update(debateId, { score });
        } else {
            await this.debateVoteRepository.createVote(userId, debateId, value);
            const score = debate.score + toValue(value);
            const nbVotes = debate.nbVotes + 1;
            await this.debateRepository.update(debateId, { score, nbVotes });
        }
        return;
    }

    static async deleteVoteForDebate(debateId: string, userId: string) {
        const actualeVote = await this.debateRepository.getDebateVote(debateId, userId);
        const debate = await this.debateRepository.getDebateById(debateId);
        if(!debate) {
            throw new Error('Debate not found');
        }
        if(actualeVote) {
            await this.debateVoteRepository.deleteVote(actualeVote.id);
            const score = debate.score - toValue(actualeVote.value);
            const nbVotes = debate.nbVotes - 1;
            await this.debateRepository.update(debateId, { score, nbVotes });
        }
        return;
    }

}

export default DebateService;