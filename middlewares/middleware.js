const redirectLogin = (req, res, next) => {
  !req.user ? res.redirect('/login') : next();
};

module.exports = {
  redirectLogin: redirectLogin,
};
