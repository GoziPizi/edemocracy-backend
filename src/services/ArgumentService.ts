import ArgumentRepository from "@/repositories/ArgumentRepository";
import VoteRepository from "@/repositories/VoteRepository";
import { ArgumentWithVoteOutput } from "@/types/dtos/ArgumentOutputDtos";

class ArgumentService {

    private static argumentRepository: ArgumentRepository = new ArgumentRepository()
    private static voteRepository: VoteRepository = new VoteRepository()

    static async getArgumentById(id: string, userId: string): Promise<ArgumentWithVoteOutput> {
        const argument = await this.argumentRepository.getArgumentById(id);
        if(!argument) {
            throw new Error('Argument not found');
        }
        const userVote = await this.argumentRepository.getUserVote(userId, id);
        const vote = userVote ? userVote.value : null;
        return {
            ...argument,
            hasVote: vote
        }
    }

    static async createArgument(content: string, userId: string, debateId: string): Promise<void>  {
        const argument = await this.argumentRepository.createArgument(content, userId, debateId);
        if(!argument) {
            throw new Error('Error creating argument');
        }
        return ;
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

}

export default ArgumentService;