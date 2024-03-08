import { PrismaClient } from '@prisma/client'

import { isProdEnvironment } from './utils/Environment'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

const prisma = globalForPrisma.prisma || new PrismaClient({ log: ['query'] })

if (isProdEnvironment()) globalForPrisma.prisma = prisma

export default prisma
