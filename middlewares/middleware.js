/**
 * Redirect to login page if user not logged in (req.user not set)
 * Do nothing if logged in
 */
const redirectLogin = (req, res, next) => {
  !req.user ? res.redirect('/login') : next();
};

module.exports = {
  redirectLogin: redirectLogin,
};
