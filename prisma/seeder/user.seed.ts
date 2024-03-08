import { Affiliation, PrismaClient } from '@prisma/client'

const default_password = 'password';

async function seedUser(prisma: PrismaClient) {
    const default_hash = 'hash'
    await prisma.user.createMany({
        data: [
            {
                email: 'pierre.dujean@gmail.com',
                password: default_hash,
                firstName: 'Pierre',
                name: 'Dujean',
                role: 'ADMIN',
                telephone: '0606060606',
                address: '1 rue des fleurs',
                profession: 'Développeur',
                affiliation: Affiliation.CENTRE,
                language: 'FR',
            }
        ]
    });
}