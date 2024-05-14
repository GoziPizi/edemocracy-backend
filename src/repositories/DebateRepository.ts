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

  getDebatesByTime = async (page_size: number = 10, page: number = 1) => {
    const debates = await this.prismaClient.debate.findMany({
      take: page_size,
      skip: (page - 1) * page_size,
    });
    return debates;
  }

  getDebatesByPopularity = async (page_size: number = 10, page: number = 1) => {
    const debates = await this.prismaClient.debate.findMany({
      take: page_size,
      skip: (page - 1) * page_size,
      orderBy: {
        nbVotes: 'desc',
      },
    });
    return debates;
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

  getChildDebateFromArgument = async (argumentId: string) => {
    const debate = await this.prismaClient.debate.findFirst({
      where: {
        argumentId,
      },
    });
    return debate;
  }
}

export default DebateRepository;