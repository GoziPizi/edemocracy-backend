import prisma from '@/db'
import PrismaTransaction from '@/types/PrismaTransaction'

abstract class PrismaRepository {
  protected prismaClient: PrismaTransaction

  constructor(prismaClient: PrismaTransaction = prisma) {
    this.prismaClient = prismaClient
  }

  protected nextId = async (table: string): Promise<number> => {
    const result = await prisma.$queryRawUnsafe<{ nextval: number }[]>(`SELECT nextval('${table}_id_seq'::regclass);`)
    return Number(result[0].nextval)
  }
}

export default PrismaRepository