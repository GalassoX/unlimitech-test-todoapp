import { ENV } from '@/config/environments';
import { CONSTANTS } from '@/constants/common';
import jwt from 'jsonwebtoken';

export function signJwt(userId: string): string {
  const payload: object = { 
    userId 
  };

  const options: jwt.SignOptions = {
    algorithm: CONSTANTS.JWT_ALGORITHM as jwt.Algorithm,
    expiresIn: CONSTANTS.HOUR_IN_MILIS,
    audience: CONSTANTS.JWT_AUDIENCE,
    issuer: CONSTANTS.JWT_ISSUER,
  };

  return jwt.sign(payload, ENV.JWT_SECRET, options);
}

export function verifyJwt(token: string): { userId: string} {
  const decoded = jwt.verify(token, ENV.JWT_SECRET, {
    algorithms: [CONSTANTS.JWT_ALGORITHM as jwt.Algorithm],
    audience: CONSTANTS.JWT_AUDIENCE,
    issuer: CONSTANTS.JWT_ISSUER,
  });
  return decoded as { userId: string };
}