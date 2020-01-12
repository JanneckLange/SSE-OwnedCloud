const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const fileController = require('../controllers/fileController');
const userController = require('../controllers/userController');
const isAdmin = require('../middlewares/middleware').isAdmin;
const COOKIE_ID = require('../config/common').COOKIE_ID;
const config = require('../config/common');

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
    let expireDate = new Date(Date.now() + config.TOKEN_EXPIRY_SECONDS * 1000);
    res
      .status(200)
      .cookie(COOKIE_ID, jwt, { expires: expireDate})
      .redirect('/files');
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.post('/upload', async function(req, res, next) {
  if (!req.files || !req.files.file) {
    return res.redirect('/files')
  }
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
    if (file[0]) {
      res.set('Content-disposition', 'attachment; filename=' + file[0].fileName);
      res.type(file[0].fileName);
      return res.send(Buffer.from(file[0].content, 'base64'));
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

router.route('/admin/users').get(isAdmin, async (req, res, next) => {
  res.json(await userController.list())
})

module.exports = router;
