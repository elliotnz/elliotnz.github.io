function Thing(board, x, y) {
  this.board = board;
  this.x = x;
  this.y = y;

  this.turn = function() {}

}

function getCursorPosition(e) {
  e = e || window.event;
  var cursor = {x:0, y:0};
  if (e.pageX || e.pageY) {
    cursor.x = e.pageX - 15;
    cursor.y = e.pageY - 15;
  } else {
    cursor.x = e.clientX +
    (document.documentElement.scrollLeft ||
      document.body.scrollLeft) -
      document.documentElement.clientLeft;
      cursor.y = e.clientY +
      (document.documentElement.scrollTop ||
        document.body.scrollTop) -
        document.documentElement.clientTop;
  }
  return cursor;
}

function Position(x, y) {
  this.x = x;
  this.y = y;

  this.subtract = function(v) {
    return new Vector(this.x - v.x, this.y - v.y)
  }

  this.add = function(v) {
    return new Vector(this.x + v.x, this.y + v.y)
  }

}

function Vector(x,y) {
  this.x = x;
  this.y = y;

  this.length = function() {
    return Math.sqrt(x*x + y*y)
  }

  // dot product
  this.dot = function(to) {
    return (this.x * to.x + this.y * to.y);
  }

  this.subtract = function(v) {
    return new Vector(this.x - v.x, this.y - v.y)
  }

  this.add = function(v) {
    return new Vector(this.x + v.x, this.y + v.y)
  }

  this.multiply = function(num) {
    return new Vector(this.x * num, this.y * num)
  }

  this.normalize = function() {
    var vlen = this.length();
    return new Vector(this.x / vlen, this.y / vlen);
  }

  this.getDirection = function() {

    var p1 = {
      x: 0,
      y: 0
    };
    var p2 = {
      x: this.x,
      y: this.y
    };
    // angle in degrees
    // y is p1 - p2 as y = 0 is top of screen
    var angleDeg = Math.atan2(p2.x - p1.x, p2.y - p1.y) * 180 / Math.PI;
    return angleDeg
  }


  // What is the meaning of the value returned by the dot product?
  // The value is the cosine of the angle between the two input vectors, multiplied
  // by the lengths of those vectors. So, you can easily calculate the cosine of the
  // angle by either, making sure that your two vectors are both of length 1, or dividing
  // the dot product by the lengths.
  // Cos(theta) = DotProduct(v1,v2) / (length(v1) * length(v2))
}

