const express = require('express')
const router = express.Router()
const {
  getProducts,
  getProductById,
  deleteProduct,
  updateProduct,
  createProduct,
  createReview,
  getTopProducts
} = require('../controllers/productController.js')
const {protect, admin} = require('../middleware/authMiddleware.js')

router.route('/')
  .get(getProducts)
  .post(protect, admin, createProduct)

router.get('/top', getTopProducts)

router.route('/:id')
  .get(getProductById)
  .delete(protect, admin, deleteProduct)
  .put(protect, admin, updateProduct)

router.route('/:id/reviews').post(protect, createReview)



module.exports = router
