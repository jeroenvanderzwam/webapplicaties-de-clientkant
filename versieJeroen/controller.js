// import $ = require("jquery");
import { snakeModule } from "./snake.js";
export var controller;
(function (controller) {
    var SLEEPTIME = 100, LEFTKEY = 37, UPKEY = 38, RIGHTKEY = 39, DOWNKEY = 40;
    var snake, snakeTimer, width, height, canvas, direction = snakeModule.UP, context;
    var SnakeController = /** @class */ (function () {
        function SnakeController() {
        }
        /**
         @function init() -> void
         @desc Haal eventueel bestaand voedsel en een bestaande slang weg, cre\"eer een slang, genereer voedsel, en teken alles
       */
        SnakeController.prototype.init = function () {
            canvas = document.getElementById('mijnSnakeCanvas');
            context = canvas.getContext('2d');
            width = canvas.width;
            height = canvas.height;
            snake = new snakeModule.Snake(width, height);
            this.draw();
            snakeTimer = setInterval(this.move, SLEEPTIME);
        };
        SnakeController.prototype.stop = function () {
            context.clearRect(0, 0, width, height);
            clearInterval(snakeTimer);
        };
        /**
          @function move(direction) -> void
          @desc Beweeg slang in aangegeven richting
                tenzij slang uit canvas zou verdwijnen
          @param   {string} direction de richting (een van de constanten UP, DOWN, LEFT of RIGHT)
        */
        SnakeController.prototype.move = function () {
            if (snake.move(direction)) {
                this.draw();
                if (snake.heeftGewonnen()) {
                    this.stop();
                    context.font = '20px Georgia';
                    context.fillText('you win', 10, 90);
                }
            }
            else {
                this.stop();
                context.font = '20px Georgia';
                context.fillText('you lose', 10, 90);
            }
            ;
        };
        /**
         @function draw() -> void
        @desc Teken de slang en het voedsel
        */
        SnakeController.prototype.draw = function () {
            context.clearRect(0, 0, width, height);
            var foods = snake.getSnakeFoods();
            foods.forEach(this.drawElement);
            var segments = snake.getSnakeSegments();
            segments.forEach(this.drawElement);
        };
        /**
         @function drawElement(element, canvas) -> void
        @desc Een element tekenen
        @param {Element} element een Element object
        @param  {dom object} canvas het tekenveld
        */
        SnakeController.prototype.drawElement = function (element) {
            canvas.drawArc({
                draggable: false,
                fillStyle: element.color,
                x: element.x,
                y: element.y,
                radius: element.radius
            });
        };
        ;
        SnakeController.prototype.changeDirection = function (event) {
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
        };
        return SnakeController;
    }());
    controller.SnakeController = SnakeController;
})(controller || (controller = {}));
var cont = new controller.SnakeController();
$(document).ready(function () {
    $("#startSnake").click(cont.init);
    $("#stopSnake").click(cont.stop);
});
$(document).keydown(cont.changeDirection);
