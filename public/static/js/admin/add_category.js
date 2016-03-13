$(function() {
    var listCategory = $('#list_category');
    var listSubCategory = $('#list_sub_category');
    var fieldCategory = $('#field_categoryId');
    var selectedCategory = null;
    function updateCategoryList() {

        var settings = {
            "async": true,
            "url": "/category/",
            "method": "GET",
            "headers": {
            }
        }

        $.ajax(settings).done(function(response) {
            var res = "";
            response.data.forEach(function(category) {
                res += "<li>" + category.categoryName + "</li>"
            });
            listCategory.html(res);
            var categories = response.data;
            fieldCategory.change(function(e) {
                selectedCategory = fieldCategory.val();
                for (var i = 0; i < categories.length; i++) {
                    var category = categories[i];
                    if (category._id === selectedCategory) {
                        var res = "";
                        category.subCategory.forEach(function(subCategory) {
                            res += "<li>" + subCategory.subCategoryName + "</li>";
                        });
                        listSubCategory.html(res);
                    }
                }
            })
            var res = "";
            categories.forEach(function(category) {
                res += "<option value='" + category._id + "'>" + category.categoryName + "</option>";
            })
            fieldCategory.html(res).promise().done(function() {
                if (selectedCategory != null) {
                    console.log($('#field_categoryId'));
                    $('#field_categoryId').val(selectedCategory).change()
                }
                else {
                    fieldCategory.val($("#field_categoryId option:first").val()).change();
                }
            });


        });


    }
    updateCategoryList();


    var buttonNewCategory = $('#button_new_category');
    var buttonNewSubCategory = $('#button_new_sub_category');
    var inputNewCategory = $('#input_new_category');
    var inputNewSubCategory = $('#input_new_sub_category');
    buttonNewCategory.click(function(e) {
        var settings = {
            "crossDomain": true,
            "url": "/category/",
            "method": "POST",
            "headers": {
                "content-type": "application/json"
            },
            "data": JSON.stringify({
                "newCategory": {
                    "name": inputNewCategory.val()
                }
            })
        }

        $.ajax(settings).done(function(response) {
            inputNewCategory.val('')
            updateCategoryList();
        });
    })
    buttonNewSubCategory.click(function(e) {
        var settings = {
            "crossDomain": true,
            "url": "/category/id/" + selectedCategory + "/subcategory/",
            "method": "POST",
            "headers": {
                "content-type": "application/json"
            },
            "data": JSON.stringify({
                "newSubCategory": {
                    "name": inputNewSubCategory.val()
                }
            })
        }

        $.ajax(settings).done(function(response) {
            inputNewSubCategory.val('')
            updateCategoryList();
        });
    })
})