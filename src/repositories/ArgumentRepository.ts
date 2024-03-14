import PrismaRepository from "./PrismaRepository";

class ArgumentRepository extends PrismaRepository {

    getUserVote = async (userId: string, argumentId: string) => {
        console.log('userId', userId);
        console.log('argumentId', argumentId);
        const vote = await this.prismaClient.vote.findFirst({
            where: {
                argumentId: argumentId,
                userId: userId
            }
        });
        return vote;
    }

}

export default ArgumentRepository;