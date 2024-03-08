import { PrismaClient } from '@prisma/client'
import { ITXClientDenyList } from '@prisma/client/runtime/library'

type PrismaTransaction = Omit<PrismaClient, ITXClientDenyList>

export default PrismaTransaction