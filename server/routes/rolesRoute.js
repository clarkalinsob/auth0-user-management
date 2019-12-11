const express = require('express')
const request = require('request')
const router = express.Router()

const checkJwt = require('../auth/checkJwt')
const AUDIENCE = `https://${process.env.AUTH0_DOMAIN}/api/v2/`
const NAMESPACE = 'https://api.vue-auth0.com'
const errorObj = {
  error: {
    name: 'UnauthorizedError',
    status: 401,
    message: 'You are unauthorized to access this resource'
  }
}

router.use(checkJwt(AUDIENCE))

router.use((err, _, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(err.status).send(err.message)
    return
  }
  next()
})

router.get('/', (req, res) => {
  const allowedRoles = req.user[`${NAMESPACE}/roles`].filter(role => role === 'admin')

  if (allowedRoles.length > 0) {
    const options = {
      method: 'GET',
      url: `https://${process.env.AUTH0_DOMAIN}/api/v2/roles`,
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${process.env.AUTH0_MGMT_TOKEN}`,
        'cache-control': 'no-cache'
      },
      json: true
    }

    request(options, (error, response, body) => {
      if (error) throw new Error(error)

      res.send({ roles: body })
    })
  } else res.send(errorObj)
})

router.post('/', (req, res) => {
  const allowedRoles = req.user[`${NAMESPACE}/roles`].filter(role => role === 'admin')

  if (allowedRoles.length > 0) {
    const options = {
      method: 'POST',
      url: `https://${process.env.AUTH0_DOMAIN}/api/v2/roles`,
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${process.env.AUTH0_MGMT_TOKEN}`,
        'cache-control': 'no-cache'
      },
      body: { name: req.body.name, description: req.body.description },
      json: true
    }

    request(options, (error, response, body) => {
      if (error) throw new Error(error)
      else if (response.body.error) {
        res.send({
          error: response.body.message
        })
      } else {
        res.send({ role: body })
      }
    })
  } else res.send(errorObj)
})

router.post('/:roleId/delete', (req, res) => {
  const allowedRoles = req.user[`${NAMESPACE}/roles`].filter(role => role === 'admin')

  if (allowedRoles.length > 0) {
    const options = {
      method: 'DELETE',
      url: `https://${process.env.AUTH0_DOMAIN}/api/v2/roles/${req.body.id}`,
      headers: { authorization: `Bearer ${process.env.AUTH0_MGMT_TOKEN}` }
    }

    request(options, function(error, response, body) {
      if (error) throw new Error(error)

      res.send('Successfully deleted')
    })
  } else res.send(errorObj)
})

router.post('/:roleId/edit', (req, res) => {
  const allowedRoles = req.user[`${NAMESPACE}/roles`].filter(role => role === 'admin')

  if (allowedRoles.length > 0) {
    const options = {
      method: 'PATCH',
      url: `https://${process.env.AUTH0_DOMAIN}/api/v2/roles/${req.body.id}`,
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${process.env.AUTH0_MGMT_TOKEN}`,
        'cache-control': 'no-cache'
      },
      body: { name: req.body.name, description: req.body.description },
      json: true
    }

    request(options, (error, response, body) => {
      if (error) throw new Error(error)
      if (body.error) res.send({ error: body.message })
      else res.send({ role: body })
    })
  } else res.send(errorObj)
})

module.exports = router
