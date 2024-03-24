import PrismaRepository from "./PrismaRepository";

class BanWordRepository extends PrismaRepository {

    getAll() {
        return this.prismaClient.banWord.findMany();
    }

    createBanWord = async (word: string) => {
        await this.prismaClient.banWord.create({
            data: {
                word
            }
        });
    }

    isWordBanned = async (word: string) => {
        const bannedWords = await this.prismaClient.banWord.findMany();
        return bannedWords.some(bannedWord => word.includes(bannedWord.word));
    }

    deleteBanWord = async (id: string) => {
        await this.prismaClient.banWord.delete({
            where: {
                id
            }
        });
    }

}

export default BanWordRepository;