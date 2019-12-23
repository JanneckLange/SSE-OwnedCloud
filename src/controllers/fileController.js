const fileModel = require('../models/fileModel').file;
const userModel = require('../models/userModel').user;

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
  return user.uploadedFiles;
}

module.exports = {
  uploadFile,
  getFile,
  listFiles,
};
