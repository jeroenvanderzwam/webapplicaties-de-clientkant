/*jslint devel: true */
/*global jQuery, document */
'use strict';

var snakeModule = (function() {
    var snake,
        xMax,                     
        yMax,
        width,         
        height; 
    const 
        R = 10, 
        STEP = 2 * R,    
        XMIN = R,         
        YMIN = R,
        SNAKE = "DarkRed", 
        FOOD = "Olive",    
        HEAD = "DarkOrange", 
        LEFT = "left",   
        RIGHT = "right",
        UP = "up",
        DOWN = "down",
        NUMFOODS = 5;

/**
 @constructor Snake
@param {[Element] segments een array met aaneengesloten slangsegmenten
    Het laatste element van segments wordt de kop van de slang 
    */
    function Snake(segments) {
        this.segments = segments;
        this.foods = [];
    }

    Snake.prototype.canMove = function(direction) {
        return !snake.headHitsASegment();
    }

    Snake.prototype.headHitsAFood = function() {
        return this.foods.some(this.headHitsFood)
    }

    Snake.prototype.headHitsFood = function(element) {
        var head = snake.getHead()
        return head.collidesWithOneOf(element);
    }

    Snake.prototype.headHitsASegment = function() {
        var segmentsWithoutHead = this.segments.slice(0,-1)
        return segmentsWithoutHead.some(this.headHitsSegment);
    }

    Snake.prototype.headHitsSegment = function(element) {
        var head = snake.getHead()
        return head.collidesWithOneOf(element)
    }

    Snake.prototype.removeAFood = function() {
        var head = snake.getHead()
        this.foods = this.foods.filter(function (element) { 
            return !head.collidesWithOneOf(element)}, this)
    }

    Snake.prototype.noFoodsLeft = function() {
        return this.foods.length == 0;
    }

    Snake.prototype.moveSnake = function(direction, addElement) {
        var head = snake.getHead()
        head.color = SNAKE;
        this.segments.push(head.getNewHead(direction));
        if (!addElement) {
            this.segments.shift();
        }
    }

    Snake.prototype.getHead = function() {
        return this.segments[this.segments.length - 1];
    }
    
    Snake.prototype.doMove = function(direction) {
        if (this.headHitsAFood()) {
            this.removeAFood();
            this.moveSnake(direction, true)
        } else {
            this.moveSnake(direction, false);
        }
        if (this.noFoodsLeft()) {
            console.log('Je hebt gewonnen')
        }
    }

    /**
     @function createFoods() -> array met food
    @desc [Element] array van random verdeelde voedselpartikelen
    @return [Element] array met food
    */
    Snake.prototype.createFoods = function() {
        var i = 0,
            food;
    //we gebruiken een while omdat we, om een arraymethode te gebruiken, eerst een nieuw array zouden moeten creëren (met NUMFOODS elementen)
        while (i < NUMFOODS) {
            food = createElement(XMIN + getRandomInt(0, xMax), YMIN + getRandomInt(0, yMax), FOOD);
            if (!food.collidesWithOneOf(this.segments) && !food.collidesWithOneOf(this.foods) ) {
                this.foods.push(food);
                i++;
            }
        }
    }

    /**
     @function getRandomInt(min: number, max: number) -> number
    @desc Creeren van random geheel getal in het interval [min, max] 
    @param {number} min een geheel getal als onderste grenswaarde
    @param {number} max een geheel getal als bovenste grenswaarde (max > min)
    @return {number} een random geheel getal x waarvoor geldt: min <= x <= max
    */
    function getRandomInt(min, max) {
        return Math.round((Math.floor(Math.random() * (max - min + 1)) + min) / (width/STEP)) * (width/STEP);
    }

            /**
     @constructor Element
    @param radius straal
    @param {number} x x-coordinaat middelpunt
    @param {number} y y-coordinaat middelpunt
    @param {string} color kleur van het element
    */
   function Element(radius, x, y, color) {
    this.radius = radius;
    this.x = x;
    this.y = y;
    this.color = color;
    }

    Element.prototype.getNewHead = function(direction) {
        var newHead = createElement(this.x, this.y, HEAD);
        switch (direction) {
            case UP:
                newHead.y = this.y - STEP;
                break;
            case DOWN:
                newHead.y = this.y + STEP;
                break;
            case LEFT:
                newHead.x = this.x - STEP;
                break;
            case RIGHT:
                newHead.x = this.x + STEP;
                break;
        }
        return newHead;
    }
    
    Element.prototype.collidesWithOneOf = function (element) {
        return this.x == element.x && this.y == element.y;
    };

        /**
     @function createSegment(x,y) -> Element
    @desc Slangsegment creeren op een bepaalde plaats
    @param {number} x x-coordinaat middelpunt
    @param {number} y y-coordinaart middelpunt
    @return: {Element} met straal R en color SNAKE
    */
   function createElement(x, y, color)  {
    return new Element(R, x, y, color);
    }

            /**
     @function createStartSnake() -> Snake
    @desc Slang creëren, bestaande uit  twee segmenten, 
            in het midden van het veld
    @return: slang volgens specificaties
    */
    function createStartSnake() {
    var startSegments = [createElement(R + width / 2, R + height / 2, SNAKE), 
                        createElement(R + width / 2, height / 2 - R, HEAD)];
        return new Snake(startSegments);
    }

    function startSnake(w, h) {
        width = w;
        height = h;
        xMax = width - R;
        yMax = height - R;
        snake = createStartSnake();
        snake.createFoods();
    }

    function getSnakeFoods () {
        return snake.foods;
    }

    function getSnakeSegments() {
        return snake.segments;
    }

    function move(direction) {
        var result = false;
        if (snake.canMove(direction)) {
            snake.doMove(direction);
            result = true;
        }
        return result;
    }

    return {
        UP: UP,
        RIGHT: RIGHT,
        LEFT: LEFT,
        DOWN: DOWN,
        startSnake: startSnake,
        move: move,
        getSnakeFoods: getSnakeFoods,
        getSnakeSegments: getSnakeSegments
    }
})();

