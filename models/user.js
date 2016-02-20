var mongoose = require('mongoose'),
    exports = module.exports = {};
mongoose.connect('mongodb://localhost/artifacts_db');

exports.UserModel = mongoose.model('userModel', new mongoose.Schema({
    userId: {
        type: Number,
        index: {
            unique: true
        }
    },
    userPassword: {
        type: String,
        index: {
            unique: true
        }
    }
},
    {
        collection: 'usersCollection'
    }
    ));