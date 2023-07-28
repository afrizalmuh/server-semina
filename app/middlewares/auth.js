const { UnauthenticatedError, UnauthorizedError } = require('../errors')
const { isTokenValid } = require('../utils/jwt')

const middlewares = {
  authenticateUser: async (req, res, next) => {
    try {
      let token;
      const autHeader = req.headers.authorization;
      if (autHeader && autHeader.startsWith('Bearer')) {
        token = autHeader.split(' ')[1];
      }
      if (!token) {
        throw new UnauthenticatedError('Authenticataion invalid')
      }

      const payload = isTokenValid({ token })
      req.user = {
        email: payload.email,
        role: payload.role,
        name: payload.name,
        organizer: payload.organizer,
        id: payload.userId
      }
      next();
    } catch (err) {
      next(err)
    }
  },
  authenticateParticipant: async (req, res, next) => {
    try {
      let token;
      const autHeader = req.headers.authorization;
      if (autHeader && autHeader.startsWith('Bearer')) {
        token = autHeader.split(' ')[1];
      }
      if (!token) {
        throw new UnauthenticatedError('Authenticataion invalid')
      }

      const payload = isTokenValid({ token })
      req.participant = {
        email: payload.email,
        firstName: payload.firstName,
        lastName: payload.lastName,
        id: payload.participantId
      }
      next();
    } catch (err) {
      next(err)
    }
  },
  authorizeRole: (...roles) => {
    return (req, res, next) => {
      console.log('role => ', req.user.role)
      console.log('roles => ', roles)
      if (!roles.includes(req.user.role)) {
        throw new UnauthorizedError('Unathorized to access this route')
      }
      next();
    }
  }
}

module.exports = middlewares