var controllingMin = 1;
var baseURL = "/";

var cameraShutterSpeeds = {
    "1/30": 33333,
    "1/40": 25000,
    "1/50": 20000,
    "1/60": 16666,
    "1/80": 12500,
    "1/100": 10000,
    "1/125": 8000,
    "1/160": 6250,
    "1/200": 5000,
    "1/250": 4000,
    "1/320": 3125,
    "1/400": 2500,
    "1/500": 2000
}

$(document).ready(function() {

    // Hide controls
    $("#sensitivity-controls").hide();
    $("#settings-controls").hide();
    $("#delete-confirm").hide();
    $("#delete-confirm2").hide();

    getCameraStatus();
    sendTime(getDateString());

    // Button events
    $(".btn").click(function() {
        var dataDest = $(this).data('dest');
        var thisButton = $(this);
        console.log(dataDest);
        if (dataDest == "sensitivity") {
            $("#sensitivity-controls").slideDown(100);
        }
        else if (dataDest == "less" || dataDest == "more" || dataDest == "default") {
            $.ajax({
                url: baseURL + dataDest,
                error: function() {
                    console.log("Failed to change sensitivity.");
                },
                success: function() {
                    console.log("Changed sensitivity.");
                    $("#sensitivity-controls .active").removeClass("active");
                }
            })
            $("#sensitivity-controls .active").removeClass("active");
        }
        else if (dataDest == "start") {
            $.ajax({
                url: baseURL + dataDest,
                error: function() {
                    console.log("Failed to start capture.");
                },
                success: function() {
                    console.log("Started capture");
                    thisButton.data('dest', "stop");
                    thisButton.addClass("btn-danger");
                    thisButton.removeClass("btn-success");
                    thisButton.text("Stop recording");
                },
                timeout: 1000
            });
        }
        else if (dataDest == "stop") {
            $.ajax({
                url: baseURL + dataDest,
                error: function() {
                    console.log("Failed to start capture.");
                },
                success: function() {
                    console.log("Stopped capture");
                    thisButton.data('dest', "start");
                    thisButton.addClass("btn-success");
                    thisButton.removeClass("btn-danger");
                    thisButton.text("Start recording");
                },
                timeout: 1000
            });
        }
        else if (dataDest == "delete") {
            $("#delete-confirm").slideDown(100);
        }
        else if (dataDest == "delete-yes") {
            $("#delete-confirm2").slideDown(100);
        }
        else if (dataDest == "delete-no") {
            $("#delete-confirm").slideUp(100);
            $("#delete-confirm2").slideUp(100);
        }
        else if (dataDest == "delete-final") {
            $.ajax({
                url: baseURL + dataDest,
                error: function() {
                    console.log("Failed to delete photos.");
                },
                success: function() {
                    console.log("Deleted photos.");
                    location.reload(true);
                },
                timeout:1000
            });
        }
        else if (dataDest == "settings") {
            $("#settings-controls").slideDown(100);
        }
        else sendGetRequest(dataDest);
    });
});

function getCameraStatus() {
    $.getJSON(baseURL + "get-status", function(data) {
        console.log("Mode: " + data.mode);
        console.log("Sensitivity: " + data.sensitivity);
        console.log("ISO: " + data.iso);
        console.log("Shutter speed: " + data.shutter_speed);
        console.log("Fix camera settings: " + data.fix_camera_settings);

        if (data.mode == 1) {
            btn = $("#start-stop");
            btn.data('dest', "stop");
            btn.addClass("btn-danger");
            btn.removeClass("btn-success");
            btn.text("Stop recording");
        }
        if (data.sensitivity == "less") {
            $("#default").removeClass("active");
            $("#less").addClass("active");
        }
        else if (data.sensitivity == "more") {
            $("#default").removeClass("active");
            $("#more").addClass("active");
        }
    });
}

function sendGetRequest(r) {
    $.get(baseURL + r)
        .done(function() {
            console.log("Sent get request to " + r);
            return true;
        }).fail(function() {
            console.log("Failed to send get request.");
            return false;
        });

}

/*
Retrieves the current date and time and formats it so that it
can be used with the Unix date command.
 */
function getDateString() {
    var date = new Date();
    var hours = date.getHours();
    var hoursString = ('0' + hours).slice(-2);
    var minutes = date.getMinutes();
    var minutesString = ('0' + minutes).slice(-2);
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var monthString = ('0' + month).slice(-2);
    var day = date.getDate();
    var dayString = ('0' + day).slice(-2);

    return year.toString() + monthString + dayString + " " + hoursString + ":" + minutesString;
}

function sendTime(t) {
    var postData = JSON.stringify({"timeString": t});
    console.log("Time: " + t);

    $.ajax({
        type: "POST",
        url: baseURL + 'set-time',
        dataType: 'json',
        contentType: 'application/json',
        data: postData,
        success: function() {
            console.log("Sent time to Python server.");
        }
    });
}

function gcd(a, b) {
  if (b < 0.0000001) return a;
  return gcd(b, Math.floor(a % b));
}

