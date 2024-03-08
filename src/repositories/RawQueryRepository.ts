import { Prisma } from '@prisma/client'

import PrismaRepository from './PrismaRepository'

type Sha256RequestResultField = {
  hash: string
}

class RawQueryRepository extends PrismaRepository {
  getSha256 = async (stringSequence: string): Promise<string> => {
    const query = Prisma.raw(`SELECT encode(sha256('${stringSequence}'), 'hex') as hash`)
    const hashedString = await this.prismaClient.$queryRaw(query)
    return (hashedString as Sha256RequestResultField[]).at(0)!.hash
  }
}

export default RawQueryRepository
