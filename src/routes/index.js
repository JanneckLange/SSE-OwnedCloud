var express = require('express');
var router = express.Router();

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

router.get('/files', function(req, res, next) {
  res.render('user-files', {
    user: {
      name: 'Testuser',
    },
    files: [
      {
        id: '',
        fileName: 'test-file.pdf',
      },
      {
        id: '',
        fileName: 'desktop.txt',
      }
    ]
  });
});

module.exports = router;
