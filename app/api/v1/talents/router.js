const express = require('express');
const router = express();
const { index, create, update, destroy, find } = require('./controller')
const middlewareAuth = require('../../../middlewares/auth')

router.get('/talents', middlewareAuth.authenticateUser, middlewareAuth.authorizeRole('organizer'), index);
router.get('/talents/:id', middlewareAuth.authenticateUser, middlewareAuth.authorizeRole('organizer'), find);
router.put('/talents/:id', middlewareAuth.authenticateUser, middlewareAuth.authorizeRole('organizer'), update);
router.delete('/talents/:id', middlewareAuth.authenticateUser, middlewareAuth.authorizeRole('organizer'), destroy);
router.post('/talents', middlewareAuth.authenticateUser, middlewareAuth.authorizeRole('organizer'), create);

module.exports = router;