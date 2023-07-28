const NotFoundError = require('./not-found')
const BadRequestError = require('./bad-request')
const CustomAPIError = require('./custom-api-error')
const UnauthenticatedError = require('./unauthenticated')
const UnauthorizedError = require('./unauthorized')

module.exports = {
  NotFoundError,
  BadRequestError,
  CustomAPIError,
  UnauthenticatedError,
  UnauthorizedError
}