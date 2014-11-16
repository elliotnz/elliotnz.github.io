function Thing(board, x, y) {
  this.x = x;
  this.y = y;
  this.board = board;
  this.vForce = null;
  this.xChange = 0;

  this.turn = function() {}

}
function Man(board, x, y, height, width) {
  this.x = x;
  this.y = y;
  this.colour = "blue";
  this.board = board;
  this.lineAbove = false;
  this.lineBelow = false;
  this.height = height;
  this.width = width;
  this.step = 1;

  this.draw = function() {
    this.board.context.fillStyle = "blue";
    this.board.context.fillRect(this.x, this.y, this.width, this.height)
  }


  this.canMoveUp = function() {
    return (!this.board.isBlocked(this.x, this.y - 1)
     && !this.board.isBlocked(this.x + this.width, this.y + this.height)
     && !this.board.isBlocked(this.x, this.y + this.height / 2)
     && !this.board.isBlocked(this.x + this.width, this.y + this.height / 2))
  }

  this.falling = function() {
    return !this.onGround()
    //return (!this.board.isBlocked(this.x, this.y + this.height + 1) && (!this.board.isBlocked(this.x + this.width + 1, this.y + this.height + 1)))
  }

  this.onGround = function() {
    return (this.board.isBlocked(this.x, this.y + this.height + 1) || (this.board.isBlocked(this.x + this.width, this.y + this.height + 1)))
  }

  this.againstLeftLine = function() {
    return (this.board.isBlocked(this.x - 1, this.y) ||
      this.board.isBlocked(this.x - 1, this.y + this.height) ||
      this.board.isBlocked(this.x - 1, this.y + this.height / 2));
  }

  this.againstRightLine = function() {
    return (this.board.isBlocked(this.x + this.width + 1, this.y) ||
      this.board.isBlocked(this.x + this.width + 1, this.y + this.height) ||
      this.board.isBlocked(this.x + this.width + 1, this.y + this.height / 2));
  }

  this.turn = function() {
    // look above us
    if (this.vForce > 0 && this.canMoveUp()) {
      // move to the positon unless we hit something first
      var pointsToMove = Math.round(this.vForce * .3);
      for (var i = 0; i < pointsToMove; i++) {
        if (this.canMoveUp()) {
          this.y -= 1;
        } else {
          this.vForce = null;
        }
      }
      this.vForce -= 1;
    } else if (this.falling()) {
      // if we are falling
      if (this.vForce === null);
        this.vForce = 0;
      this.vForce += 1;
      var pointsToMove = Math.round(this.vForce * .7);
      for (var i = 0; i < pointsToMove; i += 1) {
        if (this.falling()) {
          this.y += 1;
        } else {
          this.vForce = null;
        }
      }

    } else {
      this.vForce = null;
    }
    if ((this.xChange < 0 && !this.againstLeftLine()) ||
       (this.xChange > 0 && !this.againstRightLine())) {
       this.x += this.xChange * this.step;
    }
    this.xChange = 0;
  }
  this.jump = function() {
    if (this.vForce == null)
      this.vForce = 15;
  }

  this.moveleft = function() {
      this.xChange = -1;
  }
  this.moveright = function() {
     this.xChange = 1;
  }
}
Man.prototype = new Thing()

function Line(board, x, y, width, height) {
  this.board = board
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;

  this.draw = function() {
    this.board.context.fillStyle = "black";
    this.board.context.fillRect(this.x, this.y, this.width, this.height)
  }
}

Line.prototype = new Thing()

function Board(width, height, pixelWidth, context) {
  this.width = width;
  this.height = height;
  this.pixelWidth = pixelWidth;
  this.context = context;
  this.things = new Array()
  this.context.canvas.width = width;
  this.context.canvas.height = height;
  this.context.canvas.style.width = '' + (width * pixelWidth)  + 'px';
  this.context.canvas.style.height = '' + (height * pixelWidth) + 'px';
  this.keyMap = [];
  this.man = null;
  this.lines = [];

  this.add = function(thing) {
    this.things.push(thing);
  }
  this.addMan = function(man) {
    this.man = man;
  }
  this.addLines = function(line) {
    this.lines.push(line);
    this.add(line);
  }
  this.drawCells = function() {
    this.clearBoard()
    for (i = 0; i< this.things.length; i++) {
      this.things[i].draw()
    }
  }
  this.clearBoard = function() {
    this.context.clearRect(0, 0, this.width, this.height)
  }

  this.isBlocked = function(x, y) {
    for (var i = 0; i < this.lines.length; i++) {
      if ((x >= this.lines[i].x && x <= (this.lines[i].x + this.lines[i].width)) &&
        (y >= this.lines[i].y && y <= (this.lines[i].y + this.lines[i].height))) {
        return true
      }
    }
    return false;
  }

  this.turn = function() {
    for (var i = 0; i< this.things.length; i++) {
      this.things[i].turn()
    }
    if (this.keyMap['38']) {
      this.man.jump();
    }
    if (this.keyMap['37']) {
      this.man.moveleft();
    }
    if (this.keyMap['39']) {
      this.man.moveright();
    }
  }

  this.keyUpDown = function(e){
    e = e || event; // to deal with IE
    board.keyMap[e.keyCode] = e.type == 'keydown';
  }
}

var board = null;

var start = function() {
  var canvas = document.getElementById("myCanvas");
  var context = canvas.getContext("2d");

  board = new Board(200, 200, 1, context);

  var line = new Line(board, board.width / 2 - 15, board.height - 20, 25, 5)
  var line2 = new Line(board, board.width / 2 - 5, board.height - 50, 25, 5)
  var line3 = new Line(board, board.width / 2 + 5, board.height - 80, 25, 5)
  var line4 = new Line(board, board.width / 2 + 15, board.height - 110, 25, 5)
  var line5 = new Line(board, board.width / 2 + 25, board.height - 140, 25, 5)
  var line6 = new Line(board, board.width / 2 + 35, board.height - 170, 25, 5)
  var top = new Line(board, 0, 0, board.width, 1)
  var bottom = new Line(board, 0, board.height - 1, board.width, 1)
  var left = new Line(board, 0, 0, 1, board.height)
  var right = new Line(board, board.width - 1, 0, 1, board.height)

  var man = new Man(board, board.width / 2 - 10, board.height - 2 - 10, 10, 5)



  board.add(man);
  board.addMan(man);

  board.addLines(line);
  board.addLines(line2);
  board.addLines(line3);
  board.addLines(line4);
  board.addLines(line5);
  board.addLines(line6);

  board.addLines(top);
  board.addLines(bottom);
  board.addLines(left);
  board.addLines(right);


  document.onkeydown = board.keyUpDown;
  document.onkeyup = board.keyUpDown;

  setInterval(function() {
    board.turn()
    board.drawCells();
  }, 1000 / 60);
}
