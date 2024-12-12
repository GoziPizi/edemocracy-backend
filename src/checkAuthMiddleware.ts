import { Request, Response, NextFunction } from 'express';
import { JwtNotInHeaderException } from './exceptions/JwtExceptions';
import ModerationService from './services/ModerationService';
import AuthentificationService from './services/AuthentificationService';
import { UserBannedException } from './exceptions/ModerationException';

//responsible for decoding the user, checking if it exists, and checking if it is banned

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization;
      if(!token) {
          throw new JwtNotInHeaderException();
      }

    const userId = AuthentificationService.getUserId(token);
    const userStatus = await ModerationService.getUserStatus(userId);

    if (userStatus === 'ban') {
      throw new UserBannedException();
    }

    next(); // User is not banned, proceed to the next middleware or route handler
  } catch (error) {
    next(error); // Forward error to the error handler
  }
};
