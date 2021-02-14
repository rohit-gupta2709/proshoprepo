const asyncHandler = require('express-async-handler')
const Product = require('../models/productModel.js')

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({})

  res.json(products)
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

module.exports = { getProducts, getProductById, deleteProduct,createProduct, updateProduct }
