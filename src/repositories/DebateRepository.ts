import { Argument } from "@prisma/client";
import PrismaRepository from "./PrismaRepository";

class DebateRepository extends PrismaRepository {
    
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