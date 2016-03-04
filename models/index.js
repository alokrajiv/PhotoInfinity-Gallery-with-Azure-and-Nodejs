var mongoose = require('mongoose'),
    exports = module.exports = {};
if (process.env.NODE_ENV == 'TEST') {
    mongoose.connect(process.env.TEST_DB_URI);
}
else {
    mongoose.connect('mongodb://artifact-dev-app:q1w2e3r4t5@ds058548.mongolab.com:58548/artifacts-dev-db');
}
exports.mongoose = mongoose;
