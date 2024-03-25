import { partyToSearchResult, personalityWithUserToSearchResult, topicToSearchResult } from "@/mappers/SearchMappers";
import PartyRepository from "@/repositories/PartyRepository";
import PersonalityRepository from "@/repositories/PersonalityRepository";
import TopicRepository from "@/repositories/TopicRepository";
import { SearchResult } from "@/types/Search";


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

}

export default SearchService;