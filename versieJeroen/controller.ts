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

        export class SnakeController {
 /**
  @function init() -> void
  @desc Haal eventueel bestaand voedsel en een bestaande slang weg, cre\"eer een slang, genereer voedsel, en teken alles
*/
    init() {
        canvas = document.getElementById('mijnSnakeCanvas') as HTMLCanvasElement;
        context = canvas.getContext('2d');
        width = canvas.width;
        height = canvas.height;
        snake = new snakeModule.Snake(width, height);
        this.draw();
        snakeTimer = setInterval(this.move, SLEEPTIME)
    }

    stop() {
        context.clearRect(0,0,width, height);
        clearInterval(snakeTimer)
    }

/**
  @function move(direction) -> void
  @desc Beweeg slang in aangegeven richting
        tenzij slang uit canvas zou verdwijnen  
  @param   {string} direction de richting (een van de constanten UP, DOWN, LEFT of RIGHT)
*/
    move() {
        if (snake.move(direction)) {
            this.draw();
            if (snake.heeftGewonnen()) {
                this.stop();
                context.font = '20px Georgia';
                context.fillText('you win', 10, 90)
            }
        } else {
            this.stop();
            context.font = '20px Georgia';
            context.fillText('you lose', 10, 90)
        };
    }

    /**
     @function draw() -> void
    @desc Teken de slang en het voedsel
    */
    draw() {
        context.clearRect(0,0,width, height);
        
        var foods = snake.getSnakeFoods()
        foods.forEach(this.drawElement);

        var segments = snake.getSnakeSegments()
        segments.forEach(this.drawElement);
    }

    /**
     @function drawElement(element, canvas) -> void
    @desc Een element tekenen
    @param {Element} element een Element object
    @param  {dom object} canvas het tekenveld
    */
    drawElement(element: snakeModule.Element) {
        canvas.drawArc({
            draggable: false,
            fillStyle: element.color,
            x: element.x,
            y: element.y,
            radius: element.radius
        })
    };

    changeDirection(event: any) {
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
       
}

var cont = new controller.SnakeController();
$(document).ready(function () {
    $("#startSnake").click(cont.init);
    $("#stopSnake").click(cont.stop);
});
$(document).keydown(cont.changeDirection);