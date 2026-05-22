export class NotFoundError extends Error {
  statusCode = 404;
  constructor(message = "Issue not found") {
    super(message);
    this.name = "NotFoundError";
  }
}

export class ForbiddenError extends Error {
  statusCode = 403;
  constructor(message = "You don't have permission") {
    super(message);
    this.name = "ForbiddenError";
  }
}
