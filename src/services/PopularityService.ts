import DebateRepository from "@/repositories/DebateRepository";

class PopularityService {

    private static debateRepository: DebateRepository = new DebateRepository();

    static async addPopularityScore(debateId: string, amount: number) {
        try {
            let debate = await this.debateRepository.addPopularityScore(debateId, amount);
            return debate;
        } catch(error) {
            throw error;
        }
    }

    static async dailyUpdate() {
        try {
            await this.debateRepository.divideAllPopularitiesByTwo();
        } catch(error) {
            throw error;
        }
    }

}

export default PopularityService;