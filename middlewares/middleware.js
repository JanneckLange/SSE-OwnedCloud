const debug = require('debug')('OwnedCloud:middleware');
const jwt = require('jsonwebtoken');
const secret = require('../config/jwt.secret').secret;

/**
 * Redirect to login page if user not logged in (req.user not set)
 * Do nothing if logged in
 */
const redirectLogin = (req, res, next) => {
  debug(`req.user: ${!!req.user}`);
  !req.user ? res.redirect('/login') : next();
};

/**
 * Try to get token from body | query | headers
 * Verify token with secret
 * Add payload to req.user if valid token
 * throw error if invalid or missing token
 */
const verifyToken = (req, res, next) => {
  const token = req.body.token || req.query.token || req.headers['authorization'];

  if (!token) {
    let error = {
      message: "no token",
      status: 401
    }
    debug(error);
    next(err);
  } else {
    jwt.verify(token, secret, (err, payload) => {
      if (err) {
        debug(err);
        debug(token);
        next(err);
      } else {
        req.user = payload;
        next();
      }
    })
  }
};

module.exports = {
  redirectLogin: redirectLogin,
  verifyToken: verifyToken
};
