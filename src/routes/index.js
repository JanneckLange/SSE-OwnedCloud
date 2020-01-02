var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var fileController = require('../controllers/fileController');

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
  let files = await fileController.listFiles(jwt_data.userId);

  res.render('user-files', {
    user: {
      name: jwt_data.userName,
    },
    files,
  });
});

module.exports = router;