function Circle(x, y, radius, colour, board) {
  this.x = x;
  this.y = y;
  this.radius = radius;
  this.colour = colour;
  this.board = board;
  this.selected = false;
  this.power = 0;
  this.lastPositions = [];
  this.direction = null;
  this.mass = radius * 3;


  this.position = function() {
    var p = new Position(this.x, this.y);
    return p;
  }

  this.vector = function() {
    var radians = this.direction * (Math.PI / 180.0); // degrees

    var movingX = this.power * Math.sin(radians);
    var movingY = this.power * Math.cos(radians);

    var v = new Vector(movingX, movingY)
    return v;
  }

  this.velocity = function() {
    return this.vector().multiply(this.power);
  }

  this.setVelocity = function(newVelocity) {
    this.direction = newVelocity.getDirection();
    this.power = newVelocity.length()
  }

  this.getDirection = function(x1, y1, x2, y2) {
    var p1 = {
      x: x1,
      y: y1
    };
    var p2 = {
      x: x2,
      y: y2
    };
    // angle in degrees
    // y is p1 - p2 as y = 0 is top of screen
    var angleDeg = Math.atan2(p2.x - p1.x, p2.y - p1.y) * 180 / Math.PI;
    return angleDeg
  }

  this.draw = function() {
    this.board.context.beginPath();
    this.board.context.fillStyle = this.isSelected() ? 'blue' : colour;
    this.board.context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    this.board.context.fill();
    this.board.context.stroke();
  }

  this.turn = function() {
    if (this.power > 0) {
      this.power *= 0.95;
    }

    if (this.power < 0.1) {
      this.power = 0;
      this.direction = null;
    }
    if (this.power > 0) {
      var BORDER = this.radius
      var radians = this.direction * (Math.PI / 180.0); // degrees

      this.x += this.power * Math.sin(radians);
      this.y += this.power * Math.cos(radians);

      if (this.x < BORDER) {
        if (this.direction < 270) {
          this.direction = 90 + (270 - this.direction) % 360;
        } else {
          this.direction = (90 - (this.direction - 270)) % 360;
        }
        this.x = BORDER;
      }

      if (this.x > (this.board.width - BORDER)) {
        if (this.direction < 90) {
          this.direction = 270 + (90 - this.direction) % 360
        } else {
          this.direction = 270 + (90 - this.direction) % 360
        }
        this.x = this.board.width - BORDER;
      }

      if (this.y < BORDER) {
        if (this.direction < 180) {
          this.direction = (180 - this.direction) % 360;
        } else {
          this.direction = 360 - (this.direction - 180) % 360;
        }
        this.y = BORDER;
      }

      if (this.y > (this.board.height - BORDER)) {
        if (this.direction < 90) {
          this.direction = 90 + (90 - this.direction) % 360;
        } else {
          this.direction = 180 + (360 - this.direction) % 360
        }
        this.y = this.board.height - BORDER;
      }
    }
  }

  this.isInside = function(x,y) {
    var cx = Math.abs(this.x - x)
    var cy = Math.abs(this.y - y)
    var zs = Math.pow(cx, 2) + Math.pow(cy, 2)
    var z = Math.sqrt(zs)
    if (z <= this.radius) {
      return true;
    } else {
      return false;
    }
  }

  this.moveTo = function(x, y) {
    //father:

    this.lastPositions.push({x: this.x, y: this.y})
    if (this.lastPositions.length > 20) {
      this.lastPositions.shift(); // remove first element
    }
    var cx = x - this.x;
    var cy = y - this.y;
    this.x += cx * .5
    this.y += cy * .5
    if ((this.x === x) && (this.y === y)) {
      this.power = 0;
    }

    //son:

    // setTimeout(function(obj) {
    //   obj.x = x;
    //   obj.y = y;
    // }, 200, this)
  }

  this.isSelected = function() {
    return this.selected;
  }

  this.drop = function() {
    this.selected = false;
    if (this.lastPositions.length > 3) {
      var lastX = this.lastPositions[this.lastPositions.length - 1].x
      var lastY = this.lastPositions[this.lastPositions.length - 1].y
      this.power = 0.89 * (Math.abs(lastX - this.x) + Math.abs(lastY - this.y)); // to do - this should be higher if mouse moving faster
      this.direction = this.getDirection(lastX, lastY, this.x, this.y)
    }
    this.lastPositions = [];
  }

  this.setSelected = function(x, y) {
    this.x = x;
    this.y = y;
    this.lastPositions = [];
    this.selected = true;
  }

  this.colliding = function(ball) {
    if (this === ball)
      return false;

    xd = this.x - ball.x;
    yd = this.y - ball.y;

    sumRadius = this.radius + ball.radius;
    sqrRadius = sumRadius * sumRadius;

    distSqr = (xd * xd) + (yd * yd);

    if (distSqr <= sqrRadius) {
      return true;
    }
    return false;
  }

  this.bounce = function(ball) {
    // get the mtd

    //Vector2d delta = (position.subtract(ball.position));
    var delta = this.position().subtract(ball.position())
    var d = delta.length();
    // minimum translation distance to push balls apart after intersecting
    var mtd = delta.multiply(((this.radius + ball.radius) - d) / d); //Vector2d


    // resolve intersection --
    // inverse mass quantities
    var im1 = 1.0 / this.mass;
    var im2 = 1.0 / ball.mass;

    // push-pull them apart based off their mass
    var newPosition = this.position().add(mtd.multiply(im1 / (im1 + im2)));
    this.x = newPosition.x;
    this.y = newPosition.y;
    var newBallPosition = ball.position().subtract(mtd.multiply(im2 / (im1 + im2)));
    ball.x = newBallPosition.x;
    ball.y = newBallPosition.y;

    // impact speed
    v = (this.velocity().subtract(ball.velocity()));
    vn = v.dot(mtd.normalize());

    // sphere intersecting but moving away from each other already
    if (vn > 0.0) return;

    var restitution = 0.8; //This defines how much a ball bounces once it hits the floor or another ball.
    // collision impulse
    i = (-(1.0 + restitution) * vn) / (im1 + im2);
    var impulse = mtd.multiply(i); //Vector2d

    // change in momentum
    this.setVelocity(this.velocity().add(impulse.multiply(im1)));
    ball.setVelocity(ball.velocity().subtract(impulse.multiply(im2)));

  }
}

