const User = require('../models/user')
const express = require('express')
const router = express.Router();
const { signUp, signIn, signOut, requiredSignIn, isAdmin, isAuth } = require('../controller/authController');
const { userById } = require('../controller/userController');

router.get('/', (req, res) => {
  res.send('Greeting from auth routes')
})

router.post('/signup', signUp);
router.post('/signin', signIn);
router.get('/signout', signOut);

router.get('/requiredSignIn', requiredSignIn, (req, res) => {
  console.log(req.auth);
  res.send('this route is only for signin users')
})

router.get('/isAuth/isAdmin/:userById', requiredSignIn, isAuth, isAdmin, (req, res) => {
  res.send('this route is only for admin')
})

router.param('userById', userById);
module.exports = router;