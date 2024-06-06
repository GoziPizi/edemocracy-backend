import { BanWordAlreadyExistsException, BannedContentException } from "@/exceptions/WordsExceptions";
import BanWordRepository from "@/repositories/BanWordRepository";


class BanWordService {

    private static banWordRepository: BanWordRepository = new BanWordRepository();

    static async getBanWords() {
        return await this.banWordRepository.getAll();
    }

    static async deleteBanWord(id: string) {
        return await this.banWordRepository.deleteBanWord(id);
    }

    static async createBanWord(word: string) {
        const isWordBanned = await this.banWordRepository.isWordBanned(word);
        if(isWordBanned) {
            throw new BanWordAlreadyExistsException();
        }
        return await this.banWordRepository.createBanWord(word.toLowerCase());
    }

    static async checkObjectForBanWords(object: any) {
        const banWords = await this.getBanWords();
        for (const banWord of banWords) {
            for (const key in object) {
                if (object[key].toLowerCase().includes(' ' + banWord.word.toLowerCase() + ' ')) {
                    throw new BannedContentException();
                }
            }
        }
    }

    static async checkStringForBanWords(string: string) {
        const banWords = await this.getBanWords();
        for (const banWord of banWords) {
            if (string.toLowerCase().includes(' ' + banWord.word.toLowerCase() + ' ')) {
                throw new BannedContentException();
            }
        }
    }
}

export default BanWordService;