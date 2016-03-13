var express = require('express');
var router = express.Router();
var CategoryModel = require('../models/category.js');


router.get('/', function (req, res) {
    CategoryModel.find({}, function (err, data) {
        if (err) {
            res.json({ onFind: 'failed', err: err });
        }
        else {
            res.json({ onFind: 'success', data: data });
        };
    })
});
router.post('/', function (req, res) {
    console.log(req.body.newCategory)
    var newCategory = new CategoryModel({
        categoryName: req.body.newCategory.name,
        subCategory: []
    });
    newCategory.save(function (err) {
        if (err) {
            res.json({ onSave: 'failed', err: err });
        }
        else {
            res.json({ onSave: 'success' });
        };

    });
});
router.get('/id/:id', function (req, res) {
    CategoryModel.findById(req.params.id, function (err, data) {
        res.json(data);
    })
});
router.delete('/id/:id', function (req, res) {
    CategoryModel.findById(req.params.id).remove(function (err, data) {
        res.json(data);
    })
});
router.delete('/name/:name', function (req, res) {
    CategoryModel.findOne({categoryName: req.params.name}).remove(function (err, data) {
        res.json(data);
    })
});
router.get('/id/:id/subcategory/', function (req, res) {
    CategoryModel.findById(req.params.id, function (err, data) {
        res.json(data.subCategory);
    })
});
router.post('/id/:id/subcategory/', function (req, res) {
    CategoryModel.findById(req.params.id, function (err, data) {
        data.subCategory.push({
            subCategoryName: req.body.newSubCategory.name
        })
        data.save(function (err) {
            if (err) {
                res.json({ onSave: 'failed', err: err });
            }
            else {
                res.json({ onSave: 'success' });
            };

        });
    })
});

router.delete('/id/:id/subcategory/id/:subId', function (req, res) {
    CategoryModel.findById(req.params.id, function (err, data) {
        data.subCategory.id(req.params.subId).remove();
        data.save(function (err) {
            if (err) {
                res.json({ onSave: 'failed', err: err });
            }
            else {
                res.json({ onSave: 'success' });
            };

        });
    })
});

module.exports = router;
