import Jwt from "@/classes/Jwt";
import { toValue } from "@/mappers/DebateVoteMapper";
import ArgumentRepository from "@/repositories/ArgumentRepository";
import DebateRepository from "@/repositories/DebateRepository";
import DebateVoteRepository from "@/repositories/DebateVoteRepository";
import TopicRepository from "@/repositories/TopicRepository";
import { ArgumentWithVoteOutput } from "@/types/dtos/ArgumentOutputDtos";
import { Argument, DebateVoteType } from "@prisma/client";

class DebateService {

    private static debateRepository: DebateRepository = new DebateRepository()
    private static argumentRepository: ArgumentRepository = new ArgumentRepository()
    private static debateVoteRepository: DebateVoteRepository = new DebateVoteRepository()
    private static topicRepository: TopicRepository = new TopicRepository()

    static async createDebate(debate: any) {
        const argument = await this.argumentRepository.getArgumentById(debate.argumentId);
        if(argument && argument.debateId) {
            throw new Error('Argument already has a debate');
        }
        const newDebate = await this.debateRepository.createDebate(debate);
        if(!newDebate) {
            throw new Error('Debate not created');
        }
        if(newDebate.topicId) {
            await this.topicRepository.addDebateToTopic(newDebate.topicId, newDebate.id);
        }
        if(newDebate.argumentId) {
            await this.argumentRepository.addDebateToArgument(newDebate.argumentId, newDebate.id);
        }
        return newDebate;
    }

    static async getDebateById(id: string) {
        const debate = await this.debateRepository.getDebateById(id);
        return debate
    }

    static async getDebatesByTime(page_size: number = 10, page: number = 1) {
        const debates = await this.debateRepository.getDebatesByTime(page_size, page);
        return debates;
    }   

    static async getDebatesByPopularity(page_size: number = 10, page: number = 1) {
        const debates = await this.debateRepository.getDebatesByPopularity(page_size, page);
        return debates;
    }

    static async getDebateWithUserVote(id: string, userId: string) {
        const debate = await this.debateRepository.getDebateById(id);
        const userVote = await this.debateRepository.getDebateVote(id, userId);
        const vote = userVote ? userVote.value : null;
        return {
            ...debate,
            hasVote: vote
        }
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