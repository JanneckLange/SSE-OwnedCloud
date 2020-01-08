var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var fileController = require('../controllers/fileController');
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
  let jwt_data = jwt.decode(req.cookies['mlp_fanshop'], 'SALT');

  let query = req.query.query;
  let files;
  let error;

  if (!query) {
    files = await fileController.listFiles(jwt_data.userId);
  } else {
    files = await fileController.searchFiles(jwt_data.userId, query);
  }
  if (files && files instanceof Error) {
    error = files;
  }
  res.render('user-files', {
    user: {
      name: jwt_data.userName,
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
    res.render('share', { shareId: req.params.id, file });
  }
  return next();
});

router.route('/admin').get(isAdmin, (req, res, next) => {
  res.render('admin', {});
});

module.exports = router;
