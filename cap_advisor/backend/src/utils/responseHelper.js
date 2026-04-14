function successResponse(data = {}, message = 'Success') {
  return { success: true, message, data };
}

function errorResponse(error = 'An error occurred', details = []) {
  return { success: false, error, details };
}

module.exports = { successResponse, errorResponse };
