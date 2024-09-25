import { jackpotStatus } from "@prisma/client";
import PrismaRepository from "./PrismaRepository";

class SponsorshipRepository extends PrismaRepository {

    async createPersonalJackpot(userId: string) {
        const jackpot = await this.prismaClient.personalJackpot.create({
            data: {
                userId
            }
        });
        return jackpot;
    }

    async getPersonalJackpot(userId: string) {
        const jackpot = await this.prismaClient.personalJackpot.findUnique({
            where: {
                userId
            }
        });
        return jackpot;
    }

    async setPersonalJackpotIBAN(userId: string, iban: string) {
        const jackpot = await this.prismaClient.personalJackpot.update({
            where: {
                userId
            },
            data: {
                iban
            }
        });
        return jackpot;
    }

    async setSponsorshipStatusToRequested(userId: string) {
        const jackpot = await this.prismaClient.personalJackpot.update({
            where: {
                userId
            },
            data: {
                status: jackpotStatus.REQUESTED
            }
        });
        return jackpot;
    }

    async incrementJackpotOfUser(userId: string, amount: number) {
        let jackpot = await this.prismaClient.personalJackpot.findFirst({
            where: {
                userId
            }
        });

        if (!jackpot) {
            await this.createPersonalJackpot(userId);
        }

        jackpot = await this.prismaClient.personalJackpot.update({
            where: {
                userId
            },
            data: {
                amount: {
                    increment: amount
                }
            }
        });

        return jackpot;

    }

}

export default SponsorshipRepository;