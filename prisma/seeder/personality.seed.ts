import { PrismaClient } from "@prisma/client";

async function seedPersonalities(prisma: PrismaClient) {
    await prisma.personality.createMany({
        data: [
            {
                userId: '7896161d-4e22-4244-8c07-3e09699baab4',
                for: ['d4e05d53-0f5a-473a-846c-80f1e35e8ecf'],
                against: ['2489161d-4e22-4244-8c07-3e09699b55b3'],
                description: 'La description de la personnalité'
            }
        ]
    });
        
}

export default seedPersonalities;