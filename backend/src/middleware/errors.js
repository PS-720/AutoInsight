export function notFound(_request, response) {
  response.status(404).json({ success: false, message: "Route not found." });
}

export function errorHandler(error, _request, response, _next) {
  const status = Number.isInteger(error.status) ? error.status : 500;
  if (status >= 500) console.error(error);
  response.status(status).json({
    success: false,
    message: status >= 500 ? "Internal server error." : error.message,
    ...(error.details ? { details: error.details } : {}),
  });
}
