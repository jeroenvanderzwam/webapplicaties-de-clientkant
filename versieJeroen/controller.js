var controller = (function() {
    const                  
        SLEEPTIME = 100,
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

    /**
      @function stop() -> void
      @desc Stopt het spel
    */
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
            if (snakeModule.heeftGewonnen()) {
                stop();
                context.font = '20px Georgia';
                context.fillText('you win')
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

    /**
      @function changeDirection(e) -> void
      @desc Geeft de richting aan de hand van een toets aanslag 
      @param {event} e een event
    */
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