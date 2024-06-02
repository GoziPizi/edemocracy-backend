import Jwt from "@/classes/Jwt";
import { toValue } from "@/mappers/DebateVoteMapper";
import ArgumentRepository from "@/repositories/ArgumentRepository";
import DebateRepository from "@/repositories/DebateRepository";
import DebateVoteRepository from "@/repositories/DebateVoteRepository";
import TopicRepository from "@/repositories/TopicRepository";
import UserRepository from "@/repositories/UserRepository";
import { ArgumentWithVoteOutput } from "@/types/dtos/ArgumentOutputDtos";
import { Argument, DebateVoteType } from "@prisma/client";
import ArgumentService from "./ArgumentService";

class DebateService {

    private static debateRepository: DebateRepository = new DebateRepository()
    private static argumentRepository: ArgumentRepository = new ArgumentRepository()
    private static debateVoteRepository: DebateVoteRepository = new DebateVoteRepository()
    private static topicRepository: TopicRepository = new TopicRepository()
    private static userRepository: UserRepository = new UserRepository()

    static async createDebate(debate: any, userId: string) {
        const argument = await this.argumentRepository.getArgumentById(debate.argumentId);
        if(argument && argument.childDebateId) {
            throw new Error('Argument already has a debate');
        }
        //Initialisation of debate results
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
        //Adding debate to argument and topic
        if(newDebate.topicId) {
            await this.topicRepository.addDebateToTopic(newDebate.topicId, newDebate.id);
        }
        if(newDebate.argumentId) {
            await this.argumentRepository.addDebateToArgument(newDebate.argumentId, newDebate.id);
        }
        //Creating the first reformulation (the description itself)
        await this.createDebateReformulation(newDebate.id, debate.description, userId);
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
            debateContributorsResult,
        }
    }

    static async getDebateById(id: string) {
        const debate = await this.debateRepository.getDebateById(id);
        const debateResult = await this.debateRepository.getDebateResult(debate!.debateResultId);
        const debateContributorsResult = await this.debateRepository.getDebateResult(debate!.debateContributorsResultId);
        return {
            ...debate,
            debateResult,
            debateContributorsResult,
        }
    }

    static async getDebateReformulations(id: string) {
        const reformulations = await this.debateRepository.getDebateReformulations(id);
        return reformulations;
    }

    static async getDebateArguments(id: string) {
        const debateArguments = await this.debateRepository.getDebateArguments(id);
        return debateArguments;
    }

    static async getDebateArgumentsWithVote(id: string, userId: string) {
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
        const user = await this.userRepository.findById(userId);
        const contribution = user!.contribution;

        //Handling vote

        if(actualVote) {
            await this.debateVoteRepository.updateVote(actualVote.id, value, contribution);
        } else {
            await this.debateVoteRepository.createVote(userId, debateId, value, contribution);
        }
       
        //Handling debate result

        await this.debateRepository.updateDebateResult(debateResult!.id, this.createNewDebateResult(debateResult, value, actualVote?.value));

        if(contribution) {
            await this.debateRepository.updateDebateResult(debateContributorsResult!.id, this.createNewDebateResult(debateContributorsResult, value, actualVote?.value));
        }
        
    }

    static async deleteVoteForDebate(debateId: string, userId: string) {
        const debate = await this.debateRepository.getDebateById(debateId);
        const debateResult = await this.debateRepository.getDebateResult(debate!.debateResultId);
        const debateContributorsResult = await this.debateRepository.getDebateResult(debate!.debateContributorsResultId);
        const actualVote = await this.debateRepository.getDebateVote(debateId, userId);
        const user = await this.userRepository.findById(userId);
        const contribution = user!.contribution;

        if(!debate) {
            throw new Error('Debate not found');
        }

        if(!actualVote) {
            throw new Error('Vote not found');
        }

        //Handling vote

        await this.debateVoteRepository.deleteVote(actualVote.id);

        //Handling debate result

        let newResult = { ...debateResult! };

        switch(actualVote.value) {
            case DebateVoteType.REALLY_AGAINST:
                newResult.nbReallyAgainst--;
                break;
            case DebateVoteType.AGAINST:
                newResult.nbAgainst--;
                break;
            case DebateVoteType.NEUTRAL:
                newResult.nbNeutral--;
                break;
            case DebateVoteType.FOR:
                newResult.nbFor--;
                break;
            case DebateVoteType.REALLY_FOR:
                newResult.nbReallyFor--;
                break;
        }

        await this.debateRepository.updateDebateResult(debateResult!.id, newResult);

        if(contribution) {
            let newContributorsResult = { ...debateContributorsResult! };

            switch(actualVote.value) {
                case DebateVoteType.REALLY_AGAINST:
                    newContributorsResult.nbReallyAgainst--;
                    break;
                case DebateVoteType.AGAINST:
                    newContributorsResult.nbAgainst--;
                    break;
                case DebateVoteType.NEUTRAL:
                    newContributorsResult.nbNeutral--;
                    break;
                case DebateVoteType.FOR:
                    newContributorsResult.nbFor--;
                    break;
                case DebateVoteType.REALLY_FOR:
                    newContributorsResult.nbReallyFor--;
                    break;
            }

            await this.debateRepository.updateDebateResult(debateContributorsResult!.id, newContributorsResult);
        }
    }

    static createNewDebateResult(debateResult: any, newValue: DebateVoteType, oldValue?: DebateVoteType) {
        let newResult = { ...debateResult };
        switch(oldValue) {
            case DebateVoteType.REALLY_AGAINST:
                newResult.nbReallyAgainst--;
                break;
            case DebateVoteType.AGAINST:
                newResult.nbAgainst--;
                break;
            case DebateVoteType.NEUTRAL:
                newResult.nbNeutral--;
                break;
            case DebateVoteType.FOR:
                newResult.nbFor--;
                break;
            case DebateVoteType.REALLY_FOR:
                newResult.nbReallyFor--;
                break;
        }
        switch(newValue) {
            case DebateVoteType.REALLY_AGAINST:
                newResult.nbReallyAgainst++;
                break;
            case DebateVoteType.AGAINST:
                newResult.nbAgainst++;
                break;
            case DebateVoteType.NEUTRAL:
                newResult.nbNeutral++;
                break;
            case DebateVoteType.FOR:
                newResult.nbFor++;
                break;
            case DebateVoteType.REALLY_FOR:
                newResult.nbReallyFor++;
                break;
        }
        return newResult;
    }

    //Reformulation related Debate

    static async createDebateReformulation(debateId: string, reformulationContent: string, userId: string) {
        const debate = await this.debateRepository.getDebateById(debateId);
        if(!debate) {
            throw new Error('Debate not found');
        }
        const reformulation = await this.debateRepository.createDebateReformulation(debateId, reformulationContent, userId);
        return reformulation;
    }

    static async voteForReformulation(reformulationId: string, userId: string, value: boolean | null) {
        const actualReformulationVote = await this.debateRepository.getDebateReformulationVote(reformulationId, userId);
        const reformulation = await this.debateRepository.getDebateReformulation(reformulationId);
        if(!reformulation) {
            throw new Error('Reformulation not found');
        }
        if(actualReformulationVote && actualReformulationVote.value === value) {
            return;
        }

        //New vote handeling

        let newScore = reformulation.score;
        if(value) {
            newScore++;
        }
        if(value === false && value !== null) {
            newScore--;
        }

        //old vote handeling

        if(actualReformulationVote) {
            if(actualReformulationVote.value) {
                newScore--;
            }
            if(actualReformulationVote.value === false) {
                newScore++;
            }
            if(value === null) {
                await this.debateRepository.deleteReformulationVote(actualReformulationVote.id);
            } else {
                await this.debateRepository.updateReformulationVote(actualReformulationVote.id, value);
            }
        } else {
            if(value !== null) {
                await this.debateRepository.createReformulationVote(userId, reformulationId, value);
            }
        }

        await this.debateRepository.updateReformulationScore(reformulationId, newScore);
    }

    static async getReformulationVote(reformulationId: string, userId: string) {
        return await this.debateRepository.getDebateReformulationVote(reformulationId, userId);
    }   

    static async getReformulationById(reformulationId: string) {
        return await this.debateRepository.getDebateReformulation(reformulationId);
    }

    static async deleteDebate(debateId: string) {
        try {
            const debate = await this.debateRepository.getDebateById(debateId);
            if(!debate) {
                throw new Error('Debate not found');
            }
            //delete all reformulations
            const reformulationsIds = await this.debateRepository.getDebateReformulationsIds(debateId);
            await Promise.all(reformulationsIds.map(async (reformulationId: string) => {
                await this.deleteReformulation(reformulationId);
            }));
            //delete all arguments
            const argumentsIds = await this.debateRepository.getDebateArgumentsIds(debateId);
            await Promise.all(argumentsIds.map(async (argumentId: string) => {
                await ArgumentService.deleteArgument(argumentId);
            }));
            //delete Debate results
            await this.debateRepository.deleteDebateResult(debate.debateResultId);
            await this.debateRepository.deleteDebateResult(debate.debateContributorsResultId);
            //delete debate votes
            const votes = await this.debateRepository.getDebateVoteIds(debateId);
            await Promise.all(votes.map(async (voteId: string) => {
                await this.debateRepository.deleteDebateVote(voteId);
            }));
            //delete debate
            await this.debateRepository.deleteDebate(debateId);
        } catch (error) {
            console.log(error);
        }
    }

    static async deleteReformulation(reformulationId: string) {
        //delete all votes
        try {
            const allVotesIds = await this.debateRepository.getDebateReformulationVotesIds(reformulationId);
            await Promise.all(allVotesIds.map(async (voteId: string) => {
                await this.debateRepository.deleteReformulationVote(voteId);
            }));
            //delete reformulation
            await this.debateRepository.deleteReformulation(reformulationId);
        } catch (error) {
            console.log(error);
        }
    }

}

export default DebateService;