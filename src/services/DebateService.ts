import ArgumentRepository from "@/repositories/ArgumentRepository";
import DebateRepository from "@/repositories/DebateRepository";
import DebateVoteRepository from "@/repositories/DebateVoteRepository";
import TopicRepository from "@/repositories/TopicRepository";
import UserRepository from "@/repositories/UserRepository";
import { ArgumentWithVoteOutputDto } from "@/types/dtos/ArgumentOutputDtos";
import { Argument, DebateVoteType, MembershipStatus } from "@prisma/client";
import ArgumentService from "./ArgumentService";
import NotificationService from "./NotificationService";
import PopularityService from "./PopularityService";
import PartyService from "./PartyService";
import { UserNotInPartyException } from "@/exceptions/PartyExceptions";
import PersonalityService from "./PersonalityService";

class DebateService {

    private static debateRepository: DebateRepository = new DebateRepository()
    private static argumentRepository: ArgumentRepository = new ArgumentRepository()
    private static debateVoteRepository: DebateVoteRepository = new DebateVoteRepository()
    private static topicRepository: TopicRepository = new TopicRepository()
    private static userRepository: UserRepository = new UserRepository()

    static async createDebate(debate: any, userId: any) {
        try {
            const argument = debate.argumentId ? await this.argumentRepository.getArgumentById(debate.argumentId) : null;
            if(argument && argument.childDebateId) {
                throw new Error('Argument already has a debate');
            }
            if(debate.partyCreatorId) {
                const isAllowed = PartyService.isMember(debate.partyCreatorId, userId);
                if(!isAllowed) {
                    throw new UserNotInPartyException();
                }
            }
            if(debate.personalityCreatorId) {
                const isAllowed = PersonalityService.isUserPersonality(debate.personalityCreatorId, userId);
                if(!isAllowed) {
                    throw new Error('You are not the personality');
                }
            }


            //Initialisation of debate results
            const debateResult = await this.debateRepository.createDebateResult();
            const debateContributorsResult = await this.debateRepository.createDebateResult();
            const newDebate = await this.debateRepository.createDebate({
                userId,
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
                NotificationService.incrementFollowUpdate(newDebate.topicId, "TOPIC");
            }

            if(newDebate.argumentId) {
                await this.argumentRepository.addDebateToArgument(newDebate.argumentId, newDebate.id);
            }

            const reformulation = {
                debateId: newDebate.id,
                title: debate.title,
                content: debate.content,
                userId
            }

            await this.createDebateReformulation(reformulation);
 
            return newDebate;

        } catch (error) {
            throw error;
        }
    }

    static async getDebatesByTime(page_size: number = 10, page: number = 1) {
        const debates = await this.debateRepository.getDebatesByTime(page_size, page);
        return debates;
    }   

    static async getDebatesByPopularity(page_size: number = 10, page: number = 1) {
        const debates = await this.debateRepository.getDebatesByPopularity(page_size, page);
        return debates;
    }

    static async getTrendingDebatesThumbnails(page: number = 1) {
        const debates = await this.debateRepository.getTrendingDebatesThumbnails(page);
        //Add the medias.
        const debatesWithMedias = await Promise.all(debates.map(async (debate: any) => {
            const media : string | null = await this.debateRepository.getDebateMedia(debate.id);
            return {
                ...debate,
                media: media
            }
        }));
        return debatesWithMedias;
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

    static async getAuthor(debateId: string) {
        const debate = await this.debateRepository.getDebateById(debateId);
        if(!debate) {
            throw new Error('Debate not found');
        }
        return debate.userId;
    }

    static async getReformulationAuthor(reformulationId: string) {
        const reformulation = await this.debateRepository.getDebateReformulation(reformulationId);
        if(!reformulation) {
            throw new Error('Reformulation not found');
        }
        return reformulation.userId;
    }

    static async getDebateReformulations(id: string) {
        const reformulations = await this.debateRepository.getDebateReformulations(id);
        const reformulationsWithUserInfos = await Promise.all(reformulations.map(async (reformulation: any) => {
            const user = await this.userRepository.findById(reformulation.userId);
            let data = {};
            if(reformulation.isNameDisplayed){
                data = { userName: user!.firstName }
            }
            if(reformulation.isPoliticSideDisplayed){
                data = { ...data, userPoliticSide: user!.politicSide }
            }
            if(reformulation.isWorkDisplayed){
                data = { ...data, userWork: user!.profession }
            }
            return {
                ...reformulation,
                ...data
            }
        }));
        return reformulationsWithUserInfos;
    }

    static async getDebateReformulationUserInfos(id: string) {
        const reformulation = await this.debateRepository.getDebateReformulation(id);
        if(!reformulation) {
            throw new Error('Reformulation not found');
        }
        const user = await this.userRepository.findById(reformulation.userId);
        if(!user) {
            throw new Error('User not found');
        }
        return {
            userName: user!.name,
            userPoliticSide: user!.politicSide,
            userWork: user!.profession
        }
    }

    static async getDebateArguments(id: string) {
        const debateArguments = await this.debateRepository.getDebateArguments(id);
        return debateArguments;
    }

    static async getDebateArgumentsWithVote(id: string, userId: string): Promise<ArgumentWithVoteOutputDto[]> {
        const debateArguments = await this.debateRepository.getDebateArguments(id);
        const debateArgumentsWithUserVote: ArgumentWithVoteOutputDto[] = await Promise.all(debateArguments.map(async (argument: Argument) => {
            const userVote = await this.argumentRepository.getUserVote(userId, argument.id);
            const vote = userVote ? userVote.value : null;
            const userInformations = await ArgumentService.getUsernformationsOfArgument(argument.id);
            return {
                ...argument,
                hasVote: vote,
                ...userInformations
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
        const contribution = user!.contributionStatus === MembershipStatus.PREMIUM || user!.contributionStatus === MembershipStatus.STANDARD;

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
        
        //Handeling popularity 
        if(!actualVote) {
            await PopularityService.addPopularityScore(debateId, 2);
        }

    }

    static async getDebateVote(debateId: string, userId: string) {
        return await this.debateRepository.getDebateVote(debateId, userId);
    }

    static async deleteVoteForDebate(debateId: string, userId: string) {
        const debate = await this.debateRepository.getDebateById(debateId);
        const debateResult = await this.debateRepository.getDebateResult(debate!.debateResultId);
        const debateContributorsResult = await this.debateRepository.getDebateResult(debate!.debateContributorsResultId);
        const actualVote = await this.debateRepository.getDebateVote(debateId, userId);
        const user = await this.userRepository.findById(userId);
        const contribution = user!.contributionStatus === MembershipStatus.PREMIUM || user!.contributionStatus === MembershipStatus.STANDARD;

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

    static async createDebateReformulation(data: any) {
        const debateId = data.debateId;
        const debate = await this.debateRepository.getDebateById(debateId);
        if(!debate) {
            throw new Error('Debate not found');
        }
        const reformulation = await this.debateRepository.createDebateReformulation(data);

        //Handeling popularity
        await PopularityService.addPopularityScore(debateId, 5);

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

        //Update the reformulation winner if needed
        await this.updateWinnerDebateReformulation(reformulation.debateId);
    }

    static async checkForWinnerReformulation(debateId: string): Promise<string> {
        const reformulations = await this.debateRepository.getDebateReformulations(debateId);
        const winner = reformulations.reduce((prev, current) => {
            return (prev.score > current.score) ? prev : current
        });
        return winner.id;
    }

    static async updateWinnerDebateReformulation(debateId: string) {
        const winnerId = await this.checkForWinnerReformulation(debateId);
        const debate = await this.debateRepository.getDebateById(debateId);
        if(!debate) {
            throw new Error('Debate not found');
        }
        const reformulation = await this.debateRepository.getDebateReformulation(winnerId);
        if(!reformulation) {
            throw new Error('Reformulation not found');
        }
        //Set debate description to the winner reformulation
        await this.debateRepository.update(debateId, { title: reformulation.title, content: reformulation.content });

        //If the debate is linked to an argument, update the argument content
        if(debate.argumentId) {
            const argument = await this.argumentRepository.getArgumentById(debate.argumentId);
            if(!argument) {
                throw new Error('Argument not found');
            }
            await this.argumentRepository.updateArgument(argument.id, { title: reformulation.title, content: reformulation.content });
        }
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
                return;
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
            throw(error);
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
            throw(error);
        }
    }

    //Moderation

    static async setDebateFlag(id: string, isFlaged: boolean) {
        await this.debateRepository.update(id, {isFlaged});
    }

    static async setReformulationFlag(id: string, isFlaged: boolean) {
        await this.debateRepository.updateReformulation(id, {isFlaged});
    }

    // static async mergeDebates(moderatorId:string, debateId1: string, debateId2: string) {
    //     try {

    //         // const debate1 = await this.debateRepository.getDebateById(debateId1);
    //         // const debate2 = await this.debateRepository.getDebateById(debateId2);

    //         // if(!debate1 || !debate2) {
    //         //     throw new Error('Debate not found');
    //         // }

    //         // if(debate1.id === debate2.id) {
    //         //     throw new Error('Debates are the same');
    //         // }

    //         // const debate1Reformulations = await this.debateRepository.getDebateReformulations(debateId1);
    //         // const debate2Reformulations = await this.debateRepository.getDebateReformulations(debateId2);

    //         // const allReformulations = [...debate1Reformulations, ...debate2Reformulations];
    //         // let winnerReformulation = allReformulations.reduce((prev, current) => {
    //         //     return (prev.score > current.score) ? prev : current
    //         // });

    //         // let winnerDebate : any = debate1;
    //         // if(winnerReformulation.debateId !== debateId1) {
    //         //     winnerDebate = debate2;
    //         // }
            
    //         // if(!winnerDebate) {
    //         //     throw new Error('Winner debate not found');
    //         // }

    //         // //Initiate results
    //         // const debateResult = await this.debateRepository.createDebateResult();
    //         // const debateContributorsResult = await this.debateRepository.createDebateResult();

    //         // //Merge them
    //         // const debateResult1 = await this.debateRepository.getDebateResult(debate1.debateResultId);
    //         // const debateResult2 = await this.debateRepository.getDebateResult(debate2.debateResultId);
    //         // const debateContributorsResult1 = await this.debateRepository.getDebateResult(debate1.debateContributorsResultId);
    //         // const debateContributorsResult2 = await this.debateRepository.getDebateResult(debate2.debateContributorsResultId);
            
    //         // await this.debateRepository.updateDebateResult(debateResult.id, {
    //         //     nbFor: debateResult1!.nbFor + debateResult2!.nbFor,
    //         //     nbReallyFor: debateResult1!.nbReallyFor + debateResult2!.nbReallyFor,
    //         //     nbAgainst: debateResult1!.nbAgainst + debateResult2!.nbAgainst,
    //         //     nbReallyAgainst: debateResult1!.nbReallyAgainst + debateResult2!.nbReallyAgainst,
    //         //     nbNeutral: debateResult1!.nbNeutral + debateResult2!.nbNeutral
    //         // })
    //         // await this.debateRepository.updateDebateResult(debateContributorsResult.id, {
    //         //     nbFor: debateContributorsResult1!.nbFor + debateContributorsResult2!.nbFor,
    //         //     nbReallyFor: debateContributorsResult1!.nbReallyFor + debateContributorsResult2!.nbReallyFor,
    //         //     nbAgainst: debateContributorsResult1!.nbAgainst + debateContributorsResult2!.nbAgainst,
    //         //     nbReallyAgainst: debateContributorsResult1!.nbReallyAgainst + debateContributorsResult2!.nbReallyAgainst,
    //         //     nbNeutral: debateContributorsResult1!.nbNeutral + debateContributorsResult2!.nbNeutral
    //         // })

    //         // //Create the new debate
    //         // delete winnerDebate.id;
    //         // delete winnerDebate.createdAt;
    //         // delete winnerDebate.updatedAt;
    //         // delete winnerDebate.debateResultId;
    //         // delete winnerDebate.debateContributorsResultId;

    //         // const newDebate = await this.debateRepository.createDebate({
    //         //     ...winnerDebate,
    //         //     debateResultId: debateResult.id,
    //         //     debateContributorsResultId: debateContributorsResult.id
    //         // });

    //         // //Merge the arguments
    //         // if(debate1.argumentId && debate2.argumentId) {
    //         //     const arg1 = await this.argumentRepository.getArgumentById(debate1.argumentId);
    //         //     const arg2 = await this.argumentRepository.getArgumentById(debate2.argumentId);
    //         //     const finalArg = await this.argumentRepository.createArgument({
    //         //         debateId : arg1!.debateId,
    //         //         title: arg1!.title,
    //         //         content: arg1!.content,
    //         //         childDebateId: newDebate.id,
    //         //     })
    //         // }

    //         // //Updates all the past references


    //     } catch (error) {
    //         throw error;
    //     }
    // }

    //Merges 2 into 1
    static async mergeDebateIntoOtherDebate(debateId1: string, debateId2: string) {

        const arguments2 = await this.debateRepository.getDebateArguments(debateId2);

        for (const argument of arguments2) {
            await this.argumentRepository.updateArgument(argument.id, { debateId: debateId1 });
            console.log("Argument", argument.id, "moved to debate", debateId1);
        }

        const reformulations2 = await this.debateRepository.getDebateReformulations(debateId2);
        for (const reformulation of reformulations2) {
            await this.debateRepository.updateReformulation(reformulation.id, { debateId: debateId1 });
        }

        await this.updateWinnerDebateReformulation(debateId1);
        await this.deleteDebate(debateId2);

    }

}

export default DebateService;