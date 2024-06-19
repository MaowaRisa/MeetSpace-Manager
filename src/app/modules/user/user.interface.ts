import { Model } from 'mongoose';

export type TUser = {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  role: 'user' | 'admin';
};
export type TLoginUser = {
  email: string;
  password: string;
};
export interface UserModel extends Model<TUser> {
  isUserExistsByEmail(id: string): Promise<TUser | null>;
  isPasswordMatched(plaintextPassword: string, hashedPassword: string): boolean;
}
export type TJwtPayload = {
    email: string;
    role: string;
}
