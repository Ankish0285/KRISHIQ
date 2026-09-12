export const successResponse = (data = null, message = 'Success') => ({
  success: true,
  message,
  data,
});

export const errorResponse = (message = 'Something went wrong', error = null) => ({
  success: false,
  message,
  error,
});