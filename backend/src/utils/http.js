export class HttpError extends Error {
  constructor(status, message, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export function asyncHandler(handler) {
  return (request, response, next) =>
    Promise.resolve(handler(request, response, next)).catch(next);
}

export function parsePagination(query) {
  const page = Math.max(1, Number.parseInt(query.page || "1", 10));
  const limit = Math.min(
    100,
    Math.max(1, Number.parseInt(query.limit || "20", 10)),
  );
  return {
    page: Number.isNaN(page) ? 1 : page,
    limit: Number.isNaN(limit) ? 20 : limit,
  };
}

export function paginate(items, page, limit) {
  const start = (page - 1) * limit;
  return {
    items: items.slice(start, start + limit),
    pagination: {
      page,
      limit,
      total: items.length,
      pages: Math.ceil(items.length / limit),
    },
  };
}
