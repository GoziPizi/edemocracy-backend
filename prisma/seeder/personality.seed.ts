import { PrismaClient } from "@prisma/client";

async function seedPersonalities(prisma: PrismaClient) {
    await prisma.personality.createMany({
        data: [
            {
                userId: '1',
                for: ['for'],
                against: ['against']
            }
        ]
    });
        
}

export default seedPersonalities;