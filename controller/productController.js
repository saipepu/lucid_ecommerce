const Product = require('../models/product')
const formidable = require('formidable')
const _ = require('lodash')
const fs = require('fs')

exports.productById = (req, res, next, id) => {
  console.log(id);
  Product.findById(id).exec((err, product) => {
    if(err || !product ) return res.status(400).json({ error: err, error1: 'no product with this id'})

    req.product = product
    next()
  })
}

exports.lists = (req, res) => {
  let name = req.query.name ? req.query.name : {}
  console.log(name);
  let filter = Object.keys(name).length === 0 ? {} : { name: new RegExp(name, 'i')}
  console.log(filter);
  Product.find(filter)
  .select('-photo')
  .populate('category')
  .exec((err, product)=> {
    if(err) return res.status(400).json({ error: err })

    res.status(200).json({ message: product})
  })
}

exports.create = (req, res) => {
  console.log(req.body);
  let form = new formidable.IncomingForm();
  form.keepExtensions = true
  
  form.parse(req, (err, fields, files) => {
    if(err) return res.status(400).json({ error: err})

    const product = new Product(fields)

    if(files) {
      product.photo.data = fs.readFileSync(files.photo.filepath)
      product.photo.ContentType = files.photo.minetype
    }
    product.save((err, product) => {
      if(err) return res.status(400).json({ createProductSuccess: false, error: err})

      res.status(200).json({ createProductSuccess: true, message: product })
    })

  })
}

exports.update = (req, res) => {
  console.log(req.product);
  const form = new formidable.IncomingForm()
  form.keepExtensions = true

  form.parse(req, (err, fields, files) => {
    if(err) return res.status(400).json({updateProductSuccess: false, error: err })

    let product = req.product
    product = _.extend(product, fields)
    if(files.photo) {
      product.photo.data = fs.readFileSync(files.photo.filepath)
      product.photo.ContentType = files.photo.minetype
    }
    product.save((err, product) => {
      if(err) return res.status(400).json({updateProductSuccess: false, error: err })
      
      res.status(200).json({ updateProductSuccess: true, message: product})
    })
  })
}

exports.remove = (req, res) => {
  Product.findOneAndDelete({ _id: req.product._id}, (err, product) => {
    if(err) return res.status(400).json({ error: err })
    res.status(200).json({ message: 'deleting complete'})
  })
}

exports.photo = (req, res, next) => {
  if(req.product.photo.data) {
    res.set('Content-Type', req.product.photo.ContentType);

    res.send(req.product.photo.data);
  }
}

exports.related = (req, res) => {
  console.log(req.product);
  Product.find({ _id: {$ne: req.product._id} , category: req.product.category})
  .select('-photo')
  .populate('category', '_id name')
  .exec((err, products)=> {
    if (err || !products) return res.status(400).json({ error: err })

    res.status(200).json({ message: products})
  })
}

exports.filter = (req, res) => {
  let sortBy = req.body.sortBy ? req.body.sortBy : '_id'
  let orderBy = req.body.orderBy ? req.body.orderBy : 'des'
  let limit = req.body.limit ? req.body.limit : ''

  Product.find()
  .sortBy([sortBy, orderBy])
  .limit(limit)
  .exec((err, products) => {
    if(err || !products) return res.status(400).json({ error: err})

    res.status(200).json({ message: products })
  })
}