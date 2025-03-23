import { JwtNotInHeaderException } from '@/exceptions/JwtExceptions';
import AuthentificationService from '@/services/AuthentificationService';
import PersonalityService from '@/services/PersonalityService';
import express, { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

const PersonalityRouter = express.Router();

PersonalityRouter.post(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    /**
     * #swagger.tags = ['Personality']
     * #swagger.description = 'Endpoint to create a personality'
     * #swagger.parameters['body'] = {
     *    in: 'body',
     *   description: 'Personality informations',
     *  required: true,
     * schema: { $ref: "#/definitions/Personality" }
     */
    try {
      const token = req.headers.authorization;
      if (!token) {
        throw new JwtNotInHeaderException();
      }
      await AuthentificationService.checkToken(token);
      const userId = AuthentificationService.getUserId(token);
      const result = await PersonalityService.createPersonality(userId);
      res.status(201).send(result);
    } catch (error) {
      next(error);
    }
  }
);

PersonalityRouter.put(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    const allowedSchema = Joi.object({
      description: Joi.string().required(),
      pseudo: Joi.string().allow(null).optional(),
    });
    try {
      const token = req.headers.authorization;
      if (!token) {
        throw new JwtNotInHeaderException();
      }
      await AuthentificationService.checkToken(token);
      const userId = AuthentificationService.getUserId(token);

      const { value, error } = allowedSchema.validate(req.body);

      if (error) {
        throw new Error(error.message);
      }

      const result = await PersonalityService.updatePersonalityFromUserId(
        userId,
        value
      );
      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
);

PersonalityRouter.post(
  '/search',
  async (req: Request, res: Response, next: NextFunction) => {
    /**
        #swagger.tags = ['Personality', Search]
        #swagger.description = 'Endpoint to search some personalities'
        #swagger.parameters['body'] = {
            description: 'criterias to search',
            required: true,
        }
        #swagger.responses[201] = {
            description: 'List of the personalities found',
        }
     */
    try {
      const result = await PersonalityService.searchPersonality(req.body);
      res.status(201).send(result);
    } catch (error) {
      next(error);
    }
  }
);

PersonalityRouter.get(
  '/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    /**
        #swagger.tags = ['Personality']
        #swagger.description = 'Endpoint to get a personality'
        #swagger.parameters['id'] = { description: 'Personality id' }
        #swagger.responses[200] = {
            description: 'Personality found',
        }
     */
    try {
      const result = await PersonalityService.getPersonality(req.params.id);
      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
);

PersonalityRouter.get(
  '/:id/opinions',
  async (req: Request, res: Response, next: NextFunction) => {
    /**
        #swagger.tags = ['Personality']
        #swagger.description = 'Endpoint to get the opinions of a personality'
        #swagger.parameters['id'] = { description: 'Personality id' }
        #swagger.responses[200] = {
            description: 'Opinions found',
        }
     */
    try {
      const result = await PersonalityService.getOpinions(req.params.id);
      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
);

PersonalityRouter.get(
  '/:id/private-infos',
  async (req: Request, res: Response, next: NextFunction) => {
    //TODO
    try {
      //TODO
      //Accessible seulement si l'on est la personalité
      res.status(200);
    } catch (error) {
      next(error);
    }
  }
);

PersonalityRouter.put(
  '/:id/description',
  async (req: Request, res: Response, next: NextFunction) => {
    //TODO
    try {
      //TODO
      //Accessible seulement si l'on est la personalité
      res.status(200);
    } catch (error) {
      next(error);
    }
  }
);

PersonalityRouter.get(
  '/:id/debates',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      if (!id) {
        throw new Error('Party id is required');
      }
      const debates = await PersonalityService.getDebatesFromPersonalityId(id);
      res.status(200).send(debates);
    } catch (error) {
      next(error);
    }
  }
);

PersonalityRouter.get(
  '/:id/personal-debates',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      if (!id) {
        throw new Error('Party id is required');
      }
      const debates =
        await PersonalityService.getPersonalDebatesFromPersonalityId(id);
      res.status(200).send(debates);
    } catch (error) {
      next(error);
    }
  }
);

PersonalityRouter.post(
  '/:id/first-debate-display',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        throw new JwtNotInHeaderException();
      }
      await AuthentificationService.checkToken(token);
      const userId = AuthentificationService.getUserId(token);
      const id = req.params.id;
      if (!id) {
        throw new Error('Party id is required');
      }
      const debateId = req.body.debateId;
      const personality = await PersonalityService.setFirstDebateDisplay(
        id,
        debateId,
        userId
      );
      res.status(200).send(personality);
    } catch (error) {
      next(error);
    }
  }
);

export default PersonalityRouter;
