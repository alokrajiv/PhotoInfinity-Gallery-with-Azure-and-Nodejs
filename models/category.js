var mongoose = require('./index.js').mongoose;

module.exports = mongoose.model('CategoryModel', new mongoose.Schema({
    categoryName: {
        type: String,
        index: {
            unique: true
        }
    },
    subCategory: [{
        subCategoryName: {
            type: String
        }
    }]
},
    {
        collection: 'CategoryCollection'
    }
    ));