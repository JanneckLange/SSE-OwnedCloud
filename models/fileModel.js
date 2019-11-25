let mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let ObjectID = Schema.Types.ObjectId;

const file = new Schema({
    owner: {
        type: ObjectID,
        ref: 'user',
        required: true
    },
    content: {
        data: Buffer,
        contentType: String,
        required: true
    },
    isPublic: {
        type: Boolean,
        default: false
    },
    publicLink: {
        type: String
    }

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
    user: mongoose.model('file', file)
};