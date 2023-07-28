const express = require('express')
const router = express()
const { createCMSOrganizer, createCMSUser, getCMSUser } = require('./controller')
const middlewareAuth = require('../../../middlewares/auth')

router.post('/organizers', middlewareAuth.authenticateUser, middlewareAuth.authorizeRole('owner'), createCMSOrganizer);
router.post('/users', middlewareAuth.authenticateUser, middlewareAuth.authorizeRole('organizer'), createCMSUser);
router.get('/users', middlewareAuth.authenticateUser, middlewareAuth.authorizeRole('owner'), getCMSUser);

module.exports = router