$(function () {
    function htmlCircularSpinner(size) {
        var html_circular_spinner = '<div class="preloader-wrapper '+ size +' active">\
            <div class="spinner-layer spinner-blue">\
            <div class="circle-clipper left">\
                <div class="circle"></div>\
            </div><div class="gap-patch">\
                <div class="circle"></div>\
            </div><div class="circle-clipper right">\
                <div class="circle"></div>\
            </div>\
            </div>\
            <div class="spinner-layer spinner-red">\
            <div class="circle-clipper left">\
                <div class="circle"></div>\
            </div><div class="gap-patch">\
                <div class="circle"></div>\
            </div><div class="circle-clipper right">\
                <div class="circle"></div>\
            </div>\
            </div>\
        \
            <div class="spinner-layer spinner-yellow">\
            <div class="circle-clipper left">\
                <div class="circle"></div>\
            </div><div class="gap-patch">\
                <div class="circle"></div>\
            </div><div class="circle-clipper right">\
                <div class="circle"></div>\
            </div>\
            </div>\
        \
            <div class="spinner-layer spinner-green">\
            <div class="circle-clipper left">\
                <div class="circle"></div>\
            </div><div class="gap-patch">\
                <div class="circle"></div>\
            </div><div class="circle-clipper right">\
                <div class="circle"></div>\
            </div>\
            </div>\
        </div>';
        return html_circular_spinner;
    }
    function upd() {
        var o = '';
        $.ajax({
            type: "GET",
            url: "ajax/fetch_followers/",
            data: {
                'username': getCookieValue('username')
            },
            dataType: "JSON",
            beforeSend: function () {
                $('#reload').addClass('disabled');
                $('#result').html(htmlCircularSpinner('small'));
            },
            success: function (request) {
                r = request.twitter_info;
                for (const x in r) {
                    o += ' \
                        <div class="row"> \
                            <div class="col s4"> \
                                Username: <a href="https://twitter.com/'+r[x].username+'" target="_blank">@'+ r[x].username +'</a>    \
                            </div>    \
                            <div class="col s4">   \
                                Followers: <a href="https://twitter.com/'+r[x].username+'/followers" target="_blank">'+r[x].followers+'</a>    \
                            </div> \
                        </div>';
                }
                $('#result').html(o);
            },
        }).done(function () {
            var html = '<i class="material-icons">refresh</i>';
        }).fail(function () {
            $('#result').html('<i class="large material-icons">remove_circle</i>');
        }).always(function () {
            $('#reload').removeClass('disabled');
            setTimeout(upd, 10000);
        });
    }
    function setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires="+d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }
    function getCookieValue(cname) {
        var ca = document.cookie.split(';');
        var r = '';
        for (const x in ca) {
            var [k, v] = ca[x].split('=');
            var key = k.replace(/\s/g, '');
            if (key == cname) {
                r = v;
            }
        }
        if (r == '') {
            return null;
        } else {
            return r;
        }
    }
    function removeCookie(cname, rmvalue, exdays) {
        var cvalues = getCookieValue(cname).split(',');
        var nvalue = [];
        for (const x in cvalues) {
            if (cvalues[x] != rmvalue) {
                nvalue.push(cvalues[x]);
            }
        }
        var cvalue = nvalue.join(',');
        setCookie(cname, cvalue, exdays);
    }
    function loader() {
        var cookie_usernames = getCookieValue('username');
        if (cookie_usernames !== null) {
            var list_the_user = '<li class="collection-header"><h6>Users:</h6></li>';
            list_the_user += '<li class="collection-item"><div>&nbsp;<a href="#!" class="secondary-content close_all_btn"><i class="material-icons">clear_all</i></a></div></li>';
            var get_username = cookie_usernames.split(',');
            for (const x in get_username) {
                list_the_user += create_list(get_username[x]);
            }
            console.log(cookie_usernames);
            $('#user-list').html(list_the_user);
            upd();
        }
    }
    function create_list(value) {
        var o = '<li class="collection-item usernames scale-transition" value="'+value+'"><div><a href="https://twitter.com/'+value+'" target="_blank">'+value+'</a><a href="#!" class="secondary-content close_btn"><i class="tiny material-icons">clear</i></a></div></li>';
        return o;
    }
    loader();
    $('#id_q').keyup(function (e) {
        var q = $(this).val();
        if (q == null || q == '') {
            return
        }
        if (e.keyCode == 13) {
            var prev_cookie = getCookieValue('username');
            if (prev_cookie !== null) {
                setCookie('username', prev_cookie + ',' + q, 60);
            } else {
                setCookie('username', q, 60);
            }
            M.toast({html: q + ' is added.'});
            loader();
            $(this).val('');
        }
    });
    $('#user-list').on('click', '.close_btn', function (e) {
        var remove_list = $(this).closest('li').remove();
        var remove_value_list = $(this).closest('li').attr('value');
        removeCookie('username', remove_value_list);
        loader();
    });
    $('#user-list').on('click', '.close_all_btn', function (e) {
        $('.usernames').addClass('scale-out');
        // loader();
    });
    $('#reload').click(function (e) { 
        loader();
    });
});