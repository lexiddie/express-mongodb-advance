import { FilterQuery, UpdateQuery } from 'mongoose';
import { get } from 'lodash';
import config from 'config';
import SessionModel, { SessionDocument } from '../models/session.model';
import { verifyJwt, signJwt } from '../utils/jwt.utils';
import { findUser } from './user.services';

export const createSession = async (userId: string, userAgent: string) => {
  const session = await SessionModel.create({ user: userId, userAgent });
  return session.toJSON();
};

export const findSessions = async (query: FilterQuery<SessionDocument>) => {
  return SessionModel.find(query).lean();
};

export const updateSession = async (query: FilterQuery<SessionDocument>, update: UpdateQuery<SessionDocument>) => {
  return SessionModel.updateOne(query, update);
};

export const reIssueAccessToken = async ({ refreshToken }: { refreshToken: string }) => {
  const { decoded } = verifyJwt(refreshToken);
  if (!decoded || !get(decoded, 'session')) return false;

  const sessionId = get(decoded, 'session');
  const session = await SessionModel.findById(sessionId);

  if (!session || !session.valid) return false;

  const user = await findUser({ _id: session.user });

  if (!user) return false;

  const accessTokenTtl = config.get<string>('accessTokenTtl');
  const accessToken = signJwt({ ...user, session: session._id }, { expiresIn: accessTokenTtl });

  return accessToken;
};
