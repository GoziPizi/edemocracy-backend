import PrismaRepository from "./PrismaRepository";

class DonationRepository extends PrismaRepository {
    createDonation = async (email: string, amount: number) => {
        await this.prismaClient.donation.create({
            data: {
                email,
                amount
            }
        });
    }
}

export default DonationRepository;