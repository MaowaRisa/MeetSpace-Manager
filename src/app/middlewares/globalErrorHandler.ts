import { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { TErrorSources } from '../interface/error';
import config from '../config';
import { handleZodError } from '../errors/handleZodError';
import handleValidationError from '../errors/handleValidationError';
import AppError from '../errors/appError';

const globalErrorHandler: ErrorRequestHandler = (error, req, res, next) => {
  // Setting default values
  let statusCode = 500;
  let message = 'Something went wrong!';

  let errorSources: TErrorSources = [
    {
      path: '',
      message: 'Something went wrong!',
    },
  ];

  if (error instanceof ZodError) {
    const simplifiedError = handleZodError(error);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
  } else if (error?.name === 'ValidationError') {
    const simplifiedError = handleValidationError(error);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
  } else if (error instanceof AppError) {
    statusCode = error?.statusCode;
    message = error?.message;
    errorSources = [
      {
        path: '',
        message: error.message,
      },
    ];
  } else if (error instanceof Error) {
    message = error?.message;
    errorSources = [
      {
        path: '',
        message: error.message,
      },
    ];
  }
  return res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    stack: config.node_env === 'development' && error.stack, // only in development environment
  });
  next();
};

export default globalErrorHandler;
