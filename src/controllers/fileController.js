const fileModel = require('../models/fileModel').file;
const userModel = require('../models/userModel').user;
const crypto = require('crypto');
const salt = require('../config/common').salt_pbkdf2;

async function uploadFile(userID, fileB64, fileName) {
  // Get user who uploads file
  let user = await userModel
    .findById(userID)
    .lean()
    .exec();

  let payload = {
    owner: user,
    fileName: fileName,
    content: fileB64,
  };

  let newFile = new fileModel(payload);
  let fileID;
  await newFile.save().then(file => (fileID = file._id));
  if (!fileID) {
    return new Error('File upload failed!');
  }
  let result = await userModel
    .findByIdAndUpdate(userID, {
      $push: { uploadedFiles: { _id: fileID, fileName: fileName } },
    })
    .exec();
  return result !== {};
}

async function getFile(userID, fileID) {
  let file = await fileModel.findById(fileID).exec();

  if (!file) {
    return new Error('No such file..');
  }
  if (file.owner != userID) {
    return new Error('Not the owner..');
  }
  return file;
}

async function listFiles(userID) {
  return await fileModel.find({ owner: userID });
}

async function searchFiles(userID, query) {
  query = query && query.toString().toLowerCase();

  const files = await fileModel.find(
    { owner: userID, fileName: { $regex: query, $options: '$i' } },
    { content: 0 }
  );

  return files.length
    ? files
    : new Error(
        `Could not find any entries for 'db.files.find({owner: ${userID}, fileName: {$regex: ${query}, $options: "$i"}}, {content: 0})'`
      );
}

/* ### SHARING ### */

/** Get file from sharing link */
async function getFromLink(hash) {
  return await fileModel.findOne({ publicLink: hash });
}

/** Create hash used for file sharing, return file */
async function createLink(userId, fileId) {
  const hash = crypto.pbkdf2Sync(fileId, salt, 100000, 64, 'sha512');
  let file = await fileModel.findById(fileId);

  file.isPublic = true;
  file.publicLink = hash.toString('base64').replace(/[^a-zA-Z0-9]/g, '');

  await file.save();
  file.content = undefined;

  return file.publicLink;
}

module.exports = {
  uploadFile,
  getFile,
  listFiles,
  searchFiles,

  getFromLink,
  createLink,
};
