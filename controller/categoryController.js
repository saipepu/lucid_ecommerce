const Category = require('../models/category')

exports.categoryById = (req, res, next, id) => {
  console.log(id);
  Category.findById(id).exec((err, category) => {
    if (err || !category) return res.status(400).json({ error: err })

    req.category = category;
    console.log(res.category)
    next();
  })
}

exports.lists = (req, res) => {

  Category.find().exec((err, lists) => {
    if (err || !lists) return res.status(400).json({ getAllCategory: false, error: `${err} or no category lists`})

    res.status(200).json({ getAllCategory: true, lists: lists})
  })
}

exports.create = (req, res) => {
  console.log(req.body, 'create category');
  const category = new Category(req.body)
  category.save((err, category) => {
    if (err) return res.status(400).json({ createCategorySuccess: false, error: err })

    res.status(200).json({createCategorySuccess: true, message: category})
  })
}

exports.update = (req, res) => {
  console.log(req.body, 'update')
  Category.findOneAndUpdate({ _id: req.category._id}, {name: req.body.name},{new: true}).exec((err, category) => {
    if( err || !category) return res.status(400).json({ updateCategorySuccess: false, error: err})

    res.status(200).json({ updateCategorySuccess: true, message: category})
  })
}

exports.remove = (req, res) => {
  console.log(req.category)
  Category.findOneAndDelete({ _id: req.category._id}).exec((err, category) => {
    if( err ) return res.status(400).json({ deleteCategorySuccess: false, error: err})

    res.status(200).json({ updateCategorySuccess: true, message: 'deleting completed'})
  })
}