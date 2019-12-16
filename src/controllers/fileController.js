const fileModel = require('../models/fileModel').file;
const userModel = require('../models/userModel').user;

async function uploadFile(userID, fileB64, fileName) {
    // Get user who uploads file
    let user = await userModel.findById(userID).lean().exec();

    let payload = {
        owner: user,
        fileName: fileName,
        content: fileB64
    };

    let newFile = new fileModel(payload);
    let fileID;
    await newFile.save().then(file => fileID = file._id);
    if(!fileID) {
        return new Error("File upload failed!")
    }
    await userModel.findByIdAndUpdate(
        userID,
        {
            $push: {uploadedFiles: {_id: fileID, fileName: fileName}}
        }
    ).exec();
}

async function getFile(userID, fileID) {
    let searchCriteria = {_id: fileID};
    let file = fileModel.findOne(searchCriteria).exec();
    if(!file) {
        return new Error("No such file..");
    }
    if(file.owner !== userID) {
        return new Error("Not the owner..");
    }
    return file.content;
}

async function getFileIDs(userID) {
    let user = await userModel.findOne({_id: userID}).lean().exec();
    return user.uploadedFiles;
}

module.exports = {
    uploadFile,
    getFile,
    getFileIDs
};
