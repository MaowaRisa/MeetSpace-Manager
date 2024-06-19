import { TJwtPayload } from './user.interface';
import jwt from 'jsonwebtoken';
export const createToken = (
  jwtPayload: TJwtPayload,
  secret: string,
  expiresIn: string,
) => {
  return jwt.sign(jwtPayload, secret, { expiresIn });
};
