var express = require('express');
var router = express.Router();
var authController = require('../controllers/authController');
var fileController = require('../controllers/fileController');
var jwt = require('jsonwebtoken');

const COOKIE_ID = 'mlp_fanshop';

// TODO Remember to sanitize inputs!
router.post('/register', async function(req, res, next) {
  let data = req.body;
  console.log(data);

  try {
    await authController.registerUser(data.email, data.password, data.name);
    res.status(200).send('Sucessfully registered.');
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.post('/login', async function(req, res, next) {
  let data = req.body;

  try {
    let jwt = await authController.loginUser(data.email, data.password);
    res.status(200).cookie(COOKIE_ID, jwt).redirect('/files').send();
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.post('/upload', async function(req, res, next) {
  const jwt_data = jwt.decode(req.cookies[COOKIE_ID], 'SALT');
  const userId = jwt_data.userId;
  const fileB64 = req.files.file.data.toString('base64');
  const fileName = req.files.file.name;

  let result = await fileController.uploadFile(userId, fileB64, fileName);

  if (result) {
    res.status(200).redirect('/files').send();
  } else {
    res.status(400).send(e.message);
  }
});

module.exports = router;
