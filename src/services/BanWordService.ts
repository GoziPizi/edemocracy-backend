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
            throw new Error('This word is already banned');
        }
        return await this.banWordRepository.createBanWord(word);
    }
}

export default BanWordService;