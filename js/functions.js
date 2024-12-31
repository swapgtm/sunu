var $window = $(window), gardenCtx, gardenCanvas, $garden, garden;
var clientWidth = $(window).width();
var clientHeight = $(window).height();

$(function () {
    // Setup garden
    $loveHeart = $("#loveHeart");
    var offsetX = $loveHeart.width() / 2;
    var offsetY = $loveHeart.height() / 2 - 55;
    $garden = $("#garden");
    gardenCanvas = $garden[0];
    gardenCanvas.width = $("#loveHeart").width();
    gardenCanvas.height = $("#loveHeart").height();
    gardenCtx = gardenCanvas.getContext("2d");
    gardenCtx.globalCompositeOperation = "lighter";
    garden = new Garden(gardenCtx, gardenCanvas);

    // Adjust content width and height
    $("#content").css("width", $loveHeart.width() + $("#code").width());
    $("#content").css("height", Math.max($loveHeart.height(), $("#code").height()));
    $("#content").css("margin-top", Math.max(($window.height() - $("#content").height()) / 2, 10));
    $("#content").css("margin-left", Math.max(($window.width() - $("#content").width()) / 2, 10));

    // Start heart animation after page load
    setTimeout(function () {
        startHeartAnimation();  // Start the animation after the page is loaded
    }, 500);

    // Render loop for garden
    setInterval(function () {
        garden.render();
    }, Garden.options.growSpeed);
});

$(window).resize(function () {
    var newWidth = $(window).width();
    var newHeight = $(window).height();
    if (newWidth != clientWidth && newHeight != clientHeight) {
        location.replace(location);
    }
});

// Function to calculate the heart shape point
function getHeartPoint(angle) {
    var t = angle / Math.PI;
    var x = 19.5 * (16 * Math.pow(Math.sin(t), 3));  // X coordinate of the heart point
    var y = -20 * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));  // Y coordinate of the heart point
    return [offsetX + x, offsetY + y];  // Return the calculated coordinates
}

// Start the heart animation
function startHeartAnimation() {
    var interval = 50;
    var angle = 10;
    var heart = [];
    var animationTimer = setInterval(function () {
        var bloom = getHeartPoint(angle);  // Get the heart point for current angle
        var draw = true;

        // Check if the bloom should be drawn (no collision with other blooms)
        for (var i = 0; i < heart.length; i++) {
            var p = heart[i];
            var distance = Math.sqrt(Math.pow(p[0] - bloom[0], 2) + Math.pow(p[1] - bloom[1], 2));
            if (distance < Garden.options.bloomRadius.max * 1.3) {
                draw = false;
                break;
            }
        }

        if (draw) {
            heart.push(bloom);  // Add the new bloom point to the array
            garden.createRandomBloom(bloom[0], bloom[1]);  // Create a bloom at the calculated point
        }

        // End the animation once the heart reaches the desired angle
        if (angle >= 30) {
            clearInterval(animationTimer);  // Stop the animation
            showMessages();  // Show the messages after animation ends
        } else {
            angle += 0.2;  // Increase the angle for the next bloom
        }
    }, interval);
}

// Typewriter effect
(function ($) {
    $.fn.typewriter = function () {
        this.each(function () {
            var $ele = $(this), str = $ele.html(), progress = 0;
            $ele.html('');
            var timer = setInterval(function () {
                var current = str.substr(progress, 1);
                if (current == '<') {
                    progress = str.indexOf('>', progress) + 1;
                } else {
                    progress++;
                }
                $ele.html(str.substring(0, progress) + (progress & 1 ? '_' : ''));
                if (progress >= str.length) {
                    clearInterval(timer);
                }
            }, 30);
        });
        return this;
    };
})(jQuery);

// Time elapse function
function timeElapse(date) {
    var current = Date();
    var seconds = (Date.parse(current) - Date.parse(date)) / 1000;
    var days = Math.floor(seconds / (3600 * 24));
    seconds = seconds % (3600 * 24);
    var hours = Math.floor(seconds / 3600);
    if (hours < 10) {
        hours = "0" + hours;
    }
    seconds = seconds % 3600;
    var minutes = Math.floor(seconds / 60);
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    seconds = seconds % 60;
    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    var result = "<span class=\"digit\">" + days + "</span> days <span class=\"digit\">" + hours + "</span> hours <span class=\"digit\">" + minutes + "</span> minutes <span class=\"digit\">" + seconds + "</span> seconds";
    $("#elapseClock").html(result);
}

// Show messages after animation
function showMessages() {
    adjustWordsPosition();
    $('#messages').fadeIn(5000, function () {
        showLoveU();
    });
}

// Adjust the position of words
function adjustWordsPosition() {
    $('#words').css("position", "absolute");
    $('#words').css("top", $("#garden").position().top + 195);
    $('#words').css("left", $("#garden").position().left + 70);
}

// Adjust the position of the code section
function adjustCodePosition() {
    $('#code').css("margin-top", ($("#garden").height() - $("#code").height()) / 2);
}

// Show the "Love You" message
function showLoveU() {
    $('#loveu').fadeIn(3000);
}
