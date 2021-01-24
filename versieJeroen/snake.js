var snakeModule = (function() {
    var snake,
        xMax,                     
        yMax,
        width,         
        height,
        gewonnen = false; 
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

    
    /**
      @function canMove(direction) -> boolean
      @desc Controleert of de slang kan bewegen in gegeven richting
      @param {string} direction de richting (een van de constanten UP, DOWN, LEFT of RIGHT)
      @return {boolean} true als de slang kan bewegen, anders false
    */
    Snake.prototype.canMove = function(direction) {
        var head = this.getHead();
        return !this.headHitsASegment() && head.withinCanvas(direction);
    }

    /**
      @function headHitsAFood() -> boolean
      @desc Controleert of de slang food raakt
      @return {boolean} true als de slang food raakt, anders false
    */
    Snake.prototype.headHitsAFood = function() {
        var head = this.getHead();
        return this.foods.some(function(element) {
            return head.collidesWithOneOf(element);
        })
    }

    /**
      @function headHitsASegment() -> boolean
      @desc Controleert of de slang een segment raakt
      @return {boolean} true als de slang een segment raakt, anders false
    */
    Snake.prototype.headHitsASegment = function() {
        var head = this.getHead();
        var segmentsWithoutHead = this.segments.slice(0,-1)
        return segmentsWithoutHead.some(function(element) {
            return head.collidesWithOneOf(element)
        });
    }

    /**
      @function removeAFood() -> // TODO Write comments
    */
    Snake.prototype.removeAFood = function() {
        var head = this.getHead();
        this.foods = this.foods.filter(function (element) { 
            return !head.collidesWithOneOf(element)}, this)
    }

    /**
      @function noFoodsLeft() -> boolean
      @desc Controleert of er nog voedsel over is
    */
    Snake.prototype.noFoodsLeft = function() {
        return this.foods.length == 0;
    }

    /**
      @function moveSnake(direction, snakeShouldGrow) -> void
      @desc Beweeg de slang in gegeven richting
      @param {string} direction de richting (een van de constanten UP, DOWN, LEFT of RIGHT)
      @param {boolean} snakeShouldGrow geeft aan of de slang moet groeien of niet
    */
    Snake.prototype.moveSnake = function(direction, snakeShouldGrow) {
        var head = this.getHead();
        head.color = SNAKE;
        this.segments.push(this.getNewHead(direction));
        if (!snakeShouldGrow) {
            this.segments.shift();
        }
    }

    
    /**
      @function getHead() -> element
      @desc Geeft het hoofd segment van de slang
      @return element met hoofd segment
    */
    Snake.prototype.getHead = function() {
        return this.segments[this.segments.length - 1];
    }
    
    /**
      @function doMove(direction) -> void
      @desc Laat de slang bewegen
      @param {string} direction de richting (een van de constanten UP, DOWN, LEFT of RIGHT)
    */
    Snake.prototype.doMove = function(direction) {
        if (this.headHitsAFood()) {
            this.removeAFood();
            this.moveSnake(direction, true)
        } else {
            this.moveSnake(direction, false);
        }
        if (this.noFoodsLeft()) {
            gewonnen = true;
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
      @function getNewHead(direction) -> element
      @desc Geeft heet nieuwe head element van de slang
      @param {string} direction de richting (een van de constanten UP, DOWN, LEFT of RIGHT)
      @return {Element} met straal R en color HEAD
    */
    Snake.prototype.getNewHead = function(direction) {
        var head = this.getHead()
        var newHead = createElement(head.x, head.y, HEAD);
        switch (direction) {
            case UP:
                newHead.y = head.y - STEP;
                break;
            case DOWN:
                newHead.y = head.y + STEP;
                break;
            case LEFT:
                newHead.x = head.x - STEP;
                break;
            case RIGHT:
                newHead.x = head.x + STEP;
                break;
        }
        return newHead;
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
    /**
      @function withinCanvas(direction) -> boolean
      @desc Gaat na of de snake tegen de randen van het canvas botsts
      @param {number} min een geheel getal als onderste grenswaarde
      @param {number} max een geheel getal als bovenste grenswaarde (max > min)
      @return {boolean} true als de slang binnen het canvas blijft, anders false
    */
    Element.prototype.withinCanvas = function(direction) {
        var result = true;
        switch(direction) {
            case LEFT:
                result = this.x - R >= XMIN;
                break;
            case RIGHT:
                result = this.x + R <= xMax;
                break;
            case UP: 
                result = this.y - R >= YMIN;
                break;
            case DOWN:
                result = this.y + R <= yMax;
                break;
            }
        return result;
    }

    /**
      @function collidesWithOneOf -> boolean
      @desc Gaat na of de snake tegen de randen van het canvas botsts
      @param {Element} element een element in het spel
      @return {boolean} true als de slang botst, anders false
    */
    Element.prototype.collidesWithOneOf = function (element) {
        return this.x == element.x && this.y == element.y;
    };

    /**
      @function createSegment(x,y) -> Element
      @desc Slangsegment creeren op een bepaalde plaats
      @param {number} x x-coordinaat middelpunt
      @param {number} y y-coordinaart middelpunt
      @return: {Element} met straal R en gegeven color
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

    /**
      @function startSnake() -> void
      @desc 
      @param {number} w de wijdte van het canvas
      @param {number} h de hoogte van het canvas 
    */
    function startSnake(w, h) {
        width = w;
        height = h;
        xMax = width - R;
        yMax = height - R;
        snake = createStartSnake();
        snake.createFoods();
    }

    /**
      @function getSnakeFoods() -> array met food
      @desc Geeft een array met de snake foods
    */
    function getSnakeFoods () {
        return snake.foods;
    }
    /**
      @function getSnakeSegments() -> array met segments
      @desc Geeft een array met de snake segments
    */
    function getSnakeSegments() {
        return snake.segments;
    }

    /**
      @function move(direction) -> void
      @desc Beweeg slang in aangegeven richting
        tenzij slang uit canvas zou verdwijnen  
      @param {string} direction de richting (een van de constanten UP, DOWN, LEFT of RIGHT)
    */
    function move(direction) {
        var result = false;
        if (snake.canMove(direction)) {
            snake.doMove(direction);
            result = true;
        }
        return result;
    }
    
    /**
      @function heeftGewonnen -> boolean
      @desc Geeft aan of er is gewonnen
      @return {boolean} true als er is gewonnen, anders false
    */
    function heeftGewonnen() {
        return gewonnen;
    }

    return {
        UP: UP,
        RIGHT: RIGHT,
        LEFT: LEFT,
        DOWN: DOWN,
        startSnake: startSnake,
        move: move,
        getSnakeFoods: getSnakeFoods,
        getSnakeSegments: getSnakeSegments,
        heeftGewonnen: heeftGewonnen
    }
})();