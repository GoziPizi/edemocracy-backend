import RawQueryRepository from '@/repositories/RawQueryRepository';
import { Affiliation, PrismaClient } from '@prisma/client'

const default_password = 'password';

async function seedUser(prisma: PrismaClient) {
    const hashedDefaultPassword = await new RawQueryRepository().getSha256(default_password)
    await prisma.user.createMany({
        data: [
            {
                id: '7896161d-4e22-4244-8c07-3e09699baab4',
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
            },
            {
                id: '7896161d-4e22-4244-8c07-3e09699baab5',
                email: 'jean.marc@yahoo.fr',
                password: hashedDefaultPassword,
                firstName: 'Jean-Marc',
                name: 'Dupont',
                role: 'USER',
                telephone: '0606060606',
                address: '1 rue des fleurs',
                profession: 'Développeur',
                politicSide: Affiliation.RIGHT,
                language: 'FR',
            }
        ]
    });
}

export default seedUser;