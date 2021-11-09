import fs from 'fs';
import jwt from 'jsonwebtoken';
// import config from 'config';
// import log from '../logger';

// const privateKey = config.get<string>('privateKey');
// const publicKey = config.get<string>('publicKey');

const privateKey = fs.readFileSync('private.key');
const publicKey = fs.readFileSync('public.key');

export const signJwt = (object: Object, options?: jwt.SignOptions | undefined) => {
  // log.info(`JWT Option: ${JSON.stringify(options)}`);
  return jwt.sign(object, privateKey, {
    ...(options && options),
    algorithm: 'RS256'
  });
};

export const verifyJwt = (token: string) => {
  try {
    const decoded = jwt.verify(token, publicKey);
    const decode = { valid: true, expired: false, decoded };
    return decode;
  } catch (err: any) {
    console.error(`Verify JWT Err:`, err);
    return {
      valid: false,
      expired: err.message === 'jwt expired',
      decoded: null
    };
  }
};
