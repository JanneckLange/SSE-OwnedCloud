var express = require('express');
var router = express.Router();
var authController = require('../controllers/authController');

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
    res.status(200).cookie('mlp_fanshop', jwt).redirect('/files').send();
  } catch (e) {
    res.status(400).send(e.message);
  }
});

module.exports = router;
