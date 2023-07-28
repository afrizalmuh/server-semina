const express = require('express')
const router = express();
const { create, index, find, update, destroy } = require('./controller')
const middlewaresAuth = require('../../../middlewares/auth')

router.get('/payments', middlewaresAuth.authenticateUser, middlewaresAuth.authorizeRole('organizer'), index)
router.get('/payments/:id', middlewaresAuth.authenticateUser, middlewaresAuth.authorizeRole('organizer'), find)
router.put('/payments/:id', middlewaresAuth.authenticateUser, middlewaresAuth.authorizeRole('organizer'), update)
router.delete('/payments/:id', middlewaresAuth.authenticateUser, middlewaresAuth.authorizeRole('organizer'), destroy)
router.post('/payments', middlewaresAuth.authenticateUser, middlewaresAuth.authorizeRole('organizer'), create)

module.exports = router