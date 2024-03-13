import { toPublicUserOutput } from "@/mappers/UserMapper";
import PersonalityRepository from "@/repositories/PersonalityRepository";
import { PersonalityOutput } from "@/types/dtos/PersonalityDtos";

class PersonalityService {
    private static personalityRepository: PersonalityRepository = new PersonalityRepository()

    static async getPersonality(id: string): Promise<PersonalityOutput> {
        let result = await PersonalityService.personalityRepository.getPersonalityWithUser(id);
        if(!result) {
            throw new Error("Personality not found");
        }
        const publicUser = toPublicUserOutput(result.user);
        const personality = {
            ...result,
            user: publicUser
        }
        return personality;
    }

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