const BaseError = require('./BaseError');
class APIError extends BaseError {
  constructor(message, status) {
    super(message , status || 400);
  }
}
module.exports = APIError;
