const express = require('express');
const { requiredSignIn, isAuth, isAdmin } = require('../controller/authController');
const { lists, create, update, categoryById, remove } = require('../controller/categoryController');
const { userById } = require('../controller/userController');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('basic category route')
})

router.get('/lists', lists)
router.post('/create/:userById', requiredSignIn, isAuth, isAdmin, create)
router.put('/update/:categoryById/:userById', requiredSignIn, isAuth, isAdmin, update);
router.delete('/delete/:categoryById/:userById', requiredSignIn, isAuth, isAdmin, remove);

// router.get('categoryById', categoryById)
router.param('userById', userById)
router.param('categoryById', categoryById)
module.exports = router;