import { Argument } from "@prisma/client";
import PrismaRepository from "./PrismaRepository";

class DebateRepository extends PrismaRepository {
  
  createDebate = async (data: any) => {
    const debate = await this.prismaClient.debate.create({
      data,
    });
    return debate;
  }

  update = async (id: string, data: any) => {
    const debate = await this.prismaClient.debate.update({
      where: {
        id,
      },
      data,
    });
    return debate;
  }

  getDebateById = async (id: string) => {
    const debate = await this.prismaClient.debate.findUnique({
      where: {
        id,
      },
    });
    return debate;
  }

  getByDebatesIds = async (ids: string[]) => {
    const debates = await this.prismaClient.debate.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
    return debates;
  }

  getDebatesByTopicId = async (id: string) => {
    const debates = await this.prismaClient.debate.findMany({
      where: {
        topicId: id,
      },
    });
    return debates;
  }

  getDebateVote = async (debateId: string, userId: string) => {
    const vote = await this.prismaClient.debateVote.findFirst({
      where: {
        debateId,
        userId,
      },
    });
    return vote;
  }

  getDebateArguments = async (id: string): Promise<Argument[]> => {
    const debateArgs = await this.prismaClient.argument.findMany({
      where: {
        debateId: id,
      },
    });
    return debateArgs;
  }
}

export default DebateRepository;