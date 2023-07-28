const express = require('express');
const router = express();
const { create, index, find, update, destroy } = require('./controller')
const middlewareAuth = require('../../../middlewares/auth')
// router.get('/categories', (req, res) => {
//   const data = [
//     {
//       _id: 1,
//       name: 'nutech',
//     }, {
//       _id: 2,
//       name: 'integrasi',
//     },
//   ];

//   res.status(200).json({
//     data
//   });
// })
router.get('/categories', middlewareAuth.authenticateUser, middlewareAuth.authorizeRole('organizer'), index)
router.get('/categories/:id', middlewareAuth.authenticateUser, middlewareAuth.authorizeRole('organizer'), find)
router.delete('/categories/:id', middlewareAuth.authenticateUser, middlewareAuth.authorizeRole('organizer'), destroy)
router.put('/categories/:id', middlewareAuth.authenticateUser, middlewareAuth.authorizeRole('organizer'), update)
router.post('/categories', middlewareAuth.authenticateUser, middlewareAuth.authorizeRole('organizer'), create);

module.exports = router;