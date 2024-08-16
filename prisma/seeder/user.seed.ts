import RawQueryRepository from '@/repositories/RawQueryRepository';
import { Affiliation, PrismaClient } from '@prisma/client'

const default_password = 'password';

async function seedUser(prisma: PrismaClient) {
    const hashedDefaultPassword = await new RawQueryRepository().getSha256(default_password)
    await prisma.user.createMany({
        data: [
            
        ]
    });
}

export default seedUser;