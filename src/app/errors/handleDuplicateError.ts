/* eslint-disable @typescript-eslint/no-explicit-any */

import { TErrorSources, TGenericErrorResponse } from '../interface/error';

const handleDuplicateError = (error: any): TGenericErrorResponse => {
  // extract the value inside double quotes
  const regex = /"([^"]*)"/;
  const match = error.message.match(regex);
  // extract the key name from the array;
  const extractedMessage = match && match[1];

  const errorSources: TErrorSources = [
    {
      path: '',
      message: `${extractedMessage} is already exists`,
    },
  ];
  const statusCode = 400;

  return {
    statusCode,
    message: 'Duplicate key error',
    errorSources,
  };
};
export default handleDuplicateError;
