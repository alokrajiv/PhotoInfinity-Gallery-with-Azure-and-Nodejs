var mongoose = require('mongoose'),
    exports = module.exports = {};
mongoose.connect('mongodb://localhost/artifacts_db');

exports.PostModel = mongoose.model('postModel', new mongoose.Schema({
    postNo: {
        type: Number,
        index: {
            unique: true
        }
    },
    postData: [{
        type: String
    }],
    author: {
        type: String,
        index: true
    }
},
    {
        collection: 'postsCollection'
    }
    ));