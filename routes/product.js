const express = require('express');
const { requiredSignIn, isAuth, isAdmin } = require('../controller/authController');
const { lists, create, productById, update, remove, photo, related } = require('../controller/productController');
const { userById } = require('../controller/userController');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('basic product route')
})

router.get('/lists', lists)
router.post('/create/:userById', requiredSignIn, isAuth, isAdmin, create)
router.put('/update/:productById/:userById', requiredSignIn, isAuth, isAdmin, update)
router.delete('/delete/:productById', remove)

router.get('/photo/:productById', photo)
router.get('/related/:productById', related)

router.param('productById', productById)
router.param('userById', userById)

module.exports = router