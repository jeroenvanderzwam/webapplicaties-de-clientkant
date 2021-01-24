// import $ = require("jquery");
import { snakeModule } from "./snake.js";
export var controller;
(function (controller) {
    var SLEEPTIME = 100, LEFTKEY = 37, UPKEY = 38, RIGHTKEY = 39, DOWNKEY = 40;
    var snake, snakeTimer, width, height, canvas, direction = snakeModule.UP, context;
    /**
     @function init() -> void
     @desc Haal eventueel bestaand voedsel en een bestaande slang weg, cre\"eer een slang, genereer voedsel, en teken alles
   */
    function init() {
        canvas = $('#mijnSnakeCanvas').clearCanvas();
        context = canvas[0].getContext('2d');
        width = canvas[0].width;
        height = canvas[0].height;
        snake = new snakeModule.Snake(width, height);
        draw();
        snakeTimer = setInterval(move, SLEEPTIME);
    }
    controller.init = init;
    function stop() {
        context.clearRect(0, 0, width, height);
        clearInterval(snakeTimer);
    }
    controller.stop = stop;
    /**
      @function move(direction) -> void
      @desc Beweeg slang in aangegeven richting
            tenzij slang uit canvas zou verdwijnen
      @param   {string} direction de richting (een van de constanten UP, DOWN, LEFT of RIGHT)
    */
    function move() {
        if (snake.move(direction)) {
            draw();
            if (snake.heeftGewonnen()) {
                stop();
                context.font = '20px Georgia';
                context.fillText('you win', 10, 90);
            }
        }
        else {
            stop();
            context.font = '20px Georgia';
            context.fillText('you lose', 10, 90);
        }
        ;
    }
    controller.move = move;
    /**
     @function draw() -> void
    @desc Teken de slang en het voedsel
    */
    function draw() {
        context.clearRect(0, 0, width, height);
        var foods = snake.getSnakeFoods();
        foods.forEach(drawElement);
        var segments = snake.getSnakeSegments();
        segments.forEach(drawElement);
    }
    controller.draw = draw;
    /**
     @function drawElement(element, canvas) -> void
    @desc Een element tekenen
    @param {Element} element een Element object
    @param  {dom object} canvas het tekenveld
    */
    function drawElement(element) {
        canvas.drawArc({
            draggable: false,
            fillStyle: element.color,
            x: element.x,
            y: element.y,
            radius: element.radius
        });
    }
    controller.drawElement = drawElement;
    ;
    function changeDirection(event) {
        switch (event.which) {
            case LEFTKEY:
                direction = snakeModule.LEFT;
                break;
            case UPKEY:
                direction = snakeModule.UP;
                break;
            case RIGHTKEY:
                direction = snakeModule.RIGHT;
                break;
            case DOWNKEY:
                direction = snakeModule.DOWN;
                break;
        }
    }
    controller.changeDirection = changeDirection;
})(controller || (controller = {}));
$(document).ready(function () {
    $("#startSnake").click(controller.init);
    $("#stopSnake").click(controller.stop);
});
$(document).keydown(controller.changeDirection);
