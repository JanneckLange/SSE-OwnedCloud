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
  const user = await userModel
    .findById(userID)
    .lean()
    .exec();
  return user && user.uploadedFiles;
}

async function searchFiles(userID, query) {
  query = query && query.toString().toLowerCase();

  return (await listFiles(userID)).filter(file =>
    file.fileName.toLowerCase().includes(query.toLowerCase())
  );
}

/* ### SHARING ### */

/** Get file from sharing link */
async function getFromLink(hash) {
  try {
    hash = JSON.parse(hash);
    console.log("parsed: " + JSON.stringify(hash))
  } catch {}
  let payload = [];
  let docs = await fileModel.find({ publicLink: hash });
  for(let i in docs) {
    let element = docs[i];

    let entry = {
      fileName: element.fileName,
      publicLink: element.publicLink,
      content: element.content
    };
    payload.push(entry);
  }
  return payload;
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
