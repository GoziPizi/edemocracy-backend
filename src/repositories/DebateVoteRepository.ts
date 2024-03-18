import { DebateVoteType } from "@prisma/client";
import PrismaRepository from "./PrismaRepository";

class DebateVoteRepository extends PrismaRepository {

    createVote = async (userId: string, debateId: string, value: DebateVoteType) => {
        await this.prismaClient.debateVote.create({
            data: {
                userId,
                debateId,
                value
            }
        });
    }

    updateVote = async (voteId: string, value: DebateVoteType) => {
        await this.prismaClient.debateVote.update({
            where: {
                id: voteId
            },
            data: {
                value
            }
        });
    }

    deleteVote = async (voteId: string) => {
        await this.prismaClient.debateVote.delete({
            where: {
                id: voteId
            }
        });
    }
}

export default DebateVoteRepository;