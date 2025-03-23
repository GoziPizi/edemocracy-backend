import PrismaRepository from "./PrismaRepository";

class VoteRepository extends PrismaRepository {

    createVote = async (userId: string, argumentId: string, value: boolean) => {
        await this.prismaClient.vote.create({
            data: {
                userId,
                argumentId,
                value
            }
        });
    }

    updateVote = async (voteId: string, value: boolean) => {
        await this.prismaClient.vote.update({
            where: {
                id: voteId
            },
            data: {
                value
            }
        });
    }

    deleteVote = async (voteId: string) => {
        await this.prismaClient.vote.delete({
            where: {
                id: voteId
            }
        });
    }

    getArgumentsVotes = async (argumentId: string) => {
        const votes = await this.prismaClient.vote.findMany({
            where: {
                argumentId
            }
        });
        return votes;
    }
}

export default VoteRepository;