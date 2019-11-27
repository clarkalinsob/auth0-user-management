const express = require('express')
const request = require('request')
const router = express.Router()

router.get('/', function(req, res) {
  const options = {
    method: 'GET',
    url: `https://${process.env.AUTH0_DOMAIN}/api/v2/users`,
    headers: { authorization: `Bearer ${process.env.AUTH0_MGMT_TOKEN}` },
    json: true
  }

  request(options, function(error, response, body) {
    if (error) throw new Error(error)

    res.send({ users: body })
  })
})

router.post('/search/email', function(req, res) {
  let arr = []
  const options = {
    method: 'GET',
    url: `https://${process.env.AUTH0_DOMAIN}/api/v2/users`,
    headers: { authorization: `Bearer ${process.env.AUTH0_MGMT_TOKEN}` },
    qs: { q: `email:*${req.body.email}*`, search_engine: 'v3' },
    json: true
  }

  request(options, function(error, response, body) {
    if (error) throw new Error(error)
    if (body.error) {
      res.send({ users: [] })
    } else {
      res.send({ users: body })
    }
  })
})
module.exports = router
