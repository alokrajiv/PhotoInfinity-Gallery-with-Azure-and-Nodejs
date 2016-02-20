var mongoose = require('./index.js').mongoose;

module.exports.CommentModel = mongoose.model('commentModel', new mongoose.Schema({
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