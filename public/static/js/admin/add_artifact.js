$(function() {
    var field_category = $('#field_categoryId');
    var field_subCategory = $('#field_subCategoryId');
    function loadCategories() {
        var settings = {
            "async": true,
            "url": "/category/",
            "method": "GET",
            "headers": {
            }
        }

        $.ajax(settings).done(function(response) {
            console.log(response);
            var categories = response.data;
            field_category.change(function(e) {
                var selectedCategory = field_category.val();
                console.log(selectedCategory);
                for (var i = 0; i < categories.length; i++) {
                    var category = categories[i];
                    if (category._id === selectedCategory) {
                        var res = "";
                        category.subCategory.forEach(function(subCategory) {
                            res += "<option value='" + subCategory._id + "'>" + subCategory.subCategoryName + "</option>";
                        });
                        field_subCategory.html(res);
                    }
                }
            })
            var res = "";
            categories.forEach(function(category) {
                res += "<option value='" + category._id + "'>" + category.categoryName + "</option>";
            })
            field_category.html(res);
            field_category.val($("#field_categoryId option:first").val()).change();
        });
    }
    loadCategories();
});