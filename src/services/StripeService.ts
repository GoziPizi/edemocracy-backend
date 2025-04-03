import PreRegistrationRepository from '@/repositories/PreRegistrationRepository';
import UserRepository from '@/repositories/UserRepository';
import AuthentificationService from './AuthentificationService';
import Stripe from 'stripe';
import { MembershipStatus } from '@prisma/client';
import DonationRepository from '@/repositories/DonationRepository';
import { sendThankDonationMail } from './MailService';

class StripeService {
  private static stripe: Stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  private static standard_product_id: string = process.env.STANDARD_PRODUCT_ID!;
  private static premium_product_id: string = process.env.PREMIUM_PRODUCT_ID!;
  private static userRepository: UserRepository = new UserRepository();
  private static preRegistrationRepository: PreRegistrationRepository =
    new PreRegistrationRepository();
  private static donationRepository: DonationRepository =
    new DonationRepository();

  static async createCheckoutSessionForStandard(email: string) {
    const session = await this.stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product: process.env.STANDARD_PRODUCT_ID,
            unit_amount: 499,
          },
          quantity: 1,
        },
      ],
      metadata: {
        productType: 'standard',
      },
      success_url: process.env.SUCCESS_STANDARD_URL,
    });
    return session;
  }

  static async createCheckoutSessionForPremium(email: string) {
    const session = await this.stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product: process.env.PREMIUM_PRODUCT_ID,
            unit_amount: 1499,
          },
          quantity: 1,
        },
      ],
      metadata: {
        productType: 'premium',
      },
      success_url: process.env.SUCCESS_PREMIUM_URL,
    });
    return session;
  }

  static async createCheckoutSessionForBienfaiteur(email: string) {
    const session = await this.stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product: process.env.BIENFAITEUR_PRODUCT_ID,
            unit_amount: 2999,
          },
          quantity: 1,
        },
      ],
      metadata: {
        productType: 'bienfaiteur',
      },
      success_url: process.env.SUCCESS_BIENFAITEUR_URL,
    });
    return session;
  }

  //The amount is in euros
  static async createCheckoutSessionDonation(
    email: string | null,
    amount: number,
    interval: string | null
  ) {
    console.log(email, amount, interval);
    const session = await this.stripe.checkout.sessions.create({
      mode: interval ? 'subscription' : 'payment',
      payment_method_types: ['card'],
      customer_email: email ? email : undefined,
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'Donation' + (interval ? ' (récurrente)' : ''),
            },
            recurring: interval
              ? { interval: interval as Stripe.Price.Recurring.Interval }
              : undefined,
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],
      metadata: {
        productType: 'donation',
      },
      success_url: process.env.SUCCESS_DONATION_URL,
    });

    return session;
  }

  static constructStripeEvent(payload: Buffer, sig: string | string[]) {
    return this.stripe.webhooks.constructEvent(
      payload,
      sig,
      process.env.STRIPE_ENDPOINT_SECRET!
    );
  }

  static async handleStripeEvent(stripeEvent: any) {
    try {
      switch (stripeEvent.type) {
        case 'checkout.session.completed':
          if (
            stripeEvent.data.object.metadata?.productType === 'standard' ||
            stripeEvent.data.object.metadata?.productType === 'premium' ||
            stripeEvent.data.object.metadata?.productType === 'bienfaiteur'
          ) {
            StripeService.handleCompletedRegistration(stripeEvent.data.object);
          }
          if (stripeEvent.data.object.metadata?.productType === 'donation') {
            StripeService.handleCompletedDonation(stripeEvent.data.object);
          }
          break;

        case 'checkout.session.expired':
          StripeService.handleExpiredSession(stripeEvent.data.object);
        default:
          throw new Error('Unhandled event');
      }
    } catch (e) {
      console.error(e);
    }
  }

  static async handleCompletedDonation(stripeEvent: any) {
    try {
      if (stripeEvent.customer_email) {
        await this.donationRepository.createDonation(
          stripeEvent.customer_email,
          stripeEvent.amount_total
        );
        sendThankDonationMail(
          stripeEvent.customer_email,
          stripeEvent.amount_total / 100
        );
      }
      return;
    } catch (e) {
      console.error(e);
    }
  }

  static async handleCompletedRegistration(stripeEvent: any) {
    try {
      const email = stripeEvent.customer_email;
      const preRegistration =
        await this.preRegistrationRepository.getPreRegistration(email);
      const paiementStatus = stripeEvent.payment_status;

      const checkoutSession = await this.stripe.checkout.sessions.retrieve(
        stripeEvent.id
      );

      if (!checkoutSession) {
        throw new Error('Checkout session not found');
      }

      if (paiementStatus !== 'paid') {
        await this.preRegistrationRepository.deletePreRegistration(email);
        throw new Error('Paiement not paid');
      }

      const productType = checkoutSession.metadata?.productType;
      let registerType: MembershipStatus;

      switch (productType) {
        case 'standard':
          registerType = MembershipStatus.STANDARD;
          break;
        case 'premium':
          registerType = MembershipStatus.PREMIUM;
          break;
        case 'bienfaiteur':
          registerType = MembershipStatus.BIENFAITEUR;
          break;
        default:
          throw new Error('Invalid product type');
      }

      if (preRegistration) {
        await AuthentificationService.registerFromPreRegistration(
          email,
          registerType
        );
        return;
      }
      const user = await this.userRepository.getUserByEmail(email);
      if (user) {
        await this.userRepository.updateContributionStatus(
          user.id,
          registerType
        );
        return;
      }
    } catch (e) {
      console.error(e);
    }
  }

  static async handleExpiredSession(stripeEvent: any) {
    try {
      const email = stripeEvent.customer_email;
      const preRegistration =
        await this.preRegistrationRepository.getPreRegistration(email);
      if (preRegistration) {
        await this.preRegistrationRepository.deletePreRegistration(email);
      }
      const verification = await this.userRepository.getVerificationRequest(
        email
      );
      if (verification) {
        await this.userRepository.deleteVerificationRequest(verification.id);
      }
    } catch (e) {
      console.error(e);
    }
  }
}

export default StripeService;
