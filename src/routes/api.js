var express = require('express');
var router = express.Router();
var authController = require('../controllers/authController');
var fileController = require('../controllers/fileController');
var jwt = require('jsonwebtoken');

const COOKIE_ID = require('../config/common').COOKIE_ID;

// TODO Remember to sanitize inputs!
router.post('/register', async function(req, res, next) {
  let data = req.body;

  try {
    await authController.registerUser(data.email, data.password, data.name);
    res.status(200).redirect('/login');
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.post('/login', async function(req, res, next) {
  let data = req.body;

  try {
    let jwt = await authController.loginUser(data.email, data.password);
    res
      .status(200)
      .cookie(COOKIE_ID, jwt)
      .redirect('/files');
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.post('/upload', async function(req, res, next) {
  const userId = req.user.userId;
  const fileB64 = req.files.file.data.toString('base64');
  const fileName = decodeURIComponent(req.files.file.name);

  let result = await fileController.uploadFile(userId, fileB64, fileName);

  if (result) {
    res.status(200).redirect('/files');
  } else {
    res.status(400).send(e.message);
  }
});

router.get('/download/:fileID', async (req, res, next) => {
  const userId = req.user.userId;
  const file = await fileController.getFile(userId, req.params.fileID);

  if (file && file instanceof Error) {
    return next(file);
  } else if (file) {
    res.set('Content-disposition', 'attachment; filename=' + file.fileName);
    res.type(file.fileName);
    return res.send(Buffer.from(file.content, 'base64'));
  }
  return next();
});

router
  .route('/share/:file')
  // Get file from sharing link
  .get(async (req, res, next) => {
    const file = await fileController.getFromLink(req.params.file);

    if (file) {
      res.set('Content-disposition', 'attachment; filename=' + file.fileName);
      res.type(file.fileName);
      return res.send(Buffer.from(file.content, 'base64'));
    }
    next();
  })
  // Create sharing link
  .post((req, res, next) => {
    fileController
      .createLink(req.user.userId, req.params.file)
      .then(link => res.status(201).json(link))
      .catch(e => next(e));
  });

module.exports = router;
