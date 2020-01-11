var express = require('express');
var router = express.Router();
var fileController = require('../controllers/fileController');
var userController = require('../controllers/userController');
var isAdmin = require('../middlewares/middleware').isAdmin;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {});
});

router.get('/login', function(req, res, next) {
  res.render('login', {});
});

router.get('/register', function(req, res, next) {
  res.render('register', {});
});

router.get('/files', async function(req, res, next) {
  const user = req.user;

  let query = req.query.query;
  let files;
  let error;

  if (!query) {
    files = await fileController.listFiles(user.userId);
  } else {
    files = await fileController.searchFiles(user.userId, query);
  }
  if (files && files instanceof Error) {
    error = files;
  }
  res.render('user-files', {
    user: {
      name: user.userName,
    },
    files,
    error,
  });
});

router.get('/share/:id', async (req, res, next) => {
  const file = await fileController.getFromLink(req.params.id);

  if (file && file instanceof Error) {
    return next(file);
  } else if (file) {
    res.render('share', { file })
  }
  return next();
});

router.route('/admin').get(isAdmin, async (req, res, next) => {
  const users = await userController.list();
  console.log(users);
  res.render('admin', { users });
});

module.exports = router;
