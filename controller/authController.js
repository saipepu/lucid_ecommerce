const User = require('../models/user')
const jwt = require('jsonwebtoken')
const expressJwt = require('express-jwt')
require('dotenv').config();

exports.signUp = (req, res) => {
  const adminList = ['adminPepu@gmail.com','pepu@luciana.com','yeolda@luciana.com'];
  if(adminList.includes(req.body.email)){
    req.body.role = 1
  } else {
    req.body.role = 0;
  }
  const user = new User(req.body);
  user.save((err, result) => {
    if (err) return res.status(400).json({ signUpSuccess: false, error: err })

    console.log(result.role);
    res.status(200).json({ signUpSuccess: true, message: result})
  })
}

exports.signIn = (req, res) => {
  const { email, password } = req.body;
  User.findOne({email: email}, (err, user) => {
    if( err || !user) return res.status(400).json({ signInSuccess: false, error: `${err} no user with this email`})

    if (!user.authentication(password)) return res.status(400).json({ signInSuccess: false, error: 'pwd and email does not match' });

    const token = jwt.sign({ _id: user._id}, process.env.SECRET)
    res.cookie('token', token, {expire: new Date() + 9999 })
    return res.status(200).json({ signInSuccess: true, message: {token, user}})
  })
}

exports.signOut = (req, res) => {
  res.clearCookie('token')
  res.status(200).json({ message: 'SignOut Completed'})
}
// express-jwt mar authenticated pyit ma pyit sit mal
// token shi ma shi ko so lo tar
// token ko create kae tar ka 'secret' ko tone kae tar
// secret ko tone pe pyan 'check' kyi mal
exports.requiredSignIn = expressJwt({
  secret: process.env.SECRET,
  userProperty: 'auth',
  algorithms: ['HS256']
})

exports.isAuth = (req, res, next) => {
  let userIsAuthed = req.profile && req.auth && req.profile._id == req.auth._id
  if (!userIsAuthed) return res.status(400).json({ error: 'please sign in first'})

  next();
}

exports.isAdmin = (req, res, next) => {
  if (req.profile.role !== 1 ) return res.status(400).json({ error: 'please sign in as an Admin'})
  next()
}