// import $ = require("jquery");
import { snakeModule } from "./snake.js";

export module controller {
    const                  
        SLEEPTIME = 100,
        LEFTKEY = 37,
        UPKEY = 38,
        RIGHTKEY = 39,
        DOWNKEY = 40;     

    let       
        snake: snakeModule.Snake,
        snakeTimer: number,
        width: number,
        height: number,                     
        canvas: any,                
        direction: string = snakeModule.UP,
        context: any;
 /**
  @function init() -> void
  @desc Haal eventueel bestaand voedsel en een bestaande slang weg, cre\"eer een slang, genereer voedsel, en teken alles
*/
    export function init() {
        canvas = $('#mijnSnakeCanvas').clearCanvas();
        context = canvas[0].getContext('2d');
        width = canvas[0].width;
        height = canvas[0].height;
        snake = new snakeModule.Snake(width, height);
        draw();
        snakeTimer = setInterval(move, SLEEPTIME)
    }

    export function stop() {
        context.clearRect(0,0,width, height);
        clearInterval(snakeTimer)
    }

/**
  @function move(direction) -> void
  @desc Beweeg slang in aangegeven richting
        tenzij slang uit canvas zou verdwijnen  
  @param   {string} direction de richting (een van de constanten UP, DOWN, LEFT of RIGHT)
*/
    export function move() {
        if (snake.move(direction)) {
            draw();
            if (snake.heeftGewonnen()) {
                stop();
                context.font = '20px Georgia';
                context.fillText('you win', 10, 90)
            }
        } else {
            stop();
            context.font = '20px Georgia';
            context.fillText('you lose', 10, 90)
        };
    }

    /**
     @function draw() -> void
    @desc Teken de slang en het voedsel
    */
    export function draw() {
        context.clearRect(0,0,width, height);
        
        var foods = snake.getSnakeFoods()
        foods.forEach(drawElement);

        var segments = snake.getSnakeSegments()
        segments.forEach(drawElement);
    }

    /**
     @function drawElement(element, canvas) -> void
    @desc Een element tekenen
    @param {Element} element een Element object
    @param  {dom object} canvas het tekenveld
    */
    export function drawElement(element: snakeModule.Element) {
        canvas.drawArc({
            draggable: false,
            fillStyle: element.color,
            x: element.x,
            y: element.y,
            radius: element.radius
        })
    };

    export function changeDirection(event: any) {
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
}

$(document).ready(function () {
    $("#startSnake").click(controller.init);
    $("#stopSnake").click(controller.stop);
});
$(document).keydown(controller.changeDirection);