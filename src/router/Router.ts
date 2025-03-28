import express, { NextFunction, Request, Response } from 'express'

import HandlerError from '@/classes/ErrorHandler'
import UserRouter from './UserRouter';
import LoginRouter from './LoginRouter';
import { EndpointNotFoundException } from '@/exceptions/BaseExceptions';
import TopicRouter from './TopicRouter';
import PersonalityRouter from './PersonalityRouter';
import DebateRouter from './DebateRouter';
import ArgumentRouter from './ArgumentRouter';
import PartyRouter from './PartyRouter';
import PartyInvitationRouter from './PartyInvitationRouter';
import AdminRouter from './AdminRouter';
import SearchRouter from './SearchRouter';
import NotificationRouter from './NotificationRouter';
import ContributionRouter from './ContributionRouter';
import ModerationRouter from './ModerationRouter';
import StripeRouter from './StripeRouter';
import SponsorshipRouter from './SponsorshipRouter';
import DonationRouter from './DonationRouter';
import PresentationRouter from './PresentationRouter';

const stripeRouter = express.Router();
stripeRouter.use('/api/stripe', StripeRouter);

const router = express.Router();

router.use('/api/users', UserRouter);
router.use('/api/login', LoginRouter);
router.use('/api/topics', TopicRouter);
router.use('/api/debates', DebateRouter);
router.use('/api/arguments', ArgumentRouter);
router.use('/api/personality', PersonalityRouter);
router.use('/api/parties', PartyRouter);
router.use('/api/invitations', PartyInvitationRouter);
router.use('/api/admin', AdminRouter);
router.use('/api/search', SearchRouter);
router.use('/api/notification', NotificationRouter);
router.use('/api/contribution', ContributionRouter);
router.use('/api/moderation', ModerationRouter);
router.use('/api/sponsorship', SponsorshipRouter);
router.use('/api/donation', DonationRouter);
router.use('/api/presentation', PresentationRouter);

router.all('*', (req: Request, res: Response) => {
    throw new EndpointNotFoundException(req.path, req.method)
  })
  
router.use((err: Error, req: Request, res: Response, next: NextFunction) => HandlerError.handleError(err, req, res).then(_ => next()))

export default {router, stripeRouter}