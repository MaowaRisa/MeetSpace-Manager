import { Response } from 'express';

export type TResponse<T> = {
  success: boolean;
  statusCode: number;
  message: string;
  token?: string;
  data: T;
};
const sendResponse = <T>(res: Response, data: TResponse<T>) => {
  res.status(data.statusCode).json({
    success: data.success,
    statusCode: data.statusCode,
    message: data.message,
    token: data?.token,
    data: data.data,
  });
};
export default sendResponse;
