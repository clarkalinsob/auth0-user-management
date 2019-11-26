const jwt = require('express-jwt')
const jwksRsa = require('jwks-rsa')

const checkJwt = audience => {
  // Define middleware that validates incoming bearer tokens
  const validateToken = jwt({
    secret: jwksRsa.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
    }),
    audience,
    issuer: `https://${process.env.AUTH0_DOMAIN}/`,
    algorithm: ['RS256']
  })

  return validateToken
}

module.exports = checkJwt
