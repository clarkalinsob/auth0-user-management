const express = require('express')
const dotenv = require('dotenv')
const bodyParser = require('body-parser')
const cors = require('cors')
dotenv.config()

const usersRoute = require('./routes/usersRoute')
const rolesRoute = require('./routes/rolesRoute')

const app = express()

app.use(cors())
app.use(bodyParser.json())

// Test Route
app.get('/api/external', (req, res) => {
  res.send({
    msg: 'Your Access Token was successfully validated!'
  })
})

// Routes
app.use('/api/v1/users', usersRoute)
app.use('/api/v1/roles', rolesRoute)

const port = process.env.PORT || 5001
// Start the app
app.listen(port, () => console.log(`API listening on ${port}`))
