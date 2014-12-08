
"use strict";

var image = new Image();
image.src = "img/loader.GIF";

$(document).ready(function() {
    var signin = $('#signin');
    signin.submit(onSubmit);
});

function onSubmit(eventObject) {
    var valid = true;

    var form = this;

    try {
        var users = [];

        $("#loader").show();
        $('#loader').attr('src', image.src);
        $.ajax({
            url: 'https://api.parse.com/1/classes/users',
            headers: {
                'X-Parse-Application-Id': 'JzXjelfFGeUVJm5t5mPd8UaCt7OB7hIaIQk51o5p',
                'X-Parse-REST-API-Key': 'SYbBvrOCTgVuVQMVmFCfYmAXswZvdHBdZd4XnjeJ'
            },
            success: function (data) {
                users = data.results;

                var validUser = true;
                var matchedUser;

                var idx;
                for (var idx = 0; idx < users.length; ++idx) {
                    var user = users[idx]
                    //console.log(user.userName);
                    //console.log(user.password);
                    if (form.elements['userName'].value != user.userName || form.elements['password'].value != user.password) {
                        validUser = false;
                    }
                    else {
                        validUser= true;
                        matchedUser = user;
                        break;
                    }
                }

                if (!validUser) {
                    $('#incorrect').show();
                    valid = false;
                    form.elements['userName'].className = 'form-control invalid-field';
                    form.elements['password'].className = 'form-control invalid-field';
                }
                else {
                    console.log('valid user');
                    if (matchedUser.role == 'student') {
                        window.location.replace('students.html');
                    }
                    else if (matchedUser.role == 'instructor') {
                        window.location.replace('instructor.html');
                    }
                }
            },
            error: function(err) {
                console.log(err);
            },
            complete: function() {
                $('#loader').hide();
            }
        });
    }
    catch (err) {
        console.log(err);
        valid = false;
    }

    if (!valid && eventObject.preventDefault) {
        eventObject.preventDefault();
    }

    valid = false;

    eventObject.returnValue = valid;

    return valid;
}

