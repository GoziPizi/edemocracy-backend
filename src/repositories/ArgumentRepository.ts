import { ArgumentType } from "@prisma/client";
import PrismaRepository from "./PrismaRepository";

class ArgumentRepository extends PrismaRepository {

    createArgument = async (data: any) => {
        const argument = await this.prismaClient.argument.create({data});
        return argument;
    }

    addDebateToArgument = async (argumentId: string, childDebateId: string) => {
        const argument = await this.prismaClient.argument.update({
            where: { id: argumentId },
            data: {
                childDebateId
            }
        });
        return argument;
    }

    updateArgument = async (id: string, data: any) => {
        const updatedArgument = await this.prismaClient.argument.update({
            where: { id }, data
        });
        return updatedArgument;
    }

    getUserVote = async (userId: string, argumentId: string) => {
        const vote = await this.prismaClient.vote.findFirst({
            where: {
                argumentId: argumentId,
                userId: userId
            }
        });
        return vote;
    }

    getArgumentById = async (id: string) => {
        const argument = await this.prismaClient.argument.findUnique({
            where: {
                id,
            },
        });
        return argument;
    }

    deleteAllVotesFromArgument = async (argumentId: string) => {
        const votes = await this.prismaClient.vote.deleteMany({
            where: {
                argumentId
            }
        });
        return votes;
    }

    deleteArgument = async (id: string) => {
        const argument = await this.prismaClient.argument.delete({
            where: {
                id
            }
        });
        return argument;
    }

}

export default ArgumentRepository;