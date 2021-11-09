import { Request, Response, NextFunction } from 'express';
import HttpException from '../exceptions/http.exception';

const errorMiddleware = (error: HttpException, req: Request, res: Response, next: NextFunction) => {
  const status = error.status || 500;
  const message = error.message || 'Something went wrong';
  const data = error.data || null;

  res.status(status).send({ status, message, data });
};

export default errorMiddleware;
