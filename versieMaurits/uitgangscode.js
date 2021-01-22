/*jslint devel: true */
/*global jQuery, document */
'use strict'; // TODO Check foutmelding

const R        = 10,          // straal van een element
      STEP     = 2*R,         // stapgrootte
                              // er moet gelden: WIDTH = HEIGHT
      LEFT     = "left",      // bewegingsrichtingen 
      RIGHT    = "right",
      UP       = "up",
      DOWN     = "down",

      NUMFOODS = 5,          // aantal voedselelementen       

      XMIN     = R,           // minimale x waarde 
      YMIN     = R,           // minimale y waarde 
	  
      SLEEPTIME = 500,        // aantal milliseconde voor de timer

      SNAKE   = "DarkRed" ,   // kleur van een slangsegment
      FOOD    = "Olive",       // kleur van voedsel
      HEAD    = "DarkOrange",   // kleur van de kop van de slang
      
      SCALE = 10
	
 var
        snake,
        foods = [],               // voedsel voor de slang
        width,                    // breedte van het tekenveld
        height,                   // hoogte van het tekenveld
        xMax,                     // maximale waarde van x = width - R
        yMax,                     // maximale waarde van y = height - R
        canvas,                
        direction = UP,
        canvas,
        ctx,
        rows,
        columns,
        snakeHeadX,
        snakeHeadY;
	
$(document).ready(function() {
	$("#startSnake").click(init);  
	$("#stopSnake").click(stop);
});

/**
  @function init() -> void
  @desc Haal eventueel bestaand voedsel en een bestaande slang weg, cre\"eer een slang, genereer voedsel, en teken alles
*/
function init() {	
  //canvas = $("#mySnakeCanvas").clearCanvas();
  canvas = $("#mySnakeCanvas");
  ctx = canvas[0].getContext("2d");
  width = canvas[0].width;
  height = canvas[0].height;
  rows = canvas.height / SCALE;
  columns = canvas.width / SCALE;
  xMax = width - R;
  yMax = height - R;
  createStartSnake();
  createFoods();
  snakeTimer();
  draw();	
}

function stop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}
/**
  @function move(direction) -> void
  @desc Beweeg slang in aangegeven richting
        tenzij slang uit canvas zou verdwijnen  
  @param   {string} direction de richting (een van de constanten UP, DOWN, LEFT of RIGHT)
*/
function move(direction) {
    if (snake.canMove(direction)) {
		snake.doMove(direction);
		draw();
	}
	else {
		console.log("snake cannot move " + direction);
	}
}

/**
  @function draw() -> void
  @desc Teken de slang en het voedsel
*/
function draw() {
	var canvas = $("#mySnakeCanvas").clearCanvas();
	snake.segments.forEach(function (segment) {
    drawElement(segment, canvas);
  });
  foods.forEach(function (food) {
    drawElement(food, canvas);
  });
}

/***************************************************************************
 **                 Constructors                                          **
 ***************************************************************************/
