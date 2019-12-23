const jwt = require('jsonwebtoken');
const config = require('../config/common');

/**
 * Redirect to login page if user not logged in (req.user not set)
 * Do nothing if logged in
 */
const redirectLogin = (req, res, next) => {
  if (!req.user && req.path !== '/login') {
    res.redirect('/login');
  } else {
    next();
  }
};

/**
 * Add req.user if jwt cookie found
 */
const decodeJWT = (req, res, next) => {
  const data = jwt.decode(req.cookies[config.COOKIE_ID], config.SALT);

  if (data) req.user = data;

  next();
};

module.exports = {
  decodeJWT: decodeJWT,
  redirectLogin: redirectLogin,
};
