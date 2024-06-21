import httpStatus from 'http-status';
import { TLoginUser, TUser } from './user.interface';
import { User } from './user.model';
import { createToken } from './user.utils';
import config from '../../config';
import AppError from '../../errors/AppError';
import { selectedFieldsForUser } from './user.constants';

const createUserIntoDB = async (payload: TUser) => {
  const result = await User.create(payload);
  const newUser = await User.findById(result._id).select(selectedFieldsForUser);
  return newUser;
};
const loginUser = async (payload: TLoginUser) => {
  // check if the user exists
  const user = await User.isUserExistsByEmail(payload.email);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User is not found!');
  }

  // checking if the password is correct
  if (!(await User.isPasswordMatched(payload.password, user.password))) {
    throw new AppError(httpStatus.FORBIDDEN, 'Wrong credentials!');
  }
  // token generate and send it to the client
  const jwtPayload = {
    email: user.email,
    role: user.role,
  };
  const userDetails = await User.findOne({ email: user.email }).select(selectedFieldsForUser);

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  return {
    accessToken,
    userDetails,
  };
};
export const UserServices = {
  createUserIntoDB,
  loginUser,
};
