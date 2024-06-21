import { Model } from 'mongoose';
import { USER_ROLE } from './user.constants';

export interface TUser {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  role: 'user' | 'admin';
}
export type TLoginUser = {
  email: string;
  password: string;
};
export interface UserModel extends Model<TUser> {
  isUserExistsByEmail(id: string): Promise<TUser | null>;
  isPasswordMatched(
    plaintextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
}
export type TJwtPayload = {
  email: string;
  role: string;
};
export type TUserRole = keyof typeof USER_ROLE;
