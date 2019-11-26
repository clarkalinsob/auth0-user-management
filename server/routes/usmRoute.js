const express = require('express')
const axios = require('axios')
const router = express.Router()

router.get('/users/v1', async function(req, res) {
  const { data } = await axios.get('https://clarkalinsob101.auth0.com/api/v2/users', {
    qs: { q: 'email:"clarkalinsob101@gmail.com"', search_engine: 'v3' },
    headers: {
      Authorization: `Bearer ${process.env.AUTH0_MGMT_TOKEN}`
    }
  })

  res.send({ users: data })
})

module.exports = router
