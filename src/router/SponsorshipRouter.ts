import { JwtNotInHeaderException } from '@/exceptions/JwtExceptions';
import AuthentificationService from '@/services/AuthentificationService';
import SponsorshipService from '@/services/SponsorshipService';
import express, { NextFunction, Request, Response } from 'express'

const SponsorshipRouter = express.Router();

SponsorshipRouter.get('/generate-sponsorship-code', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization;
        if(!token) {
            throw new JwtNotInHeaderException();
        }
        const userId = AuthentificationService.getUserId(token);
        const code = await SponsorshipService.generateSponsorshipCode(userId);
        res.status(200).send(JSON.stringify({code}));
    } catch (error) {
        next(error);
    }
});

SponsorshipRouter.get('/personal-jackpot', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization;
        if(!token) {
            throw new JwtNotInHeaderException();
        }
        const userId = AuthentificationService.getUserId(token);
        const jackpot = await SponsorshipService.getPersonalJackpot(userId);
        res.status(200).send(jackpot);
    } catch (error) {
        next(error);
    }
});

SponsorshipRouter.post('/personal-jackpot-IBAN', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization;
        if(!token) {
            throw new JwtNotInHeaderException();
        }
        const userId = AuthentificationService.getUserId(token);
        const iban = req.body.iban;
        const jackpot = await SponsorshipService.setPersonalJackpotIBAN(userId, iban);
        res.status(200).send(jackpot);
    } catch (error) {
        next(error);
    }
});

SponsorshipRouter.get('/personal-jackpot-withdraw', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization;
        if(!token) {
            throw new JwtNotInHeaderException();
        }
        const userId = AuthentificationService.getUserId(token);
        const jackpot = await SponsorshipService.withdrawPersonalJackpot(userId);
        res.status(200).send(jackpot);
    } catch (error) {
        next(error);
    }
});

SponsorshipRouter.post('/check-sponsorship-code', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const code = req.body.code;
        const userId = req.body.userId;
        const jackpot = await SponsorshipService.checkSponsorshipCode(code);
        res.status(200).send(jackpot);
    } catch (error) {
        next(error);
    }
});

export default SponsorshipRouter;