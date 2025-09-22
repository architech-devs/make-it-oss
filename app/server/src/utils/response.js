export const successResponse = (res, data, message = 'Success') => {
    return res.json({ success: true, message, data });
  };
  
  export const errorResponse = (res, message, code = 400) => {
    return res.status(code).json({ success: false, message });
  };
  