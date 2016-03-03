var mongoose = require('./index.js').mongoose;

module.exports.CommentModel = mongoose.model('commentModel', new mongoose.Schema({
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
        collection: 'CommentCollection'
    }
    ));