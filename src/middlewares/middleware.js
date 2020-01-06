const jwt = require('jsonwebtoken');
const config = require('../config/common');

/**
 * Redirect to login page if user not logged in (req.user not set)
 * Do nothing if logged in
 */
const redirectLogin = (req, res, next) => {
  if (
    !req.user &&
    !['/login', '/register', '/api/login', '/api/register'].includes(req.path)
  ) {
    res.redirect('/login');
    next();
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

/**
 * Check for user permission
 */
const isAdmin = (req, res, next) => {
  if (req.user.role === 'a') {
    return next();
  } else {
    res.redirect('/login');
    next();
  }
};

module.exports = {
  decodeJWT,
  redirectLogin,
  isAdmin,
};
