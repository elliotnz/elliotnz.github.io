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

function Circle(x, y, radius, colour, board) {
  this.x = x;
  this.y = y;
  this.radius = radius;
  this.colour = colour;
  this.board = board;
  this.selected = false;
  this.power = 0;
  this.lastPositions = [];
  this.directionX = 0;
  this.directionY = 0;

  this.draw = function() {
    this.board.context.beginPath();
    this.board.context.fillStyle = this.isSelected() ? 'blue' : colour;
    this.board.context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    this.board.context.fill();
    this.board.context.stroke();
  }

  this.turn = function() {
    if (this.directionX !== 0 || this.directionY !== 0) {
      this.power *= 0.8;
    }
    if (this.directionX !== 0) {
      this.x += (this.directionX / 10.0)
    }
    if (this.directionY !== 0) {
      this.y += (this.directionY / 10.0)
    }
    if (this.power < 0.01) {
      this.directionX = 0;
      this.directionY = 0;
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

  // this.canMoveTo = function() {
  //   for (var i = 0; i < this.board.circles.length; i++) {
  //     var obj = this.board.circles[i];
  //     var cx = Math.abs(obj.x - x)
  //     var cy = Math.abs(obj.y - y)
  //     var zs = Math.pow(cx, 2) + Math.pow(cy, 2)
  //     var z = Math.sqrt(zs)
  //     if (z + 1 <= obj.radius) {
  //       return false;
  //     } else {
  //       return true;
  //     }
  //     if ((x !== obj.x) && (y !== obj.y)) {
  //       return true;
  //     } else {
  //       return false;
  //     }
  //   }
  // }

  this.moveTo = function(x, y) {
    //father:

    this.lastPositions.push({x: x, y: y})
    if (this.lastPositions.length > 10) {
      this.lastPositions.shift(); // remove first element
    }

    var cx = x - this.x;
    var cy = y - this.y;
    this.x += cx * .5
    this.y += cy * .5
    //this.power = Math.abs(x - this.x)
    this.power = 0;

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
    this.power = 100; // todo - this should be higher if mouse moving faster
    this.directionX = this.lastPositions[this.lastPositions.length - 1].x - this.x;
    this.directionY = this.lastPositions[this.lastPositions.length - 1].y - this.y;

  }

  this.setSelected = function(x, y) {
    this.x = x;
    this.y = y;
    this.selected = true;
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
        //obj.mouseSelected = true;
        obj.setSelected(x, y);
      }
    }
  }

  this.mouseUp = function(x,y) {
    for (var i = 0; i < this.circles.length; i++) {
      var obj = this.circles[i];
      if (obj.isSelected()) {
        //obj.mouseSelected = false;
        obj.drop();
      }
    }
  }
  this.mouseMoved = function(x,y) {
    for (var i = 0; i < this.circles.length; i++) {
      var obj = this.circles[i];
      if (obj.isSelected()) {
        //obj.mouseSelected = false;
        obj.moveTo(x,y);
      }
    }
  }

  this.turn = function() {
    for (i = 0; i < this.circles.length; i++) {
      this.circles[i].turn()
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
