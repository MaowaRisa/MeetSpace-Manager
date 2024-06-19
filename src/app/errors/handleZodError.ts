import { ZodError, ZodIssue } from 'zod';
import { TErrorMessages, TGenericErrorResponse } from '../interface/error';


export const handleZodError = (error: ZodError): TGenericErrorResponse => {
  const statusCode = 400;

  const errorMessages: TErrorMessages = error.issues.map((issue: ZodIssue) => {
    return {
      path: issue?.path[issue.path.length - 1],
      message: issue.message,
    };
  });
  return {
    statusCode,
    message: errorMessages.map(err => `${err.path} ${err.message}`).join(' | '),
    errorMessages,
  };
};
