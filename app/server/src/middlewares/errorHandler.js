import { errorResponse } from '../utils/response.js';

export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  return errorResponse(res, err.message || 'Internal Server Error', 500);
};
