class BaseError extends Error {
  constructor(message, status) {
    super(message);
    this.statusCode = status;
    this.message = message;
  }
  toJSON() {
    return {
      statusCode : this.statusCode,
      message : this.message
    }
  }
}

module.exports = BaseError;
