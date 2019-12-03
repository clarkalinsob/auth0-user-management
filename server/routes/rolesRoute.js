const express = require('express')
const request = require('request')
const router = express.Router()

router.get('/', (req, res) => {
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
})

router.post('/', (req, res) => {
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
})

router.post('/:roleId/delete', (req, res) => {
  const options = {
    method: 'DELETE',
    url: `https://${process.env.AUTH0_DOMAIN}/api/v2/roles/${req.body.id}`,
    headers: { authorization: `Bearer ${process.env.AUTH0_MGMT_TOKEN}` }
  }

  request(options, function(error, response, body) {
    if (error) throw new Error(error)

    res.send('Successfully deleted')
  })
})

router.post('/:roleId/edit', (req, res) => {
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
    else if (response.body.error) {
      res.send({
        error: response.body.message
      })
    } else {
      res.send({ role: body })
    }
  })
})

module.exports = router
