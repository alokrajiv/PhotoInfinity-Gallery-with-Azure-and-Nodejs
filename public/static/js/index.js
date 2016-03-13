$(function() {
    var matrixData = [],
        row = 0,
        page = 0,
        fullLoaded = false;

    function remoteLoad(page, limit, callback) {
        $.ajax({
            "async": true,
            "crossDomain": true,
            "url": "/artifact/search?page=" + page + "&limit=" + limit,
            "method": "GET",
            "headers": {}
        }).done(function(response, callback) {
            if (response.onFind !== 'success') {
                alert("ON FIND FAILED. SORRY");
            } else {
                data = response.data;
                if (data.length === 0) {
                    fullLoaded = true;
                    console.log("No more Data!");
                }
                var res = "";
                row++;
                matrixData[row] = [];
                data.forEach(function(artifact) {
                    if (row % 2 == 1) {
                        if (matrixData[row].length > 3) {
                            row++;
                            matrixData[row] = [];
                            matrixData[row].push(artifact);
                        } else {
                            matrixData[row].push(artifact);
                        }
                    } else {
                        if (matrixData[row].length > 2) {
                            row++;
                            matrixData[row] = [];
                            matrixData[row].push(artifact);
                        } else {
                            matrixData[row].push(artifact);
                        }
                    }
                });
                render(matrixData, callback);
            }
        });
    }


    var render = function(matrixData, callback) {
        var containerArtifacts = $('#container_artifacts');
        var res = "";
        matrixData.forEach(function(row) {
            res += '<div class="row" style="margin: 20px 20px 20px 20px">'
            var rowIndex = matrixData.indexOf(row);
            if (rowIndex % 2 == 0) {
                res += '<!--filler col--><div class="col-md-1" style="width: 12.499999995%"></div><!--./filler col-->';
            }
            row.forEach(function(artifact) {
                var colIndex = row.indexOf(artifact);
                res += hexagonTemplate(artifact, rowIndex, colIndex);
            })
            res += '</div>';
        })
        containerArtifacts.html(res);
        updateElements();
        if (!fullLoaded) {
            load_more_handle();
        } else {
            $('#load_more').hide();
        }


        function hexagonTemplate(artifact, rowIndex, colIndex) {
            return '\
            <div class="col-md-3 hex-preview">\
                    <img data-toggle="modal" data-matrix-row="'+ rowIndex + '" data-matrix-col="' + colIndex + '" data-target="#exampleModal" id="preview" hidden style="position:absolute; cursor: pointer; cursor: hand; z-index:10; top: 25px; left: -25px" src="img/preview_hex.png">\
                        <div class="hexagon" style="background-image: url(' + artifact.meta.logo.url + ')">\
                            <div class="hexTop"></div>\
                            <div class="hexBottom"></div>\
                        </div>\
            </div>\
            ';
        }
    }
    var load_more_handle = function() {
        $('#load_more').on('inview', function(event, isInView) {
            if (isInView) {
                console.log("Loading Page : " + page);
                page++;
                $('#load_more').off('inview');
                setTimeout(remoteLoad(page, 7, function() { console.log("moo") }), 3000);
            }
        });
    }

    load_more_handle();

    $('#exampleModal').on('show.bs.modal', function(event) {
        var modalTitle = $('#modal-title');
        var modalImage = $('#modal-img');
        var modalOwner = $('#modal-owner');
        var modalCategory = $('#modal-category');
        var modalSubCategory = $('#modal-subCategory');
        var modalDescr = $('#modal-descr');
        var target = $(event.relatedTarget)[0] // Button that triggered the modal
        var rowIndex = $(target).data('matrix-row'),
            colIndex = $(target).data('matrix-col')
        var artifact = matrixData[rowIndex][colIndex];
        modalTitle.html(artifact.name);
        modalImage.attr('src', artifact.meta.logo.url);
        modalDescr.html(artifact.meta.descr);
        var settings1 = {
            "async": true,
            "url": "/user/id/" + artifact.ownerId,
            "method": "GET",
            "headers": {}
        }

        $.ajax(settings1).done(function(response) {
            modalOwner.html(response.data.username);
        });
        var settings2 = {
            "async": true,
            "url": "/category/id/" + artifact.meta.categoryId,
            "method": "GET",
            "headers": {
            }
        }
        $.ajax(settings2).done(function(response) {
            var category = response.data;
            modalCategory.html(category.categoryName);
            for (var i = 0; i < category.subCategory.length; i++) {
                var subCategory = category.subCategory[i];
                if (subCategory._id === artifact.meta.subCategoryId) {
                    modalSubCategory.html(subCategory.subCategoryName);
                }
            }
        });
    })
});

$("#cat_button").click(function(e) {
    e.preventDefault();
    $("#wrapper").toggleClass("toggled");
    if ($('#cat_button').css('left') === '-5px') {
        $("#cat_button").animate({
            "left": "175px"
        }, 380);
    }
    if ($('#cat_button').css('left') === '175px') {
        $("#cat_button").animate({
            "left": "-5px"
        }, 380);
    }
});

$("#tab_signup").click(function() {
    $("#login-form").hide();
    $("#signup-form").fadeIn('slow');
});

$("#tab_login").click(function() {
    $("#signup-form").hide();
    $("#login-form").fadeIn('slow');
});

function toggleLoginForm() {
    $("#login-signup-form").slideDown('slow');
}

function hideLoginForm() {
    $("#login-signup-form").slideUp('slow');
}

function updateElements() {
    $('.hex-preview').hover(function() {
        $('#preview', this).fadeIn(100);
    }, function() {
        $('#preview', this).fadeOut(50);
    });

    if ($(window).width() < 768) {
        $('#login-signup-form').css({
            'width': '100%'
        });
        $('#tab_login').css({
            'margin-right': '5px'
        });
        $('#tab_signup').css({
            'margin-left': '5px'
        });
        $('#signup-form').css({
            'margin': '0px'
        });
        $('#login-form').css({
            'margin': '0px'
        });
    } else {
        $('#tab_login').css({
            'margin-right': '50px'
        });
        $('#tab_signup').css({
            'margin-left': '50px'
        });
        $('#signup-form').css({
            'margin': '50px'
        });
        $('#login-form').css({
            'margin': '50px'
        });
        $('#login-signup-form').css({
            'width': '50%'
        });
    }
}



$(window).resize(function() {
    updateElements();
});
$(document).ready(function() {
    updateElements();
});

// TODO: Update the sidebar to navbar on xs and