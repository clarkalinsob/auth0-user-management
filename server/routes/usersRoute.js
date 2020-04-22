const express = require('express')
const request = require('request')
const router = express.Router()

const checkJwt = require('../auth/checkJwt')
const AUDIENCE = `https://${process.env.AUTH0_DOMAIN}/api/v2/`
const NAMESPACE = 'https://um.egbertapps.com'
const CONNECTION = 'Email-Password-Authentication'
const error401 = {
  error: {
    name: 'UnauthorizedError',
    status: 401,
    message: 'You are unauthorized to access this resource'
  }
}

router.use(checkJwt(AUDIENCE))

router.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(err.status).send(err.message)
    return
  }
  next()
})

router.use('/', (req, res, next) => {
  const options = {
    method: 'POST',
    url: `https://${process.env.AUTH0_DOMAIN}/oauth/token`,
    headers: { 'content-type': 'application/json' },
    form: {
      client_id: process.env.AUTH0_M2M_CLIENT_ID,
      client_secret: process.env.AUTH0_M2M_CLIENT_SECRET,
      audience: AUDIENCE,
      grant_type: 'client_credentials'
    }
  }

  request(options, function (error, response, body) {
    if (error) throw new Error(error)

    const parsedToken = JSON.parse(body)
    req.user.access_token = parsedToken.access_token
    next()
  })
})

// GET USERS
router.get('/', (req, res) => {
  const allowedRoles = req.user[`${NAMESPACE}/roles`].filter(role => role === 'admin')

  if (allowedRoles.length > 0) {
    const options = {
      method: 'GET',
      url: `https://${process.env.AUTH0_DOMAIN}/api/v2/users`,
      headers: { authorization: `Bearer ${req.user.access_token}` },
      json: true
    }

    request(options, function (error, response, body) {
      if (error) throw new Error(error)

      res.send({ users: body })
    })
  } else res.send(error401)
})

// CREATE USER
router.post('/', (req, res) => {
  const allowedRoles = req.user[`${NAMESPACE}/roles`].filter(role => role === 'admin')

  if (allowedRoles.length > 0) {
    const options = {
      method: 'POST',
      url: `https://${process.env.AUTH0_DOMAIN}/api/v2/users`,
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${req.user.access_token}`,
        'cache-control': 'no-cache'
      },
      body: {
        connection: CONNECTION,
        name: `${req.body.given_name} ${req.body.family_name}`,
        given_name: req.body.given_name,
        family_name: req.body.family_name,
        email: req.body.email,
        password: req.body.password,
        user_metadata: {}
      },
      json: true
    }

    request(options, function (error, response, body) {
      if (error) throw new Error(error)
      if (body.error) res.send({ error: body.message })
      else res.send({ user: body })
    })
  } else res.send(error401)
})

// GET A USER
router.get('/:userId', (req, res) => {
  const allowedRoles = req.user[`${NAMESPACE}/roles`].filter(role => role === 'admin')

  if (allowedRoles.length > 0) {
    const options = {
      method: 'GET',
      url: `https://${process.env.AUTH0_DOMAIN}/api/v2/users/${req.params.userId}`,
      headers: { authorization: `Bearer ${req.user.access_token}` },
      json: true
    }

    request(options, function (error, response, body) {
      if (error) throw new Error(error)
      if (body.error) res.send({ error: body.error.message })
      else res.send({ user: body })
    })
  } else res.send(error401)
})

// DELETE A USER
router.post('/:userId/delete', (req, res) => {
  const allowedRoles = req.user[`${NAMESPACE}/roles`].filter(role => role === 'admin')

  if (allowedRoles.length > 0) {
    const options = {
      method: 'DELETE',
      url: `https://${process.env.AUTH0_DOMAIN}/api/v2/users/${req.body.user_id}`,
      headers: { authorization: `Bearer ${req.user.access_token}` }
    }

    request(options, function (error, response, body) {
      if (error) throw new Error(error)
      else res.status(200).send()
    })
  } else res.send(errorObj)
})

// GET A USER ROLES
router.get('/:userId/roles', (req, res) => {
  const allowedRoles = req.user[`${NAMESPACE}/roles`].filter(role => role === 'admin')

  if (allowedRoles.length > 0) {
    const options = {
      method: 'GET',
      url: `https://${process.env.AUTH0_DOMAIN}/api/v2/users/${req.params.userId}/roles`,
      headers: { authorization: `Bearer ${req.user.access_token}` },
      json: true
    }

    request(options, function (error, response, body) {
      if (error) throw new Error(error)
      if (body.error) res.send({ error: body.error.message })
      else res.send({ roles: body })
    })
  } else res.send(error401)
})

// ASSIGN ROLES TO USER
router.post('/:userId/roles', (req, res) => {
  const allowedRoles = req.user[`${NAMESPACE}/roles`].filter(role => role === 'admin')

  if (allowedRoles.length > 0) {
    const options = {
      method: 'POST',
      url: `https://${process.env.AUTH0_DOMAIN}/api/v2/users/${req.params.userId}/roles`,
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${req.user.access_token}`,
        'cache-control': 'no-cache'
      },
      body: { roles: req.body },
      json: true
    }

    request(options, function (error, response, body) {
      if (error) throw new Error(error)
      else res.status(200).send()
    })
  } else res.send(error401)
})

// DELETE A USER'S ROLE
router.post('/:userId/roles/delete', (req, res) => {
  const allowedRoles = req.user[`${NAMESPACE}/roles`].filter(role => role === 'admin')

  if (allowedRoles.length > 0) {
    const options = {
      method: 'DELETE',
      url: `https://${process.env.AUTH0_DOMAIN}/api/v2/users/${req.params.userId}/roles`,
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${req.user.access_token}`,
        'cache-control': 'no-cache'
      },
      body: { roles: [req.body.id] },
      json: true
    }

    request(options, function (error, response, body) {
      if (error) throw new Error(error)
      else res.status(200).send()
    })
  } else res.send(error401)
})

// SEARCH USERS
router.post('/search/email', (req, res) => {
  const allowedRoles = req.user[`${NAMESPACE}/roles`].filter(role => role === 'admin')

  if (allowedRoles.length > 0) {
    const options = {
      method: 'GET',
      url: `https://${process.env.AUTH0_DOMAIN}/api/v2/users`,
      headers: { authorization: `Bearer ${req.user.access_token}` },
      qs: { q: `email:*${req.body.email}*`, search_engine: 'v3' },
      json: true
    }

    request(options, function (error, response, body) {
      if (error) throw new Error(error)
      if (body.error) res.send({ users: [] })
      else res.send({ users: body })
    })
  } else res.send(error401)
})

module.exports = router
