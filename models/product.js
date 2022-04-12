const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    maxlength: 50
  },
  price: {
    type: Number,
    require: true,
    maxlength: 10
  },
  description: {
    type: String,
    require: true
  },
  category: {
    type: ObjectId,
    ref: 'Category'
  },
  photo: {
    data: Buffer,
    ContentType: String
  },
  sold: {
    type: Number,
    default: 0
  },
  quantity: {
    type: Number,
    default: 0
  }
},
{ timestamps: true }
)

module.exports = mongoose.model('Product', ProductSchema);