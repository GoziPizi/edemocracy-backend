import {
  EmailAlreadyExistsException,
  InvalidRegisterTypeException,
  NoIdentityCardException,
} from '@/exceptions/LoginException';
import AuthentificationService from '@/services/AuthentificationService';
import express, { NextFunction, Request, Response } from 'express';
import multer from 'multer';
import Joi from 'joi';
import {
  FreeUserCreateInputDto,
  StandardUserCreateInputDto,
} from '@/types/dtos/UserDto';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const LoginRouter = express.Router();

LoginRouter.post(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    /**
    #swagger.tags = ['Login']
    #swagger.summary = 'Endpoint to login'
    #swagger.parameters['body] = {
        description: 'password and email',
        required: true,
        schema: { $ref: "#/definitions/LoginPasswordDefinition" }
    }
     */
    try {
      const { email, password } = req.body;
      const jwt = await AuthentificationService.login(email, password);
      res.status(200).send(jwt);
    } catch (error) {
      next(error);
    }
  }
);

LoginRouter.post(
  '/check',
  async (req: Request, res: Response, next: NextFunction) => {
    /**
    #swagger.tags = ['Login']
    #swagger.summary = 'Endpoint to check if token is valid'
    #swagger.parameters['body] = {
        description: 'token',
        required: true,
        schema: { $ref: "#/definitions/TokenDefinition" }
    }
     */
    try {
      const { token } = req.body;
      const isValid = await AuthentificationService.checkToken(token);
      res.status(200).send(isValid);
    } catch (error) {
      next(error);
    }
  }
);

LoginRouter.post(
  '/reset-password',
  async (req: Request, res: Response, next: NextFunction) => {
    /**
    #swagger.tags = ['Login']
    #swagger.summary = 'Endpoint to reset password'
    #swagger.parameters['body] = {
        description: 'email',
        required: true,
        schema: { $ref: "#/definitions/EmailDefinition" }
    }
     */
    try {
      const { email } = req.body;
      await AuthentificationService.resetPassword(email);
      res.status(200).send();
    } catch (error) {
      next(error);
    }
  }
);

LoginRouter.post(
  '/change-password',
  async (req: Request, res: Response, next: NextFunction) => {
    /**
    #swagger.tags = ['Login']
    #swagger.summary = 'Endpoint to change password'
    #swagger.parameters['body] = {
        description: 'email, password and token',
        required: true,
        schema: { $ref: "#/definitions/ChangePasswordDefinition" }
    }
     */
    try {
      const { email, password, token } = req.body;
      await AuthentificationService.changePassword(email, password, token);
      res.status(200).send();
    } catch (error) {
      next(error);
    }
  }
);

LoginRouter.post(
  '/register-free',
  upload.none(),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userInput = req.body;

      //Input validation

      const schema = Joi.object({
        email: Joi.string().email().required(),
        firstName: Joi.string().required(),
        name: Joi.string().required(),
        telephone: Joi.string().required(),
        address: Joi.string().required(),
        postalCode: Joi.string().required(),
        city: Joi.string().required(),
        politicSide: Joi.string().required(),
        password: Joi.string().required(),
        profession: Joi.string(),
        diplomas: Joi.string(),
        yearsOfExperience: Joi.string(),
        formationName: Joi.string(),
        formationObtention: Joi.string(),
        birthSex: Joi.string(),
        actualSex: Joi.string(),
        sexualOrientation: Joi.string(),
        religion: Joi.string(),
        origin1: Joi.string(),
        origin2: Joi.string(),
        origin3: Joi.string(),
        origin4: Joi.string(),
        sponsorshipCode: Joi.string(),
      });

      const { error } = schema.validate(userInput);
      console.log(error);
      if (error) {
        throw new InvalidRegisterTypeException();
      }

      //Check if email already exists
      const mailTaken = await AuthentificationService.isEmailTaken(
        userInput.email
      );
      if (mailTaken) {
        throw new EmailAlreadyExistsException();
      }

      //end of input validation

      await AuthentificationService.registerFree(userInput);
      const jwt = await AuthentificationService.login(
        userInput.email,
        userInput.password
      );

      res.status(200).send(jwt);
    } catch (error) {
      next(error);
    }
  }
);

LoginRouter.post(
  '/register-paid/:registerType',
  upload.fields([
    { name: 'recto1', maxCount: 1 },
    { name: 'verso1', maxCount: 1 },
    { name: 'recto2', maxCount: 1 },
    { name: 'verso2', maxCount: 1 },
    { name: 'recto3', maxCount: 1 },
    { name: 'verso3', maxCount: 1 },
  ]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };

      const recto1 = files['recto1'] ? files['recto1'][0] : undefined;
      const verso1 = files['verso1'] ? files['verso1'][0] : undefined;
      const recto2 = files['recto2'] ? files['recto2'][0] : undefined;
      const verso2 = files['verso2'] ? files['verso2'][0] : undefined;
      const recto3 = files['recto3'] ? files['recto3'][0] : undefined;
      const verso3 = files['verso3'] ? files['verso3'][0] : undefined;
      const userInput = req.body;
      const registerType = req.params.registerType;

      if (
        registerType !== 'standard' &&
        registerType !== 'premium' &&
        registerType !== 'bienfaiteur'
      ) {
        throw new InvalidRegisterTypeException();
      }

      //Input validation
      if (!recto1 || !verso1 || !userInput.idNumber1) {
        throw new NoIdentityCardException();
      }

      if (recto2 || verso2 || userInput.idNumber2) {
        if (!recto2 || !verso2 || !userInput.idNumber2) {
          throw new NoIdentityCardException();
        }
      }

      if (recto3 || verso3 || userInput.idNumber3) {
        if (!recto3 || !verso3 || !userInput.idNumber3) {
          throw new NoIdentityCardException();
        }
      }

      const schema = Joi.object({
        email: Joi.string().email().required(),
        firstName: Joi.string().required(),
        name: Joi.string().required(),
        telephone: Joi.string().required(),
        address: Joi.string().required(),
        postalCode: Joi.string().required(),
        city: Joi.string().required(),
        politicSide: Joi.string().required(),
        password: Joi.string().required(),
        idNumber1: Joi.string().required(),
        idNationality1: Joi.string().required(),
        idNumber2: Joi.string(),
        idNationality2: Joi.string(),
        idNumber3: Joi.string(),
        idNationality3: Joi.string(),
        profession: Joi.string(),
        diplomas: Joi.string(),
        yearsOfExperience: Joi.string(),
        formationName: Joi.string(),
        formationObtention: Joi.string(),
        birthSex: Joi.string(),
        actualSex: Joi.string(),
        sexualOrientation: Joi.string(),
        religion: Joi.string(),
        origin1: Joi.string(),
        origin2: Joi.string(),
        origin3: Joi.string(),
        origin4: Joi.string(),
        sponsorshipCode: Joi.string(),
      });

      const { value, error } = schema.validate(userInput);
      if (error) {
        throw new InvalidRegisterTypeException();
      }

      //Check if email already exists
      const mailTaken = await AuthentificationService.isEmailTaken(value.email);
      if (mailTaken) {
        throw new EmailAlreadyExistsException();
      }

      //end of input validation

      const checkoutUrl = await AuthentificationService.preRegisterPaid(
        value,
        registerType,
        recto1,
        verso1,
        recto2,
        verso2,
        recto3,
        verso3
      );
      return res.status(200).send({ checkoutUrl });
    } catch (error) {
      next(error);
    }
  }
);

export default LoginRouter;
