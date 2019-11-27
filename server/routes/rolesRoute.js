const express = require('express')
const request = require('request')
const router = express.Router()

router.get('/', function(req, res) {
  const options = {
    method: 'GET',
    url: `https://${process.env.AUTH0_DOMAIN}/api/v2/roles`,
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${process.env.AUTH0_MGMT_TOKEN}`,
      'cache-control': 'no-cache'
    },
    // body: { name: 'ROLE_NAME', description: 'ROLE_DESC' },
    json: true
  }

  request(options, function(error, response, body) {
    if (error) throw new Error(error)

    res.send({ users: body })
  })
})

module.exports = router
