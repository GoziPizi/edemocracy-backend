import Jwt from "@/classes/Jwt";
import { toValue } from "@/mappers/DebateVoteMapper";
import ArgumentRepository from "@/repositories/ArgumentRepository";
import DebateRepository from "@/repositories/DebateRepository";
import DebateVoteRepository from "@/repositories/DebateVoteRepository";
import TopicRepository from "@/repositories/TopicRepository";
import UserRepository from "@/repositories/UserRepository";
import { ArgumentWithVoteOutput } from "@/types/dtos/ArgumentOutputDtos";
import { Argument, DebateVoteType } from "@prisma/client";

class DebateService {

    private static debateRepository: DebateRepository = new DebateRepository()
    private static argumentRepository: ArgumentRepository = new ArgumentRepository()
    private static debateVoteRepository: DebateVoteRepository = new DebateVoteRepository()
    private static topicRepository: TopicRepository = new TopicRepository()
    private static userRepository: UserRepository = new UserRepository()

    static async createDebate(debate: any) {
        const argument = await this.argumentRepository.getArgumentById(debate.argumentId);
        if(argument && argument.childDebateId) {
            throw new Error('Argument already has a debate');
        }
        const debateResult = await this.debateRepository.createDebateResult();
        const debateContributorsResult = await this.debateRepository.createDebateResult();
        const newDebate = await this.debateRepository.createDebate({
            ...debate,
            debateResultId: debateResult.id,
            debateContributorsResultId: debateContributorsResult.id
        
        });
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
        const debateResult = await this.debateRepository.getDebateResult(debate!.debateResultId);
        const debateContributorsResult = await this.debateRepository.getDebateResult(debate!.debateContributorsResultId);
        const userVote = await this.debateRepository.getDebateVote(id, userId);
        const vote = userVote ? userVote.value : null;
        return {
            ...debate,
            hasVote: vote,
            debateResult,
            debateContributorsResult
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
        const debate = await this.debateRepository.getDebateById(debateId);
        const debateResult = await this.debateRepository.getDebateResult(debate!.debateResultId);
        const debateContributorsResult = await this.debateRepository.getDebateResult(debate!.debateContributorsResultId);
        const actualVote = await this.debateRepository.getDebateVote(debateId, userId);
        console.log(actualVote)
        const user = await this.userRepository.findById(userId);
        const contribution = user!.contribution;

        //Handling vote

        if(actualVote) {
            await this.debateVoteRepository.updateVote(actualVote.id, value, contribution);
        } else {
            await this.debateVoteRepository.createVote(userId, debateId, value, contribution);
            //Handling debate nbVotes
            await this.debateRepository.updateDebateResult(debateResult!.id, { nbVotes: debateResult!.nbVotes + 1 });
            if(contribution) {
                await this.debateRepository.updateDebateResult(debateContributorsResult!.id, { nbVotes: debateContributorsResult!.nbVotes + 1 });
            }
        }

        //Handling debate score

        let newScore = debateResult!.score + toValue(value)
        if(actualVote) {
            newScore -= toValue(actualVote.value);
        }
        await this.debateRepository.updateDebateResult(debateResult!.id, { score: newScore });

        if(contribution) {
            let newContributorsScore = debateContributorsResult!.score + toValue(value)
            if(actualVote) {
                newContributorsScore -= toValue(actualVote.value);
            }
            await this.debateRepository.updateDebateResult(debateContributorsResult!.id, { score: newContributorsScore });
        }

        return true;
        
    }

    static async deleteVoteForDebate(debateId: string, userId: string) {
        const debate = await this.debateRepository.getDebateById(debateId);
        const debateResult = await this.debateRepository.getDebateResult(debate!.debateResultId);
        const debateContributorsResult = await this.debateRepository.getDebateResult(debate!.debateContributorsResultId);
        const actualVote = await this.debateRepository.getDebateVote(debateId, userId);
        const user = await this.userRepository.findById(userId);
        const contribution = user!.contribution;

        if(!actualVote) {
            throw new Error('Vote not found');
        }

        //Handling debate nbVotes
        await this.debateRepository.updateDebateResult(debateResult!.id, { nbVotes: debateResult!.nbVotes - 1 });

        if(contribution) {
            await this.debateRepository.updateDebateResult(debateContributorsResult!.id, { nbVotes: debateContributorsResult!.nbVotes - 1 });
        }

        //Handling debate score

        let newScore = debateResult!.score - toValue(actualVote.value);
        await this.debateRepository.updateDebateResult(debateResult!.id, { score: newScore });

        if(contribution) {
            let newContributorsScore = debateContributorsResult!.score - toValue(actualVote.value);
            await this.debateRepository.updateDebateResult(debateContributorsResult!.id, { score: newContributorsScore });
        }

        //Handling vote

        await this.debateVoteRepository.deleteVote(actualVote.id);

        return true;
    }

}

export default DebateService;