Circle.prototype = new Thing()

function Board(width, height, canvas) {
  this.context = canvas;
  this.width = width;
  this.height = height;
  this.context.canvas.width = width;
  this.context.canvas.height = height;
  this.context.canvas.style.width = '' + width  + 'px';
  this.context.canvas.style.height = '' + height + 'px';
  this.circles = []

  this.drawCells = function() {
    this.clearBoard()
    for (var i = 0; i < this.circles.length; i++) {
      this.circles[i].draw()
    }
  }

  this.clearBoard = function() {
    this.context.clearRect(0, 0, this.width, this.height)
  }

  this.add = function(thing) {
    this.circles.push(thing);
  }

  this.clicked = function(x,y) {
    for (var i = 0; i < this.circles.length; i++) {
      var obj = this.circles[i];
      if (obj.isInside(x,y)) {
        obj.setSelected(x, y);
      }
    }
  }

  this.mouseUp = function(x,y) {
    for (var i = 0; i < this.circles.length; i++) {
      var obj = this.circles[i];
      if (obj.isSelected()) {
        obj.drop();
      }
    }
  }

  this.mouseMoved = function(x,y) {
    for (var i = 0; i < this.circles.length; i++) {
      var obj = this.circles[i];
      if (obj.isSelected()) {
        obj.moveTo(x,y);
      }
    }
  }

  this.turn = function() {
    for (i = 0; i < this.circles.length; i++) {
      this.circles[i].turn();
    }
    this.detectCollision();
  }

  this.detectCollision = function() {
    for (i = 0; i < this.circles.length; i++) {
      for (j = 0; j < this.circles.length; j++) {
        if (this.circles[i].colliding(this.circles[j])) {
          this.circles[i].bounce(this.circles[j])
        }
      }
    }
  }
}

var board = null;

var start = function() {
  var canvas = document.getElementById("myCanvas");
  var context = canvas.getContext("2d");

  board = new Board(1000, 500, context);

  var circle = new Circle(50, 50, 15, "green", board);
  var circle2 = new Circle(150, 150, 17, "blue", board);
  var circle3 = new Circle(105, 273, 14, "orange", board);

  board.add(circle);
  board.add(circle2);
  board.add(circle3);
  board.add(new Circle(285, 273, 30, "orange", board))

  document.onmousedown = function(e) {
    cursor = getCursorPosition();
    board.clicked(cursor.x, cursor.y)
  }
  document.onmousemove = function(e) {
    cursor = getCursorPosition();
    board.mouseMoved(cursor.x, cursor.y)
  }
  document.onmouseup = function(e) {
    cursor = getCursorPosition();
    board.mouseUp(cursor.x, cursor.y)
  }

  setInterval(function() {
    board.clearBoard();
    board.turn()
    board.drawCells()

  }, 1000 / 60)
}
