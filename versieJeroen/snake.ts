export module snakeModule {
    let xMax: number,                     
        yMax: number,
        width: number,         
        height: number,
        gewonnen: boolean = false; 
    const 
        R: number = 10, 
        STEP: number = 2 * R,    
        XMIN: number = R,         
        YMIN: number = R,
        SNAKE: string = "DarkRed", 
        FOOD: string = "Olive",    
        HEAD: string = "DarkOrange", 
        NUMFOODS: number = 5;

    export const UP: string = "up",
                 LEFT: string = "left",   
                 RIGHT: string = "right",
                 DOWN: string = "down"

                /**
     @constructor Element
    @param radius straal
    @param {number} x x-coordinaat middelpunt
    @param {number} y y-coordinaat middelpunt
    @param {string} color kleur van het element
    */
   export class Element {
    radius: number;
    x: number;
    y: number;
    color: string;

 constructor(radius: number, x: number, y: number, color: string) {
     this.radius = radius;
     this.x = x;
     this.y = y;
     this.color = color;
     }

 withinCanvas(direction: string) {
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

 collidesWithOneOf(element: Element) {
     return this.x == element.x && this.y == element.y;
 };
}
/**
 @constructor Snake
@param {[Element] segments een array met aaneengesloten slangsegmenten
    Het laatste element van segments wordt de kop van de slang 
    */
    export class Snake {
        segments: Element[];
        foods: Element[];

        constructor(width: number, heigth: number) {
            this.startSnake(width, heigth);
            this.segments = this.createStartSnake();;
            this.foods = this.createFoods();;
        }

        startSnake(w: number, h: number) {
            width = w;
            height = h;
            xMax = width - R;
            yMax = height - R;
        }

                        /**
         @function createStartSnake() -> Snake
        @desc Slang creëren, bestaande uit  twee segmenten, 
                in het midden van het veld
        @return: slang volgens specificaties
        */
        createStartSnake() {
        return [this.createElement(R + width / 2, R + height / 2, SNAKE), 
                            this.createElement(R + width / 2, height / 2 - R, HEAD)];
        }

        canMove(direction: string) {
            var head = this.getHead();
            return !this.headHitsASegment() && head.withinCanvas(direction);
        }

        headHitsAFood() {
            var head = this.getHead();
            return this.foods.some(function(element) {
                return head.collidesWithOneOf(element);
            })
        }

    headHitsASegment() {
        var head = this.getHead();
        var segmentsWithoutHead = this.segments.slice(0,-1)
        return segmentsWithoutHead.some(function(element) {
            return head.collidesWithOneOf(element)
        });
    }

    removeAFood() {
        var head = this.getHead();
        this.foods = this.foods.filter(function (element) { 
            return !head.collidesWithOneOf(element)}, this)
    }

    noFoodsLeft() {
        return this.foods.length == 0;
    }

    moveSnake(direction: string, snakeShouldGrow: boolean) {
        var head = this.getHead();
        head.color = SNAKE;
        this.segments.push(this.getNewHead(direction));
        if (!snakeShouldGrow) {
            this.segments.shift();
        }
    }

    getHead() {
        return this.segments[this.segments.length - 1];
    }
    
    doMove(direction: string) {
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
    createFoods(): Element[] {
        var i: number = 0,
            food: Element,
            foods: Element[] = [];
    //we gebruiken een while omdat we, om een arraymethode te gebruiken, eerst een nieuw array zouden moeten creëren (met NUMFOODS elementen)
        while (i < NUMFOODS) {
            food = this.createElement(XMIN + this.getRandomInt(0, xMax), YMIN + this.getRandomInt(0, yMax), FOOD);
            if (!this.segments.some(food.collidesWithOneOf) && !foods.some(food.collidesWithOneOf)) {
                foods.push(food);
                i++;
            }
        }
        return foods;
    }

    getNewHead(direction: string): Element {
        var head = this.getHead()
        var newHead = this.createElement(head.x, head.y, HEAD);
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
    getRandomInt(min: number, max: number): number {
        return Math.round((Math.floor(Math.random() * (max - min + 1)) + min) / (width/STEP)) * (width/STEP);
    }

                /**
     @function createSegment(x,y) -> Element
    @desc Slangsegment creeren op een bepaalde plaats
    @param {number} x x-coordinaat middelpunt
    @param {number} y y-coordinaart middelpunt
    @return: {Element} met straal R en color SNAKE
    */
    createElement(x: number, y: number, color: string): Element  {
        return new Element(R, x, y, color);
    }

    getSnakeFoods (): Element[] {
        return this.foods;
    }
    
    getSnakeSegments(): Element[] {
        return this.segments;
    }
    
    heeftGewonnen(): boolean {
        return gewonnen;
    }
    
    move(direction: string): boolean {
        var result = false;
        if (this.canMove(direction)) {
            this.doMove(direction);
            result = true;
        }
        return result;
    }
}
}