import RawQueryRepository from '@/repositories/RawQueryRepository';
import { Affiliation, PrismaClient } from '@prisma/client'

const default_password = 'password';

async function seedUser(prisma: PrismaClient) {
    const hashedDefaultPassword = await new RawQueryRepository().getSha256(default_password)
    await prisma.user.createMany({
        data: [
            {
                id: '1',
                email: 'pierre.dujean@gmail.com',
                password: hashedDefaultPassword,
                firstName: 'Pierre',
                name: 'Dujean',
                role: 'ADMIN',
                telephone: '0606060606',
                address: '1 rue des fleurs',
                profession: 'Développeur',
                politicSide: Affiliation.CENTER,
                language: 'FR',
            }
        ]
    });
}

export default seedUser;