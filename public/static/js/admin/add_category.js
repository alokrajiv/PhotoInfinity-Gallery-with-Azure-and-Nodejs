$(function() {
    var listCategory = $('#list_category');
    function updateCategoryList() {
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "http://localhost:3001/category/",
            "method": "GET",
            "headers": {
                "cache-control": "no-cache",
                "postman-token": "16d3c563-68d1-1d4e-16be-1686923f4012"
            }
        }

        $.ajax(settings).done(function(response) {
            var res = "";
            response.data.forEach(function(category) {
                res += "<li>" + category.categoryName + "</li>"
            });
            listCategory.html(res);
        });
    }
    updateCategoryList();
    var buttonNewCategory = $('#button_new_category');
    var inputNewCategory = $('#input_new_category');
    buttonNewCategory.click(function(e) {
        console.log(inputNewCategory.val());
        var settings = {
            "crossDomain": true,
            "url": "http://localhost:3001/category/",
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
            console.log(response);
        });
    })
})