/**
   @constructor Snake
   @param {[Element] segments een array met aaneengesloten slangsegmenten
                   Het laatste element van segments wordt de kop van de slang 
*/ 
function Snake(segments) {
  this.segments = segments;
  //console.log(this.segments + ": segments in constructor");
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

Element.prototype.collidesWithOneOf = function (elements) {
  var collides = false;
  return collides;
 
  //return elements.some(function(thing) {
    //return thing.collidesWithOneOf(this);
  //})
}
/***************************************************************************
 **                 Hulpfuncties                                          **
 ***************************************************************************/
 
/**
  @function createStartSnake() -> Snake
  @desc Slang creëren, bestaande uit  twee segmenten, 
        in het midden van het veld
  @return: slang volgens specificaties
*/
function createStartSnake() {
	var segments   = [createSegment(R + width/2, R + height/2), 
                    createHeadSegment(R + width/2, height/2 - R)];
    snake = new Snake(segments);  
}
/**
  @function createSegment(x,y) -> Element
  @desc Slangsegment creeren op een bepaalde plaats
  @param {number} x x-coordinaat middelpunt
  @param {number} y y-coordinaart middelpunt
  @return: {Element} met straal R en color SNAKE
*/
function createSegment(x, y) {
	return new Element(R, x, y, SNAKE);
}

function createHeadSegment(x,y) {
  headPosition(x,y);
  return new Element(R, x, y, HEAD);
}
/**
  @function createFood(x,y) -> Element
  @desc Voedselelement creeren op een bepaalde plaats
  @param {number} x x-coordinaat middelpunt
  @param {number} y y-coordinaart middelpunt
  @return: {Element} met straal R en color FOOD
*/
function createFood(x, y) {
	return new Element(R, x, y, FOOD);
}
/**
  @function drawElement(element, canvas) -> void
  @desc Een element tekenen 
  @param {Element} element een Element object
  @param  {dom object} canvas het tekenveld
*/
 function drawElement(element, canvas) {
	canvas.drawArc({
		draggable : false,
		fillStyle : element.color,
		x : element.x,
		y : element.y,
		radius : element.radius
	});
}

/**
  @function getRandomInt(min: number, max: number) -> number
  @desc Creeren van random geheel getal in het interval [min, max] 
  @param {number} min een geheel getal als onderste grenswaarde
  @param {number} max een geheel getal als bovenste grenswaarde (max > min)
  @return {number} een random geheel getal x waarvoor geldt: min <= x <= max
*/
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
  @function createFoods() -> array met food
  @desc [Element] array van random verdeelde voedselpartikelen
  @return [Element] array met food
*/
function createFoods() {   
   var  i = 0,    
        food;
   //we gebruiken een while omdat we, om een arraymethode te gebruiken, eerst een nieuw array zouden moeten creëren (met NUMFOODS elementen)
   while (i < NUMFOODS ) {
     food = createFood(XMIN + getRandomInt(0, xMax), YMIN + getRandomInt(0, yMax));
     if (!food.collidesWithOneOf(snake.segments) && !food.collidesWithOneOf(foods) ) {
       foods.push(food);
       i++
     }
   }  
}

function snakeTimer() {
  setInterval(function() {
    move(direction);}, SLEEPTIME);
}

function headPosition(x, y) {
  snakeHeadX = x;
  snakeHeadY = y;
}

Snake.prototype.canMove = function(direction) {
  var result = false;
    switch(direction) {
      case LEFT:
        result = snakeHeadX - R >= XMIN;
        break;
      case RIGHT:
        result = snakeHeadX + R <= xMax;
        break;
      case UP: 
        result = snakeHeadY - R >= YMIN;
        break;
      case DOWN:
        result = snakeHeadY + R <= yMax;
        break;
    }
    return result;
}

Snake.prototype.doMove = function (direction) {
  changeOldSnake();
  switch(direction) {
    case UP:
      snake.segments.push(createHeadSegment(snakeHeadX, snakeHeadY - STEP));
      break;
    case DOWN:
      snake.segments.push(createHeadSegment(snakeHeadX, snakeHeadY + STEP));
      break;
    case LEFT: 
      snake.segments.push(createHeadSegment(snakeHeadX - STEP, snakeHeadY));
      break;
    case RIGHT: 
      snake.segments.push(createHeadSegment(snakeHeadX + STEP, snakeHeadY));
      break;
  }
  //checkCollides();
}

function changeOldSnake() {
  snake.segments.shift(); // deleting last segment of the snake
  snake.segments[length].color = SNAKE; // color the old head 
}

function checkCollides() {
  var foodLeft = NUMFOODS;
  if(snakeHeadX.collidesWithOneOf(foods)) {
    snake.segments.splice(0, createSegment(x, y));
    foodLeft--;
  }
  if(snakeHeadX.collidesWithOneOf(snake.segments)) {
    lostGame();
  }
  if (foodLeft == 0) {
    winGame();
  }
}

function lostGame() {
  console.alert("VERLOREN!!!")
}

function winGame() {
  console.alert("GEWONNEN!!!");
}

$(document).keydown(function(e) {
  switch(e.which) {
    case 37: 
      direction = LEFT;
      break;
    case 38: 
      direction = UP;
      break;
    case 39: 
      direction = RIGHT;  
      break;
    case 40: 
      direction = DOWN;
      break;
  }
})