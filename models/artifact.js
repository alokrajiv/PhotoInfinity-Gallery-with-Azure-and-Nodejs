var mongoose = require('./index.js').mongoose;

module.exports.ArtifactModel = mongoose.model('postModel', new mongoose.Schema({
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
        collection: 'artifactCollection'
    }
    ));