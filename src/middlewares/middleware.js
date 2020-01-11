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
 * verify token from cookie and add payload to req.user if successful
 */
function decodeJWT(req, res, next) {
  let token = req.cookies[config.COOKIE_ID];

  if (token) {
    jwt.verify(token, config.salt_jwt, (err, payload) => {
      if (err) {
        res.status(403).json(err);
      } else {
        req.user = payload;
        next();
      }
    });
  } else {
    next();
  }
}

/**
 * Check for user permission
 */
const isAdmin = (req, res, next) => {
  if (req.user.userRole === 'a') {
    return next();
  } else {
    res.redirect('/login');
  }
};

module.exports = {
  decodeJWT,
  redirectLogin,
  isAdmin,
};
