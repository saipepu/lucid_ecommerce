const mongoose = require('mongoose');
const crypto = require('crypto')
const uuid = require('uuid').v4;
const Salt = uuid();

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 50
  },
  email: {
    type: String,
    require: true,
    maxlength: 50,
    unique: true
  },
  hashed_password: {
    type: String,
    require: true,
    minlength: 5
  },
  role: {
    type: Number,
    default: 0
  },
  salt: {type: String},
  history: {
    type: String,
    details: Array,
    default: ''
  }
},
  {timestamps: true}
)

UserSchema.virtual('password')
.set(function(password) {
  this._password = password;
  this.salt = Salt
  this.hashed_password = this.encryptPassword(this._password)
})
.get(function() {
  return this._password
})

UserSchema.methods = {
  encryptPassword: function (plainText) {
    if (!plainText) return ''
    try {
      return crypto.createHmac('sha1', this.salt).update(plainText).digest('hex')
    } catch {
      console.log('connot hash')
      return ''
    }
  },
  authentication: function(plainText) {
    console.log(plainText,'59')
    return this.hashed_password == this.encryptPassword(plainText)
  }
}

module.exports = mongoose.model('User', UserSchema)