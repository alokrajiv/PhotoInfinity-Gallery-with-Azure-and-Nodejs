var mongoose = require('mongoose'),
    exports = module.exports = {};
mongoose.connect('mongodb://localhost/artifacts_db');

exports.CommentModel = mongoose.model('commentModel', new mongoose.Schema({
    commentNo: {
        type: Number,
        index: {
            unique: true
        }
    },
    commentText: {
        type: String,
        index: {
            unique: true
        }
    },
    author: {
        type: String,
        index: true
    }
},
    {
        collection: 'commentsCollection'
    }
    ));