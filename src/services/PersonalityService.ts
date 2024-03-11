import { toPublicUserOutput } from "@/mappers/UserMapper";
import PersonalityRepository from "@/repositories/PersonalityRepository";

class PersonalityService {
    private static personalityRepository: PersonalityRepository = new PersonalityRepository()

    static async searchPersonality(criterias: any) {
        let finalCriterias = {};
        if(criterias.politicSide) {
            finalCriterias = {
                ...finalCriterias,
                politicSide: criterias.politicSide
            }
        }
        if(criterias.for) {
            finalCriterias = {
                ...finalCriterias,
                for: criterias.for
            }
        }
        if(criterias.against) {
            finalCriterias = {
                ...finalCriterias,
                against: criterias.against
            }
        }
        let result = await PersonalityService.personalityRepository.searchPersonality(finalCriterias);
        result.map((personality: any) => {
            personality.user = toPublicUserOutput(personality.user);
        });
        return result;
    }

}

export default PersonalityService;