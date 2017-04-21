var canvas = document.getElementById('game');
var canvasWidth = canvas.getAttribute('width');
var canvasHeight = canvas.getAttribute('height');
var ctx = canvas.getContext('2d');

var CELL_SIZE = 10;
var GAME_SPEED = 60; // in ms, lower number is faster

var food = createFood();
var snake = new Snake(5);
snake.spawn();

// Game clock
setInterval(function paintGame() {
  clearCanvas();

  snake.move();
  snake.paint();

  paintCell(food.color, food.x, food.y);
}, GAME_SPEED);

// Paints the canvas white, used to erase previous frames
function clearCanvas() {
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
}

// Paints a cell on canvas based on the provided
// color, x cell coordinate, and y cell coordinate
function paintCell(color, x, y) {
  ctx.fillStyle = color;
  ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
}

// Defines a snake object, which accepts a size parameter
// to set its starting length
function Snake(size) {
  this.size = size || 3;
  this.body = [];

  this.xSpeed = null;
  this.ySpeed = null;

  // Defines defaults and constructs base snake
  this.spawn = function () {
    this.body = [];
    this.xSpeed = null;
    this.ySpeed = null;
    this.right();

    // builds body based on size
    for (var i = this.size; i >= 0; i--) {
      this.body.push({
        x: i,
        y: 0
      });
    }
  }

  // Turn snake left, if not going right
  this.left = function () {
    if (this.xSpeed !== 1) {
      this.xSpeed = -1;
      this.ySpeed = 0;
    }
  }

  // Turn snake up, if not going down
  this.up = function () {
    if (this.ySpeed !== 1) {
      this.xSpeed = 0;
      this.ySpeed = -1;
    }
  }

  // Turn snake right, if not going left
  this.right = function () {
    if (this.xSpeed !== -1) {
      this.xSpeed = 1;
      this.ySpeed = 0;
    }
  }

  // Turn snake down, if not going up
  this.down = function () {
    if (this.ySpeed !== -1) {
      this.xSpeed = 0;
      this.ySpeed = 1;
    }
  }

  // Returns whether the provided cell coordinates 
  // hit the snake's body
  this.hasHitBody = function (x, y) {
    return this.body.some(function (bodyPart) {
      return x === bodyPart.x && y === bodyPart.y;
    });
  }

  // Handles moving of the snake based on speed, collision
  // detection for triggering respawns, and eating food
  this.move = function () {
    // Grab tail and set to new head position based on speed 
    var head = this.body[0];
    var newHead = this.body.pop();
    newHead.x = head.x + this.xSpeed;
    newHead.y = head.y + this.ySpeed;

    // Respawn when hitting wall or own body
    if (hasHitWall(newHead.x, newHead.y)
      || this.hasHitBody(newHead.x, newHead.y)) {
      this.spawn();
      return; // stop execution of move and leave function
    }

    // Add new head to front of body
    this.body.unshift(newHead);

    // Add eaten food to body and spawn new food
    if (head.x === food.x && head.y === food.y) {
      this.body.push(food);
      food = createFood();
    }
  }

  // Paints the body of the snake
  this.paint = function () {
    this.body.forEach(function (bodyPart) {
      paintCell('green', bodyPart.x, bodyPart.y);
    });
  }
}

// Returns whether the provided cell coordinates have hit a wall
function hasHitWall(x, y) {
  var max_x_cell = canvasWidth / CELL_SIZE;
  var max_y_cell = canvasHeight / CELL_SIZE;

  return x >= max_x_cell || x < 0 || y >= max_y_cell || y < 0;
}

// Defines the key listener for moving the snake
document.addEventListener('keydown', function(e) {
  var keyCode = e.keyCode;
  if (keyCode === 37) { // left arrow
    e.preventDefault();
    snake.left();
  } else if (keyCode === 38) { // up arrow
    e.preventDefault();
    snake.up();
  } else if (keyCode === 39) { // right arrow
    e.preventDefault();
    snake.right();
  } else if (keyCode === 40) { // down arrow
    e.preventDefault();
    snake.down();
  }
});

// Returns a food object, which contains x and y coordinates
function createFood() {
  var x = Math.floor((Math.random() * canvasWidth)/CELL_SIZE);
  var y = Math.floor((Math.random() * canvasHeight)/CELL_SIZE);

  return {
    color: 'red',
    x: x,
    y: y
  };
}
