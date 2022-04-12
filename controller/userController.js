const User = require('../models/user')

exports.userById = (req, res, next, id) => {
  console.log(id)
  const user = new User(req.body);
  User.findById(id).exec((err, result) => {
    if (err || !result) return res.status(400).json({ error: 'no user with current id, please sign in first'})

    req.profile = result
    console.log(req.profile);
    next();
  })
}