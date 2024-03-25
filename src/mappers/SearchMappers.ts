import { SearchResult } from "@/types/Search"
import { PersonalityOutput } from "@/types/dtos/PersonalityDtos"
import { Party, Topic } from "@prisma/client"

const topicToSearchResult = (topic: Topic): SearchResult => {
    return {
        id: topic.id,
        type: 'Topic',
        title: topic.title,
        description: topic.description,
        picture: topic.medias[0]
    }
}

const partyToSearchResult = (party: Party): SearchResult => {
    return {
        id: party.id,
        type: 'Party',
        title: party.name,
        description: party.description,
        picture: party.logo
    }
}

const personalityWithUserToSearchResult = (personality: any): SearchResult => {
    return {
        id: personality.id,
        type: 'Personality',
        title: personality.user.name,
        description: personality.user.description,
        picture: personality.user.picture
    }
}

export {
    topicToSearchResult,
    partyToSearchResult,
    personalityWithUserToSearchResult
}