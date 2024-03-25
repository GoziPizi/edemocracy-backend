export type SearchResult = {
    id: string
    type: 'Topic' | 'Personality' | 'Party'
    title: string
    description: string
    picture: string
}