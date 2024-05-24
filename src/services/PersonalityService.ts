import { toPublicUserOutput } from "@/mappers/UserMapper";
import OpinionRepository from "@/repositories/OpinionRepository";
import PersonalityRepository from "@/repositories/PersonalityRepository";
import { PersonalityOutput } from "@/types/dtos/PersonalityDtos";

class PersonalityService {
    private static personalityRepository: PersonalityRepository = new PersonalityRepository()
    private static opinionRepository: OpinionRepository = new OpinionRepository()

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

    static async createPersonality(userId: string) {
        return PersonalityService.personalityRepository.createPersonality(userId);
    }

    static async getOpinions(id: string) {
        const personality = await PersonalityService.personalityRepository.findPersonalityById(id);
        if(!personality) {
            throw new Error("Personality not found");
        }
        const opinions = await PersonalityService.opinionRepository.findOpinionsWithTitleByUserId(personality.userId);
        return opinions;
    }

    static async updatePersonalityFromUserId(userId: string, updates: any) {
        console.log(updates);
        console.log(userId);
        let personality = await PersonalityService.personalityRepository.findPersonalityByUserId(userId);
        if(!personality) {
            throw new Error("Personality not found");
        }
        personality = await PersonalityService.personalityRepository.updatePersonality(personality.id, updates);
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