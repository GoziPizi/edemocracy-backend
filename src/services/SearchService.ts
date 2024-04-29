import { partyToSearchResult, personalityWithUserToSearchResult, topicToSearchResult } from "@/mappers/SearchMappers";
import PartyRepository from "@/repositories/PartyRepository";
import PersonalityRepository from "@/repositories/PersonalityRepository";
import TopicRepository from "@/repositories/TopicRepository";
import { SearchResult } from "@/types/Search";
import { PersonalityOutput } from "@/types/dtos/PersonalityDtos";
import { Party, Personality, Topic } from "@prisma/client";


class SearchService {

    private static topicRepository: TopicRepository = new TopicRepository()
    private static partyRepository: PartyRepository = new PartyRepository()
    private static personalityRepository: PersonalityRepository = new PersonalityRepository()

    static async textSearch(query: string): Promise<SearchResult[]> {
        const topics = await this.topicRepository.textSearch(query)
        const parties = await this.partyRepository.textSearch(query)
        const personalities = await this.personalityRepository.textSearch(query)
        const results: SearchResult[] = [
            ...topics.map(topicToSearchResult),
            ...parties.map(partyToSearchResult),
            ...personalities.map(personalityWithUserToSearchResult)
        ]
        return results
    }

    static async textSearchByType(query: string, type: string): Promise<any> {
        let results: any[] = []
        switch (type) {
            case 'topic':
                results = (await this.topicRepository.textSearch(query))
                break
            case 'party':
                results = (await this.partyRepository.textSearch(query))
                break
            case 'personality':
                results = (await this.personalityRepository.textSearch(query))
                break
            default:
                break
        }
        return results
    }

}

export default SearchService;