import ArgumentRepository from "@/repositories/ArgumentRepository";
import DebateRepository from "@/repositories/DebateRepository";
import VoteRepository from "@/repositories/VoteRepository";
import { ArgumentWithVoteOutputDto } from "@/types/dtos/ArgumentOutputDtos";
import DebateService from "./DebateService";
import UserRepository from "@/repositories/UserRepository";
import NotificationService from "./NotificationService";
import { ReportingType } from "@prisma/client";
import PopularityService from "./PopularityService";

class ArgumentService {

    private static argumentRepository: ArgumentRepository = new ArgumentRepository()
    private static debateRepository: DebateRepository = new DebateRepository()
    private static voteRepository: VoteRepository = new VoteRepository()
    private static userRepository: UserRepository = new UserRepository()

    static async getArgumentWithVoteById(id: string, userId: string): Promise<ArgumentWithVoteOutputDto> {
        const argument = await this.argumentRepository.getArgumentById(id);
        if(!argument) {
            throw new Error('Argument not found');
        }
        const userVote = await this.argumentRepository.getUserVote(userId, id);
        const vote = userVote ? userVote.value : null;
        const childDebate = await this.debateRepository.getChildDebateFromArgument(argument.debateId);
        const childDebateId = childDebate ? childDebate.id : null;
        return {
            ...argument,
            hasVote: vote,
            childDebateId
        }
    }

    static async getArgumentById(id: string) {
        const argument = await this.argumentRepository.getArgumentById(id);
        if(!argument) {
            throw new Error('Argument not found');
        }
        const childDebate = await this.debateRepository.getChildDebateFromArgument(argument.debateId);
        const childDebateId = childDebate ? childDebate.id : null;
        return {
            ...argument,
            childDebateId
        }
    }

    static async getAuthor(id: string) {
        const argument = await this.argumentRepository.getArgumentById(id);
        if(!argument) {
            throw new Error('Argument not found');
        }
        return argument.userId;
    }
    
    static async getUsernformationsOfArgument(id: string) {
        const argument = await this.argumentRepository.getArgumentById(id);
        if(!argument) {
            throw new Error('Argument not found');
        }
        let data = {};
        const user = await this.userRepository.findById(argument.userId);
        if(!user) {
            throw new Error('User not found');
        }
        if(argument.isNameDisplayed) {
            data = { ...data, userName: user.name}
        }
        if(argument.isPoliticSideDisplayed) {
            data = { ...data, userPoliticSide: user.politicSide}
        }
        if(argument.isWorkDisplayed) {
            data = { ...data, userWork: user.profession}
        }
        return data;
    }

    static async createArgument(data: any)  {
        const userId = data.userId;
        const argument = await this.argumentRepository.createArgument(data);
        if(!argument) {
            throw new Error('Error creating argument');
        }
        const debateToCreate = {
            title: argument.title,
            content: argument.content,
            argumentId: argument.id
        }
        await DebateService.createDebate(debateToCreate, userId);
        //Handeling notifs
        NotificationService.incrementFollowUpdate(argument.debateId, "DEBATE");

        //Handeling popularity
        PopularityService.addPopularityScore(argument.debateId, 10);

        return argument;
    }

    static async voteForArgument(id: string, userId: string, value: boolean): Promise<void> {
        const userVote = await this.argumentRepository.getUserVote(userId, id);
        const argument = await this.argumentRepository.getArgumentById(id);

        if(!argument) {
            throw new Error('Argument not found');
        }
        if(userVote && userVote.value === value) {
            return;
        }

        let hadVoted = false;
        if(userVote) {
            hadVoted = true;
            await this.voteRepository.updateVote(userVote.id, value);
        } else {
            await this.voteRepository.createVote(userId, id, value);
        }

        let data;
        if(value) {
            data = {
                nbGood: argument.nbGood + 1,
                nbBad: argument.nbBad - (hadVoted ? 1 : 0)
            }
        } else {
            data = {
                nbGood: argument.nbGood - (hadVoted ? 1 : 0),
                nbBad: argument.nbBad + 1
            }
        }
        await this.argumentRepository.updateArgument(id, data);

        //Handeling popularity
        if(!hadVoted) {
            PopularityService.addPopularityScore(argument.debateId, 1);
        }
    }

    static async deleteVoteForArgument(id: string, userId: string): Promise<void> {
        const userVote = await this.argumentRepository.getUserVote(userId, id);
        const argument = await this.argumentRepository.getArgumentById(id);

        if(!argument) {
            throw new Error('Argument not found');
        }
        if(!userVote) {
            return;
        }

        let data;
        if(userVote.value) {
            data = {
                nbGood: argument.nbGood - 1
            }
        } else {
            data = {
                nbBad: argument.nbBad - 1
            }
        }
        await this.argumentRepository.updateArgument(id, data);
        await this.voteRepository.deleteVote(userVote.id);
    }

    static async deleteArgument(id: string): Promise<void> {
        const argument = await this.argumentRepository.getArgumentById(id);
        if(!argument) {
            throw new Error('Argument not found');
        }

        //delete related debate
        if(argument.childDebateId) {
            await DebateService.deleteDebate(argument.childDebateId);
        }

        //delete related votes

        await this.argumentRepository.deleteAllVotesFromArgument(id);

        //delete argument

        await this.argumentRepository.deleteArgument(id);
    }

    static async setFlag(id: string, isFlaged: boolean) {
        try {
            await this.argumentRepository.updateArgument(id, {isFlaged});
            if(isFlaged) {
                const argument = await this.argumentRepository.getArgumentById(id);
                if(!argument) {
                    throw new Error('Argument not found');
                }
            } 
        } catch (error) {
            return;
        }
    }

}

export default ArgumentService;