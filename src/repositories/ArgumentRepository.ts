import PrismaRepository from "./PrismaRepository";

class ArgumentRepository extends PrismaRepository {

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