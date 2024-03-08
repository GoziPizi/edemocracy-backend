export const isDevEnvironment = (): boolean => process.env.NODE_ENV === 'development'

export const isProdEnvironment = (): boolean => process.env.NODE_ENV === 'prod'

export const getCorsOrigin = (): string[] => JSON.parse(process.env.CORS_ORIGIN || '[]')
