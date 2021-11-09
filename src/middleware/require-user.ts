import { Request, Response, NextFunction } from 'express';
import { get } from 'lodash';
import log from '../logger';
import UserNotFoundException from '../exceptions/user-not-found.exception';
import AuthenticationTokenException from '../exceptions/authentication.exception';

const requireUser = (req: Request, res: Response, next: NextFunction) => {
  // const user = res.locals.user;
  const user = get(res, 'locals.user');
  log.info(`Require User ${JSON.stringify(user)}`);
  if (!user) {
    const userId = get(user, '_id');
    if (userId !== undefined) {
      return next(new UserNotFoundException(userId));
    } else {
      return next(new AuthenticationTokenException());
    }
  }
  return next();
};

export default requireUser;
