const path = require('path')
const express = require('express')
const dotenv = require('dotenv')
const colors = require('colors')
const { notFound, errorHandler } = require('./middleware/errorMiddleware.js')
const connectDB = require('./config/db.js')
const morgan = require('morgan')
const productRoutes = require('./routes/productRoutes.js')
const userRoutes = require('./routes/userRoutes.js')
const orderRoutes = require('./routes/orderRoutes.js')
const uploadRoutes = require('./routes/uploadRoutes.js')


dotenv.config()

connectDB()

const app = express()

app.use(
  express.urlencoded({
    extended: true
  })
)

app.use(express.json())

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

app.use('/api/products', productRoutes)
app.use('/api/users', userRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/upload', uploadRoutes)

app.get('/api/config/paypal', (req, res) => {
    res.send(process.env.PAYPAL_CLIENT_ID);
})

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')))
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
  })
}

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
)
