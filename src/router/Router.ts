import express, { NextFunction, Request, Response } from 'express'

import HandlerError from '@/classes/ErrorHandler'
import UserRouter from './UserRouter';
import LoginRouter from './LoginRouter';
import { EndpointNotFoundException } from '@/exceptions/BaseExceptions';

const router = express.Router();

router.use('/api/users', UserRouter);
router.use('/api/login', LoginRouter);

router.all('*', (req: Request, res: Response) => {
    throw new EndpointNotFoundException(req.path, req.method)
  })
  
  router.use((err: Error, req: Request, res: Response, next: NextFunction) => HandlerError.handleError(err, req, res).then(_ => next()))

export default router;