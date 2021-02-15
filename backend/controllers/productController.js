const asyncHandler = require('express-async-handler')
const Product = require('../models/productModel.js')

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {

  const pageSize = 2

  const page = Number(req.query.pageNumber) || 1
  

  const keyword = req.query.keyword ? {
    name: {
      $regex: req.query.keyword,
      $options: 'i'
    }
  } : {}

  const count = await Product.countDocuments({...keyword})

  const products = await Product.find({...keyword }).limit(pageSize).skip(pageSize*(page-1))

  res.json({ products, page, pages: Math.ceil(count / pageSize) })
})

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)

  if (product) {
    res.json(product)
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)

  if (product) {
    await product.remove()
    res.json({message: 'Product removed'})
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})

const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: 'Product name',
    price: 0,
    user: req.user._id,
    image: '/images/sample.jpg',
    brand: 'Product brand',
    countInStock: 0,
    numReviews: 0,
    category: 'Product Category',
    description: 'Product description'
  })

  const createdProduct = await product.save()
  res.status(201)
.json(createdProduct)
})

const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, image, brand, countInStock, category, description } = req.body
  
  const product = await Product.findById(req.params.id)

  if (product) {
    product.name = name
    product.price = price
    product.description = description
    product.image = image
    product.brand = brand
    product.countInStock = countInStock
    product.category = category

  } else {
    res.status(404)
    throw new Error('Product not found')
  }
  const updatedProduct = await product.save()
  res.json(updatedProduct)
})

const createReview = asyncHandler(async (req, res) => {
  const {
    rating,
    comment
  } = req.body
  
  const product = await Product.findById(req.params.id)

  if (product) {
    const alreadyReview = product.reviews.find(r => r.user._id === req.user._id )

    if (alreadyReview) {
      res.status(400)
      throw new Error('Product already reviewed')
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id
    }

    product.reviews.push(review)
    product.numReviews = product.reviews.length
    product.rating = product.reviews.reduce ((acc, item) => item.rating+acc, 0)/product.reviews.length

    await product.save()
    res.status(200).json({ message: 'Review added' })
    
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
  const updatedProduct = await product.save()
  res.json(updatedProduct)
})

const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(5)
  res.json(products)
})

module.exports = { getTopProducts, createReview, getProducts, getProductById, deleteProduct,createProduct, updateProduct }
