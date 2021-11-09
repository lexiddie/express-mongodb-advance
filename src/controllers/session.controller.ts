import { Request, Response, NextFunction, Router } from 'express';
import config from 'config';
import log from '../logger';
import Controller from '../interfaces/controller.interface';
import { createSession, findSessions, updateSession } from '../services/session.services';
import { validatePassword } from '../services/user.services';
import { createSessionSchema } from '../schemas/session.schema';
import WrongCredentialsException from '../exceptions/wrong-credentials.exception';
import { requireUser, validateResource } from '../middleware';
import { signJwt } from '../utils/jwt.utils';
import { getSuccessResponse } from '../utils/response.utils';

class SessionController implements Controller {
  public path = '/sessions';
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}`, validateResource(createSessionSchema), this.createUserSessionHandler);
    this.router.get(`${this.path}`, requireUser, this.getUserSessionsHandler);
    this.router.delete(`${this.path}`, requireUser, this.deleteSessionHandler);
  }

  createUserSessionHandler = async (req: Request, res: Response, next: NextFunction) => {
    // validate the email and password
    const user: any = await validatePassword(req.body);
    log.info(`Validate User ${JSON.stringify(user)}`);
    if (!user) {
      return next(new WrongCredentialsException());
    }

    // Create a session
    const session = await createSession(user._id, req.get('user-agent') || '');
    log.info(`Session: ${JSON.stringify(session)}`);

    const signData = { ...user, session: session._id };
    log.info(`Sign Data: ${JSON.stringify(signData)}`);

    // Create an access token
    const accessTokenTtl = config.get<string>('accessTokenTtl'); // 15 minutes
    const accessToken = signJwt(signData, { expiresIn: accessTokenTtl });

    // Create an refresh token
    const refreshTokenTtl = config.get<string>('refreshTokenTtl'); // 1 year
    const refreshToken = signJwt(signData, { expiresIn: refreshTokenTtl });

    // Send access & refresh token back
    return res.json(getSuccessResponse({ accessToken, refreshToken }));
  };

  getUserSessionsHandler = async (req: Request, res: Response, next: NextFunction) => {
    const userId = res.locals.user._id;
    // const sessions = await findSessions({ user: userId, valid: true });
    const sessions = await findSessions({ user: userId });
    return res.json(getSuccessResponse(sessions));
  };

  deleteSessionHandler = async (req: Request, res: Response, next: NextFunction) => {
    const sessionId = res.locals.user.session;
    await updateSession({ _id: sessionId }, { valid: false });
    return res.json(getSuccessResponse(`Session ID: ${sessionId} has been deactivated.`));
  };
}

export default SessionController;
