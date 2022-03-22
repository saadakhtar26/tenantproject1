const express = require('express')
const dotenv = require('dotenv').config()
const {errorHandler} = require('./middleware/errorMiddleware')
const connectDB = require('./config/db')
const port = process.env.PORT || 5000

connectDB()

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended:false }))

app.use('/tenant', require('./routes/tenantRoutes'))

app.use(errorHandler)

app.listen(port, ()=> console.log(`Server started at ${port}`))