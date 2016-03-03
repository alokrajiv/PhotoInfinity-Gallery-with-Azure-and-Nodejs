var mongoose = require('./index.js').mongoose,
    bcrypt = require('bcrypt'),
    SALT_WORK_FACTOR = 10
var UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        index: {
            unique: true
        }
    },
    password: { type: String, required: true },
    userRole: { type: String, required: true }
},
    {
        collection: 'UserCollection'
    }
    );

UserSchema.pre('save', function (next) {
    var user = this;
	   
    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) return next(err);
	       console.log(salt); 
        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function (err, hash) {
            console.log(err);
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

//var autoIncrement = require('mongoose-auto-increment');
//autoIncrement.initialize(mongoose.connection);
//UserSchema.plugin(autoIncrement.plugin, { model: 'UserModel', field: 'userNo' });
var UserModel = mongoose.model('UserModel', UserSchema);

module.exports = UserModel;