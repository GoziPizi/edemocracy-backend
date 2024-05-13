import { ArgumentType } from "@prisma/client";
import PrismaRepository from "./PrismaRepository";

class ArgumentRepository extends PrismaRepository {

    createArgument = async (content: string, argumentType: ArgumentType, userId: string, debateId: string) => {
        const argument = await this.prismaClient.argument.create({
            data: {
                content,
                type: argumentType,
                userId,
                debateId
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

}

export default ArgumentRepository;