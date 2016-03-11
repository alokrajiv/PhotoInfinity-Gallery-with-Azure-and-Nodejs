var mongoose = require('./index.js').mongoose

var ArtifactSchema = mongoose.Schema({
    name: {
        type: String,
        index: true
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        index: true
    },
    meta: {
        categoryId: {
            type: mongoose.Schema.Types.ObjectId,
            index: true
        },
        subCategoryId: {
            type: mongoose.Schema.Types.ObjectId,
            index: true
        },
        descr: String,
        logo: {blobName: String,
            name: String},
        tags: [String]
    },

    data: [{
        type: {
            type: String
        },
        location: {
            type: String
        },
        localStore: {
            type: String
        }
    }]
},
    {
        collection: 'ArtifactCollection'
    }
    );


/*

ArtifactSchema.pre('save', function(next) {
    next();
});

*/

//var autoIncrement = require('mongoose-auto-increment');
//autoIncrement.initialize(mongoose.connection);
//ArtifactSchema.plugin(autoIncrement.plugin, { model: 'ArtifactModel', field: 'artifactNo' });
var ArtifactModel = mongoose.model('ArtifactModel', ArtifactSchema);

module.exports = ArtifactModel;