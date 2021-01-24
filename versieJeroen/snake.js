export var snakeModule;
(function (snakeModule) {
    var xMax, yMax, width, height, gewonnen = false;
    var R = 10, STEP = 2 * R, XMIN = R, YMIN = R, SNAKE = "DarkRed", FOOD = "Olive", HEAD = "DarkOrange", NUMFOODS = 5;
    snakeModule.UP = "up", snakeModule.LEFT = "left", snakeModule.RIGHT = "right", snakeModule.DOWN = "down";
    /**
@constructor Element
@param radius straal
@param {number} x x-coordinaat middelpunt
@param {number} y y-coordinaat middelpunt
@param {string} color kleur van het element
*/
    var Element = /** @class */ (function () {
        function Element(radius, x, y, color) {
            this.radius = radius;
            this.x = x;
            this.y = y;
            this.color = color;
        }
        Element.prototype.withinCanvas = function (direction) {
            var result = true;
            switch (direction) {
                case snakeModule.LEFT:
                    result = this.x - R >= XMIN;
                    break;
                case snakeModule.RIGHT:
                    result = this.x + R <= xMax;
                    break;
                case snakeModule.UP:
                    result = this.y - R >= YMIN;
                    break;
                case snakeModule.DOWN:
                    result = this.y + R <= yMax;
                    break;
            }
            return result;
        };
        Element.prototype.collidesWithOneOf = function (element) {
            return this.x == element.x && this.y == element.y;
        };
        ;
        return Element;
    }());
    snakeModule.Element = Element;
    /**
     @constructor Snake
    @param {[Element] segments een array met aaneengesloten slangsegmenten
        Het laatste element van segments wordt de kop van de slang
        */
    var Snake = /** @class */ (function () {
        function Snake(width, heigth) {
            this.startSnake(width, heigth);
            this.segments = this.createStartSnake();
            ;
            this.foods = this.createFoods();
            ;
        }
        Snake.prototype.startSnake = function (w, h) {
            width = w;
            height = h;
            xMax = width - R;
            yMax = height - R;
        };
        /**
@function createStartSnake() -> Snake
@desc Slang creëren, bestaande uit  twee segmenten,
in het midden van het veld
@return: slang volgens specificaties
*/
        Snake.prototype.createStartSnake = function () {
            return [this.createElement(R + width / 2, R + height / 2, SNAKE),
                this.createElement(R + width / 2, height / 2 - R, HEAD)];
        };
        Snake.prototype.canMove = function (direction) {
            var head = this.getHead();
            return !this.headHitsASegment() && head.withinCanvas(direction);
        };
        Snake.prototype.headHitsAFood = function () {
            var head = this.getHead();
            return this.foods.some(function (element) {
                return head.collidesWithOneOf(element);
            });
        };
        Snake.prototype.headHitsASegment = function () {
            var head = this.getHead();
            var segmentsWithoutHead = this.segments.slice(0, -1);
            return segmentsWithoutHead.some(function (element) {
                return head.collidesWithOneOf(element);
            });
        };
        Snake.prototype.removeAFood = function () {
            var head = this.getHead();
            this.foods = this.foods.filter(function (element) {
                return !head.collidesWithOneOf(element);
            }, this);
        };
        Snake.prototype.noFoodsLeft = function () {
            return this.foods.length == 0;
        };
        Snake.prototype.moveSnake = function (direction, snakeShouldGrow) {
            var head = this.getHead();
            head.color = SNAKE;
            this.segments.push(this.getNewHead(direction));
            if (!snakeShouldGrow) {
                this.segments.shift();
            }
        };
        Snake.prototype.getHead = function () {
            return this.segments[this.segments.length - 1];
        };
        Snake.prototype.doMove = function (direction) {
            if (this.headHitsAFood()) {
                this.removeAFood();
                this.moveSnake(direction, true);
            }
            else {
                this.moveSnake(direction, false);
            }
            if (this.noFoodsLeft()) {
                gewonnen = true;
            }
        };
        /**
         @function createFoods() -> array met food
        @desc [Element] array van random verdeelde voedselpartikelen
        @return [Element] array met food
        */
        Snake.prototype.createFoods = function () {
            var i = 0, food, foods = [];
            //we gebruiken een while omdat we, om een arraymethode te gebruiken, eerst een nieuw array zouden moeten creëren (met NUMFOODS elementen)
            while (i < NUMFOODS) {
                food = this.createElement(XMIN + this.getRandomInt(0, xMax), YMIN + this.getRandomInt(0, yMax), FOOD);
                if (!this.segments.some(food.collidesWithOneOf)) {
                    foods.push(food);
                    i++;
                }
            }
            return foods;
        };
        Snake.prototype.getNewHead = function (direction) {
            var head = this.getHead();
            var newHead = this.createElement(head.x, head.y, HEAD);
            switch (direction) {
                case snakeModule.UP:
                    newHead.y = head.y - STEP;
                    break;
                case snakeModule.DOWN:
                    newHead.y = head.y + STEP;
                    break;
                case snakeModule.LEFT:
                    newHead.x = head.x - STEP;
                    break;
                case snakeModule.RIGHT:
                    newHead.x = head.x + STEP;
                    break;
            }
            return newHead;
        };
        /**
     @function getRandomInt(min: number, max: number) -> number
    @desc Creeren van random geheel getal in het interval [min, max]
    @param {number} min een geheel getal als onderste grenswaarde
    @param {number} max een geheel getal als bovenste grenswaarde (max > min)
    @return {number} een random geheel getal x waarvoor geldt: min <= x <= max
    */
        Snake.prototype.getRandomInt = function (min, max) {
            return Math.round((Math.floor(Math.random() * (max - min + 1)) + min) / (width / STEP)) * (width / STEP);
        };
        /**
@function createSegment(x,y) -> Element
@desc Slangsegment creeren op een bepaalde plaats
@param {number} x x-coordinaat middelpunt
@param {number} y y-coordinaart middelpunt
@return: {Element} met straal R en color SNAKE
*/
        Snake.prototype.createElement = function (x, y, color) {
            return new Element(R, x, y, color);
        };
        Snake.prototype.getSnakeFoods = function () {
            return this.foods;
        };
        Snake.prototype.getSnakeSegments = function () {
            return this.segments;
        };
        Snake.prototype.heeftGewonnen = function () {
            return gewonnen;
        };
        Snake.prototype.move = function (direction) {
            var result = false;
            if (this.canMove(direction)) {
                this.doMove(direction);
                result = true;
            }
            return result;
        };
        return Snake;
    }());
    snakeModule.Snake = Snake;
})(snakeModule || (snakeModule = {}));
