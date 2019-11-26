const express = require('express')
const dotenv = require('dotenv')
dotenv.config()

const usmRoute = require('./routes/usmRoute')
const checkJwt = require('./auth/checkJwt')

// Create a new Express app
const app = express()

// Public routes
app.get('/api/external', checkJwt(process.env.AUTH0_AUDIENCE), (req, res) => {
  res.send({
    msg: 'Your Access Token was successfully validated!'
  })
})

// Check for authorization token for private and protected routes
app.use(checkJwt(process.env.AUTH0_AUDIENCE))
app.use(function(err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(err.status).send({ message: err.message })
    return
  }
  next()
})

// Protected routes
app.use('/api/usm', usmRoute)

// Start the app
app.listen(process.env.PORT, () => console.log(`API listening on ${process.env.PORT}`))
