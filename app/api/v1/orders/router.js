const express = require('express')
const router = express()
const { index } = require('./controller')
const middlewaresAuth = require('../../../middlewares/auth')

router.get('/orders', middlewaresAuth.authenticateUser, middlewaresAuth.authorizeRole('organizer', 'admin', 'owner'), index)
module.exports = router