import { Argument } from '@prisma/client';
import PrismaRepository from './PrismaRepository';

class DebateRepository extends PrismaRepository {
  createDebate = async (data: any) => {
    const debate = await this.prismaClient.debate.create({
      data,
    });
    return debate;
  };

  createDebateResult() {
    return this.prismaClient.debateResult.create({
      data: {},
    });
  }

  update = async (id: string, data: any) => {
    const debate = await this.prismaClient.debate.update({
      where: {
        id,
      },
      data,
    });
    return debate;
  };

  updateReformulation = async (id: string, data: any) => {
    const reformulation =
      await this.prismaClient.debateDescriptionReformulation.update({
        where: {
          id,
        },
        data,
      });
    return reformulation;
  };

  addPopularityScore = async (debateId: string, amount: number) => {
    const debate = await this.prismaClient.debate.update({
      where: {
        id: debateId,
      },
      data: {
        popularityScore: {
          increment: amount,
        },
      },
    });
    return debate;
  };

  divideAllPopularitiesByTwo = async () => {
    await this.prismaClient.debate.updateMany({
      data: {
        popularityScore: {
          divide: 2,
        },
      },
    });
  };

  getDebateById = async (id: string) => {
    const debate = await this.prismaClient.debate.findUnique({
      where: {
        id,
      },
    });
    return debate;
  };

  getDebatesByTime = async (page_size: number = 10, page: number = 1) => {
    const debates = await this.prismaClient.debate.findMany({
      take: page_size,
      skip: (page - 1) * page_size,
    });
    return debates;
  };

  getDebatesByPopularity = async (page_size: number = 10, page: number = 1) => {
    const debates = await this.prismaClient.debate.findMany({
      take: page_size,
      skip: (page - 1) * page_size,
    });
    return debates;
  };

  //Thumbnails for trends related methods

  getTrendingDebatesThumbnails = async (page: number = 1) => {
    const debates = await this.prismaClient.debate.findMany({
      take: 20,
      skip: (page - 1) * 20,
      orderBy: {
        popularityScore: 'desc',
      },
      where: {
        OR: [
          {
            argumentId: {
              equals: null,
            },
          },
          {
            argumentId: {
              equals: '',
            },
          },
        ],
      },
    });
    //joins the results of debates aswell
    const finalDebates = await Promise.all(
      debates.map(async (debate) => {
        const debateResult = await this.prismaClient.debateResult.findFirst({
          where: {
            id: debate.debateResultId,
          },
        });
        const debateContributorsResult =
          await this.prismaClient.debateResult.findFirst({
            where: {
              id: debate.debateContributorsResultId,
            },
          });
        return {
          ...debate,
          debateResult,
          debateContributorsResult,
        };
      })
    );
    return finalDebates;
  };

  //slow method
  getDebateMedia = async (debateId: string): Promise<string | null> => {
    const debate = await this.prismaClient.debate.findFirst({
      where: {
        id: debateId,
      },
    });

    if (debate?.topicId) {
      const topic = await this.prismaClient.topic.findFirst({
        where: {
          id: debate.topicId,
        },
      });
      return topic?.medias[0] || null;
    }

    if (debate?.argumentId) {
      const argument = await this.prismaClient.argument.findFirst({
        where: {
          id: debate.argumentId,
        },
      });
      if (argument) {
        return this.getDebateMedia(argument.debateId);
      }
    }

    return null;
  };

  //End of thumbnails for trends related methods

  getByDebatesIds = async (ids: string[]) => {
    const debates = await this.prismaClient.debate.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
    return debates;
  };

  getDebatesByTopicId = async (id: string) => {
    const debates = await this.prismaClient.debate.findMany({
      where: {
        topicId: id,
      },
    });
    return debates;
  };

  getDebateVote = async (debateId: string, userId: string) => {
    const vote = await this.prismaClient.debateVote.findFirst({
      where: {
        debateId,
        userId,
      },
    });
    return vote;
  };

