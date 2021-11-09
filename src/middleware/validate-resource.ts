import { AnyZodObject } from 'zod';
import { Request, Response, NextFunction } from 'express';
import log from '../logger';
import WrongRequestException from '../exceptions/wrong-request.exception';

const validateResource = (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params
    });
    next();
  } catch (err: any) {
    log.error(err);
    return next(new WrongRequestException(err.message));
  }
};

export default validateResource;
