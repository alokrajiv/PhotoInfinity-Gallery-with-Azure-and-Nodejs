var mongoose = require('./index.js').mongoose;

module.exports = mongoose.model('userModel', new mongoose.Schema({
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