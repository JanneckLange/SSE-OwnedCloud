let mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const user = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "u"
    },
    uploadedFiles:
        [
            {
                _id: {
                    type: ObjectID,
                    ref: 'file',
                    required: true
                },
                fileName: {
                    type: String,
                    required: true
                }
            }
        ]
},
    {
    timestamps: true
    },
    {
    writeConcern: {
        w: 1,
            j: true,
            wtimeout: 1000
    }
});

module.exports = {
  user: mongoose.model('user', user)
};