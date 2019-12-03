const express = require('express')
const dotenv = require('dotenv')
const bodyParser = require('body-parser')
dotenv.config()

// Import helper functions
const checkJwt = require('./auth/checkJwt')

// Import routes
const usersRoute = require('./routes/usersRoute')
const rolesRoute = require('./routes/rolesRoute')

// Create a new Express app
const app = express()

app.use(bodyParser.json())

// Public routes
app.get('/api/external', (req, res) => {
  res.send({
    msg: 'Your Access Token was successfully validated!'
  })
})

// Check for authorization token for private and protected routes

app.use(checkJwt(process.env.AUTH0_AUDIENCE))
app.use(function(err, req, res, next) {
  console.log('jwt error', err)
  if (err.name === 'UnauthorizedError') {
    res.status(err.status).send({ message: err.message })
    return
  }
  next()
})

// Protected routes
app.use('/api/v1/users', usersRoute)
app.use('/api/v1/roles', rolesRoute)

// Start the app
app.listen(process.env.PORT, () => console.log(`API listening on ${process.env.PORT}`))
