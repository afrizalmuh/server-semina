const express = require('express')
const router = express()
const {
  signup,
  signin,
  activateParticipant,
  getAllLandingPage,
  getDetailLandingPage,
  getDashboard,
  checkout
} = require('./controller')
const middlewareAuth = require('../../../middlewares/auth')

router.post('/auth/signup', signup)
router.post('/auth/signin', signin)
router.put('/active', activateParticipant)
router.get('/events', getAllLandingPage)
router.get('/events/:id', getDetailLandingPage)
router.get('/orders', middlewareAuth.authenticateParticipant, getDashboard)
router.post('/checkout', middlewareAuth.authenticateParticipant, checkout)
module.exports = router