  getDebateArguments = async (id: string): Promise<Argument[]> => {
    const debateArgs = await this.prismaClient.argument.findMany({
      where: {
        debateId: id,
      },
    });
    return debateArgs;
  };

  getChildDebateFromArgument = async (argumentId: string) => {
    const debate = await this.prismaClient.debate.findFirst({
      where: {
        argumentId,
      },
    });
    return debate;
  };

  getDebateResult = async (id: string) => {
    const debateResult = await this.prismaClient.debateResult.findFirst({
      where: {
        id,
      },
    });
    return debateResult;
  };

  updateDebateResult = async (debateResultId: string, data: any) => {
    const debateResult = await this.prismaClient.debateResult.update({
      where: {
        id: debateResultId,
      },
      data,
    });
    return debateResult;
  };

  createDebateReformulation = async (data: any) => {
    const reformulationData =
      await this.prismaClient.debateDescriptionReformulation.create({ data });
    return reformulationData;
  };

  getDebateReformulation = async (id: string) => {
    const reformulation =
      await this.prismaClient.debateDescriptionReformulation.findUnique({
        where: {
          id,
        },
      });
    return reformulation;
  };

  createReformulationVote = async (
    userId: string,
    reformulationId: string,
    value: boolean
  ) => {
    const vote = await this.prismaClient.voteForReformulation.create({
      data: {
        debateReformulationId: reformulationId,
        userId,
        value,
      },
    });
    return vote;
  };

  getDebateReformulationVote = async (
    reformulationId: string,
    userId: string
  ) => {
    const vote = await this.prismaClient.voteForReformulation.findFirst({
      where: {
        debateReformulationId: reformulationId,
        userId,
      },
    });
    return vote;
  };

  getDebateReformulations = async (debateId: string) => {
    const reformulations =
      await this.prismaClient.debateDescriptionReformulation.findMany({
        where: {
          debateId,
        },
      });
    return reformulations;
  };

  updateReformulationScore(reformulationId: string, score: number) {
    return this.prismaClient.debateDescriptionReformulation.update({
      where: {
        id: reformulationId,
      },
      data: {
        score,
      },
    });
  }

  updateReformulationVote = async (id: string, value: boolean) => {
    const vote = await this.prismaClient.voteForReformulation.update({
      where: {
        id,
      },
      data: {
        value,
      },
    });
    return vote;
  };

  deleteReformulation = async (id: string) => {
    await this.prismaClient.debateDescriptionReformulation.delete({
      where: {
        id,
      },
    });
  };

  getDebateReformulationVotesIds = async (reformulationId: string) => {
    const votes = await this.prismaClient.voteForReformulation.findMany({
      where: {
        debateReformulationId: reformulationId,
      },
    });
    return votes.map((vote) => vote.id);
  };

  deleteReformulationVote = async (id: string) => {
    await this.prismaClient.voteForReformulation.delete({
      where: {
        id,
      },
    });
  };

  getDebateReformulationsIds = async (debateId: string) => {
    const reformulations =
      await this.prismaClient.debateDescriptionReformulation.findMany({
        where: {
          debateId,
        },
      });
    return reformulations.map((reformulation) => reformulation.id);
  };

  getDebateArgumentsIds = async (debateId: string) => {
    const argumentss = await this.prismaClient.argument.findMany({
      where: {
        debateId,
      },
    });
    return argumentss.map((argument) => argument.id);
  };

  deleteDebateResult = async (id: string) => {
    await this.prismaClient.debateResult.delete({
      where: {
        id,
      },
    });
  };

  deleteDebate = async (id: string) => {
    await this.prismaClient.debate.delete({
      where: {
        id,
      },
    });
  };

  getDebateVoteIds = async (debateId: string) => {
    const votes = await this.prismaClient.debateVote.findMany({
      where: {
        debateId,
      },
    });
    return votes.map((vote) => vote.id);
  };

  deleteDebateVote = async (id: string) => {
    await this.prismaClient.debateVote.delete({
      where: {
        id,
      },
    });
  };
}

export default DebateRepository;
