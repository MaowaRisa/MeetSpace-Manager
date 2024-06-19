/* eslint-disable @typescript-eslint/no-explicit-any */

import { TErrorMessages, TGenericErrorResponse } from '../interface/error';

const handleDuplicateError = (error: any): TGenericErrorResponse => {

  const errorMessages: TErrorMessages = [
    {
      path: '',
      message: error.message,
    },
  ];
  const statusCode = 400;

  return {
    statusCode,
    message: error.message,
    errorMessages,
  };
};
export default handleDuplicateError;
