document.addEventListener('DOMContentLoaded', function () {
    (function() {
    const space = 50;
    const speed_ai = 2.5;
    // const min_such = 9000;

    function end() {
        if (hunt_state === 10) {
            console.log(end_data);
            socket.emit("hunt end", end_data);
        }
        hunt_state = 15;
    }

    function startHunt(data) {
        function rand_bm(mu, sigma, min, max) {
            var a = 0, b = 0, z;
            while (a === 0)
                a = Math.random();
            while (b === 0)
                b = Math.random();
            z = Math.sqrt(-2.0 * Math.log(a)) * Math.cos(2.0 * Math.PI * b);
            z = z * sigma + mu;
            if (z < min)
                z = min;
            else if (z > max)
                z = max;
            return z;
        }

        function finish() {
            var s = Math.round((new Date - begin) / 1000);
            console.log(s);
            var m = Math.floor(s / 60);
            s -= m * 60;
            if (m > 0) {
                time = m + " мин " + s + " сек";
            } else {
                time = s + " сек";
            }
            end_data = {
                time: time,
                wild_x: wild_x,
                wild_y: wild_y,
                hunt_type: type,
                difficulty: cl,
                id: data.id
            };
            hunt_state = 10;
            name = $("#main").data("n" + cl);
            end();
        }

        console.log(data);

        $(".begin, #select_type").remove();
        $("#main").show();
        // such is 10000 (cl=1), 15000 (cl=2), or 20000 (cl=3).
        var smell = data.smell; // 25 (cl=1), 20 (cl=2), or 15 (cl=3)
        var speed_flee = data.speed_flee; // 1.3 (cl=1), 1.4 (cl=2), or 1.5 (cl=3).
        var generate_count = data.generate_count; // 5 (cl=1), 10 (cl=2), or 15 (cl=3).
        var speed_buff = data.speed_buff; // Seems random?
        var wild_x = data.from_x; // rand(-such, such) or +/-9000.
        var wild_y = data.from_y; // Same.
        var type = data.hunt_type; // $("#main").data("type")
        var images = data.images;

        var w = Math.min(1920, Math.max(640, $(document).width()));
        var sx, sy, x, y;
        x = sx = w / 2 - 50;
        y = sy = h / 2 - 75;
        var speed = 1;
        var count = 0;
        var direction_x = -1;
        var direction_y = -1;
        var state = 0;
        var begin = new Date;
        var slow;

        var end_time = rand_bm(40.541, 6.23, 28, 65) + Math.random();
        console.log(end_time);
        setTimeout(finish, Math.round(end_time * 1000));

        $("#cat").css({ left: x, top: y });
        var map = [];

        function getCount(x, y) {
            count = 0;
            for (var i = 0; i < map.length; i++) {
                var tx = map[i].x + (sx - x);
                var ty = map[i].y + (sy - y);
                if (tx > space && tx < w - space && ty > space && ty < h - space) {
                    count++;
                }
            }
            return count;
        }

        function reload(flag) {
            if (!si) {
                return;
            }
            $(".details, #wild").remove();
            count = 0;
            for (var i = 0; i < map.length; i++) {
                var tx = map[i].x + (sx - x);
                var ty = map[i].y + (sy - y);
                if (tx > space && tx < w - space && ty > space && ty < h - space) {
                    var url = images[map[i].type][map[i].i];
                    $("body").append('<div class="details" style="background:url(\'jagd_img/' + url + '.png\');top:' + ty + 'px;left:' + tx + 'px"></div>');
                    count++;
                    if (flag && Math.abs(map[i].x - x) < 40 && Math.abs(map[i].y - y) < 40) {
                        if (map[i].type === "branch") {
                            speed = 0.4;
                            clearTimeout(slow);
                            slow = setTimeout(function() {
                                speed = 1;
                            }, 5000);
                        } else if (map[i].type === "grass" && speed === 1) {
                            speed = 1.5;
                            clearTimeout(slow);
                            slow = setTimeout(function() {
                                speed = 1;
                            }, 5000);
                        }
                    }
                }
            }
            tx = wild_x + (sx - x);
            ty = wild_y + (sy - y);
            if (tx > space && tx < w - space && ty > space && ty < h - space) {
                state = 1;
                var src = "things/" + type;
                if (type === 50) {
                    src = "jagd_img/target50";
                }
                $("body").append('<img id="wild" src="' + src + '.png" style="top:' + ty + 'px;left:' + tx + 'px">');
            }
            var way = Math.abs(x - wild_x) + Math.abs(y - wild_y);
            var sm = $("#main").data("sp") * smell;
            var pr = Math.min(100, +(way / sm * 100));
            pr = (100 - pr) / 100;
            var color = [255, 255, 255];
            color[0] = parseInt(color[0] * pr).toString(16).toUpperCase();
            color[1] = parseInt(color[1] * pr).toString(16).toUpperCase();
            color[2] = parseInt(color[2] * pr).toString(16).toUpperCase();
            if (color[0].length === 1) {
                color[0] = "0" + color[0];
            }
            if (color[1].length === 1) {
                color[1] = "0" + color[1];
            }
            if (color[2].length === 1) {
                color[2] = "0" + color[2];
            }
            $("#smell").attr("style", "background-color: #" + color[0] + color[1] + color[2]);
        }

        function generate(x, y) {
            for (var i = 0; i < generate_count; i++) {
                var temp = {};
                temp.x = rand(space - (sx - x), w - space - (sx - x));
                temp.y = rand(space - (sy - y), h - space - (sy - y));
                temp.type = rand(0, 1) ? "grass" : "branch";
                temp.i = rand(0, images[temp.type].length - 1);
                map.push(temp);
            }
        }

        function check() {
            if (getCount(x, y) < 3) generate(x, y);
            if (getCount(x - w, y) < 3) generate(x - w, y);
            if (getCount(x, y - h) < 3) generate(x, y - h);
            if (getCount(x - w, y - h) < 3) generate(x - w, y - h);
            if (getCount(x + w, y) < 3) generate(x + w, y);
            if (getCount(x, y + h) < 3) generate(x, y + h);
            if (getCount(x + w, y + h) < 3) generate(x + w, y + h);
            if (getCount(x - w, y + h) < 3) generate(x - w, y + h);
            if (getCount(x + w, y - h) < 3) generate(x + w, y - h);
            if (Math.abs(x - wild_x) < 55 && Math.abs(y - wild_y) < 105 && si > 0) {
                finish();
            }
        }

        function ai() {
            if (!rand(0, 3)) {
                var temp = {};
                temp.x = wild_x;
                temp.y = wild_y;
                temp.type = "step";
                temp.i = rand(0, images[temp.type].length - 1);
                map.push(temp);
            }
            var k = state ? speed_flee : 1;
            wild_x += Math.round(direction_x * rand(1, 20) * speed_ai * k / speed_buff) * speed_buff;
            wild_y += Math.round(direction_y * rand(1, 20) * speed_ai * k / speed_buff) * speed_buff;
            reload();
            if (state) {
                if (x > wild_x) {
                    direction_x = -1;
                } else if (x < wild_x) {
                    direction_x = 1;
                }
                if (y > wild_y) {
                    direction_y = -1;
                } else if (y < wild_y) {
                    direction_y = 1;
                }
                if (rand(0, 25) === 0) {
                    if (rand(0, 1)) {
                        direction_x = 0;
                    } else {
                        direction_y = 0;
                    }
                }
            } else {
                if (rand(0, 25) === 0) {
                    direction_x = rand(-1, 0);
                    if (direction_x === 0) {
                        direction_x = 1;
                    }
                }
                if (rand(0, 25) === 0) {
                    direction_y = rand(-1, 0);
                    if (direction_y === 0) {
                        direction_y = 1;
                    }
                }
                if (direction_x !== 0 && direction_y !== 0 && rand(0, 25) === 0) {
                    if (rand(0, 1)) {
                        direction_x = 0;
                    } else {
                        direction_y = 0;
                    }
                }
            }
        }

        hunt_state = 10;
        setTimeout(function() {
            clearInterval(si);
            si = setInterval(ai, 1500);
        }, 1000);
        si = setInterval(ai, 20);
        generate(x, y);
        var arrow_si = 0;

        function checkAll() {
            reload(true);
            check();
        }

        function left() {
            x -= 15 * speed;
            checkAll();
        }

        function top() {
            y -= 15 * speed;
            checkAll();
        }

        function right() {
            x += 15 * speed;
            checkAll();
        }

        function down() {
            y += 15 * speed;
            checkAll();
        }

        function left_top() {
            left();
            top();
        }

        function right_top() {
            right();
            top();
        }

        function left_down() {
            left();
            down();
        }

        function right_down() {
            right();
            down();
        }

        function start(func) {
            clearInterval(arrow_si);
            arrow_si = setInterval(func, 42);
        }

        $("#links").on("mousedown touchstart", function(e) {
            e.preventDefault();
            start(left);
        });
        $("#oben").on("mousedown touchstart", function(e) {
            e.preventDefault();
            start(top);
        });
        $("#rechts").on("mousedown touchstart", function(e) {
            e.preventDefault();
            start(right);
        });
        $("#unten").on("mousedown touchstart", function(e) {
            e.preventDefault();
            start(down);
        });
        $(document).on("mouseup touchend", function() {
            clearInterval(arrow_si);
        });
        Key.add("w; up", function(now, e) {
            if (!e.repeat) {
                start(top);
            }
        });
        Key.add("a; left", function(now, e) {
            if (!e.repeat) {
                start(left);
            }
        });
        Key.add("s; down", function(now, e) {
            if (!e.repeat) {
                start(down);
            }
        });
        Key.add("d; right", function(now, e) {
            if (!e.repeat) {
                start(right);
            }
        });
        Key.add("q", function(now, e) {
            if (!e.repeat) {
                start(left_top);
            }
        });
        Key.add("e", function(now, e) {
            if (!e.repeat) {
                start(right_top);
            }
        });
        Key.add("z", function(now, e) {
            if (!e.repeat) {
                start(left_down);
            }
        });
        Key.add("x", function(now, e) {
            if (!e.repeat) {
                start(right_down);
            }
        });
        document.onkeyup = function(e) {
            Key.keyup(e);
            clearInterval(arrow_si);
        };
        document.onblur = function() {
            Key.clear();
            clearInterval(arrow_si);
        };
        reload();
    }

    function rand(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    var h = Math.min(1200, Math.max(480, $(document).height()));
    var hunt_state = 0;
    var end_data;
    var si = 0;
    var time = "";
    var name = "";
    var socket = io.connect(location.origin, {
        path: "/ws/site/socket.io",
        b: 10000,
        c: 20000
    });
    socket.on("was connected", function() {
        switch (hunt_state) {
            case 0:
                socket.emit("hunt begin", { difficulty: window.cl });
                break;
            case 10:
                end();
        }
    });
    socket.on("show error", function() {
        $("html").html("Что-то пошло не так. Попробуйте перезагрузить страницу через некоторое время.");
        socket.disconnect()
    });
    socket.on("two tabs", function() {
        $("html").html("Вы открыли новую вкладку с охотой, поэтому старая (эта) больше не работает.");
        socket.disconnect()
    });
    socket.on("hunt error", function(error) {
        $("html").html(error);
        socket.disconnect()
    });
    socket.on("hunt start", function(data) {
        $("#buttons").remove();
        startHunt(data)
    });
    socket.on("hunt end", function() {
        var f = "Вы поймали " + name + " за " + time;
        clearInterval(si);
        si = 0;
        $("body").html('<div style="background: RGBA(255, 255, 204, 0.5);box-shadow:0 0 30px #FFC;font-size:3em;margin-top:' + (h / 2 - 50) + 'px;text-align:center">' + f + "</div>");
        socket.disconnect()
        setTimeout(function() { location.reload() }, 500 + 2000 * Math.random());
    });
    socket.on("connect_error", function(error) {
        error = JSON.stringify(error);
        error = error.replace(/":/g, '": ').replace(/",/g, '", ');
        $("html").html("Ошибка подключения:<br>" + error);
        socket.disconnect()
    })
})();
});



