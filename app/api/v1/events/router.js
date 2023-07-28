const express = require('express')
const router = express();
const {
  index,
  update,
  create,
  find,
  destroy,
  changeStatus
} = require('./controller')
const middlewareAuth = require('../../../middlewares/auth')

router.get('/events', middlewareAuth.authenticateUser, middlewareAuth.authorizeRole('organizer'), index);
router.get('/events/:id', middlewareAuth.authenticateUser, middlewareAuth.authorizeRole('organizer'), find);
router.put('/events/:id', middlewareAuth.authenticateUser, middlewareAuth.authorizeRole('organizer'), update);
router.delete('/events/:id', middlewareAuth.authenticateUser, middlewareAuth.authorizeRole('organizer'), destroy);
router.post('/events', middlewareAuth.authenticateUser, middlewareAuth.authorizeRole('organizer'), create);
router.put('/events/:id/status', middlewareAuth.authenticateUser, middlewareAuth.authorizeRole('organizer'), changeStatus)

module.exports = router