var controller = (function() {
    const                  
        SLEEPTIME = 500,
        LEFTKEY = 37,
        UPKEY = 38,
        RIGHTKEY = 39,
        DOWNKEY = 40;     

    var       
        snakeTimer,
        width,
        height,                     
        canvas,                
        direction = snakeModule.UP,
        context;

        /**
  @function init() -> void
  @desc Haal eventueel bestaand voedsel en een bestaande slang weg, cre\"eer een slang, genereer voedsel, en teken alles
*/
function init() {
    canvas = jQuery("#mijnSnakeCanvas").clearCanvas();
    context = canvas[0].getContext('2d');
    width = canvas[0].width;
    height = canvas[0].height;
    snakeModule.startSnake(width, height);
    draw();
    snakeTimer = setInterval(function() {
        move(direction);
    }, SLEEPTIME)
}

function stop() {
    context.clearRect(0,0,width, height);
    clearInterval(snakeTimer)
}

/**
  @function move(direction) -> void
  @desc Beweeg slang in aangegeven richting
        tenzij slang uit canvas zou verdwijnen  
  @param   {string} direction de richting (een van de constanten UP, DOWN, LEFT of RIGHT)
*/
function move(direction) {
    if (snakeModule.move(direction)) {
        draw();
    } else {
        console.log('je hebt verloren')
        stop();
    };
}

/**
  @function draw() -> void
  @desc Teken de slang en het voedsel
*/
function draw() {
    context.clearRect(0,0,width, height);
    
    var foods = snakeModule.getSnakeFoods()
    foods.forEach(drawElement);

    var segments = snakeModule.getSnakeSegments()
    segments.forEach(drawElement);
}

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
        })
    };

    function changeDirection(e) {
        switch (e.which) {
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

    return {
        changeDirection: changeDirection,
        init: init,
        stop: stop
    }
})();

jQuery(document).ready(function () {
    jQuery("#startSnake").click(controller.init);
    jQuery("#stopSnake").click(controller.stop);
});
jQuery(document).keydown(controller.changeDirection);