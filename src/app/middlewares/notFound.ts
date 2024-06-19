import { RequestHandler } from 'express';
import httpStatus from 'http-status';

const notFound: RequestHandler = (req, res) => {
  return res.status(httpStatus.NOT_FOUND).json({
    success: false,
    statusCode: 404,
    message: 'Not Found',
  });
};
export default notFound;
