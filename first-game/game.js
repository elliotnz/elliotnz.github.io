function Thing(board, x, y) {
  this.x = x;
  this.y = y;
  this.board = board;
  this.step = null;

  this.turn = function() {}

  this.canMoveUp = function() {
    return (!this.board.isBlocked(this.x + 1, this.y - 1)
    && !this.board.isBlocked(this.x + this.width - 1, this.y + this.height)
    && !this.board.isBlocked(this.x + 1, this.y + this.height / 2)
    && !this.board.isBlocked(this.x + this.width - 1, this.y + this.height / 2))
  }

  this.falling = function() {
    return !this.onGround()
  }

  this.onGround = function() {
    return ((this.board.isBlocked(this.x + 1 * this.step, this.y + this.height + 1)) ||
    (this.board.isBlocked(this.x + this.width / 2 - 1 * this.step, this.y + this.height + 1)) ||
    (this.board.isBlocked(this.x + this.width - 1 * this.step, this.y + this.height + 1)))
  }

  this.againstLeftLine = function() {
    //for (var i = this.step; i > 0; i--) {
    var i = this.step;
    return (this.board.isBlocked(this.x - i - 1, this.y) ||
    this.board.isBlocked(this.x - i - 1, this.y + this.height - 1) ||
    this.board.isBlocked(this.x - i - 1, this.y + this.height / 2))
    //}
  }

  this.againstRightLine = function() {
    //for (var i = 0; i < this.step; i++) {
    var i = this.step;
    return (this.board.isBlocked(this.x + this.width + 0 + i, this.y) ||
    this.board.isBlocked(this.x + this.width + 0 + i, this.y + this.height - 1) ||
    this.board.isBlocked(this.x + this.width + 0 + i, this.y + this.height / 2));
    //}
  }

  this.within = function(thing) {
    if ((this.x >= thing.x && this.x <= thing.x + thing.width) &&
      (this.y >= thing.y && this.y <= thing.y + thing.height)) {
      return true;
    } else {
      return false;
    }
  }
} // end of Thing

function getMilliseconds() {
  return new Date().getTime();
}


function Man(board, x, y, height, width) {
  this.x = x;
  this.y = y;
  this.board = board;
  this.lineAbove = false;
  this.lineBelow = false;
  this.height = height;
  this.width = width;
  this.vForce = null;
  this.xChange = 0;
  this.lastXChange = 1;
  this.step = 4;

  this.draw = function() {
    //body
    //this.board.context.fillStyle = "blue";
    //this.board.context.fillRect(this.x, this.y, this.width, this.height)
    var url = document.getElementById('chrome');
    this.board.context.drawImage(url,this.x,this.y);
  }

  this.turn = function() {
    // look above us
    if (this.vForce > 0 && this.canMoveUp()) {
      // move to the positon unless we hit something first
      var pointsToMove = Math.round(this.vForce * .4);
      for (var i = 0; i < pointsToMove; i += 1) {
        if (this.canMoveUp()) {
          this.y *= .999;
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
      for (var i = 0; i < pointsToMove; i += 0.25) {
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
      this.vForce = 25;
  }

  this.moveleft = function() {
    this.xChange = -1;
    this.lastXChange = -1;
  }

  this.moveright = function() {
    this.xChange = 1;
    this.lastXChange = 1;
  }

  this.restart = function() {
    this.x = board.width / 2 - 10;
    this.y = board.height - 2 - 10;
    this.board = board;
    this.lineAbove = false;
    this.lineBelow = false;
    this.height = height;
    this.width = width;
    this.vForce = null;
    this.xChange = 0;
    this.lastXChange = 1;
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

function Elevator(board, x, y, width, height) {
  this.board = board
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.i = 0;
  this.goingUp = false;

  this.draw = function() {
    this.board.context.fillStyle = "orange";
    this.board.context.fillRect(this.x, this.y, this.width, this.height)
  }

  this.mAndEX = function() {
    if (!this.goingUp) {
      return (this.x + this.i);
    } else {
      return (this.board.man.x);
    }
  }

  this.turn = function() {
    // this.x = x;
    // this.y = y;
    //alert("x checking:")
    if (this.i < this.width) {
      if (!this.goingUp) {
        this.i += 1;
      }
    } else {
      this.i = 0;
    }
    var eX = this.mAndEX() //this.x + this.i;
    var eY = this.y - 1 + this.board.man.height;
    var mX = this.board.man.x;
    var mY = Math.floor(this.board.man.y + this.board.man.height * 2);

    if (eX === mX && eY === mY) {
      this.goingUp = true;
      this.board.man.y -= 1;
      this.y -= 1;
    } else {
      this.goingUp = false;
    }

    if (!this.goingUp) {
      if (this.y !== this.board.height - 20) {
        this.y += 0.5;
      }
    }
  }
}

Elevator.prototype = new Line()

function Spike(board, x, y, width, height) {
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

Spike.prototype = new Thing()

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
  this.elevators = []

  this.add = function(thing) {
    this.things.push(thing);
  }

  this.remove = function(thing) {
    var index = this.things.indexOf(thing)
    if (index > -1) {
      this.things.splice(index, 1);
    }
  }

  this.addElevator = function(elevator) {
    this.elevators.push(elevator);
    this.add(elevator);
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
    for (var i = 0; i< this.things.length; i++) {
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
        return true;
      }
    }
    return false;
  }

  this.turn = function() {
    for (var i = 0; i < this.things.length; i++) {
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
    if (this.keyMap['82']) {
      restart();
    }
  }

  this.elevatorsTurn = function() {
    for (var i = 0; i < this.elevators.length; i++) {
      this.elevators[i].turn;
    }
  }

  this.keyUpDown = function(e){
    e = e || event; // to deal with IE
    board.keyMap[e.keyCode] = e.type == 'keydown';
  }
}

var getBoard = function() {
  var canvas = document.getElementById("myCanvas");
  var context = canvas.getContext("2d");

  return(new Board(1000, 500, 1, context));
}

var board = null;

var start = function() {
  board = getBoard()//new Board(1000, 500, 1, context);

  var line = new Line(board, board.width / 2 - 240, board.height - 20, 25, 5)
  var line2 = new Line(board, board.width / 2 - 180, board.height - 50, 25, 5)
  var line3 = new Line(board, board.width / 2 - 120, board.height - 80, 25, 5)
  var line4 = new Line(board, board.width / 2 - 60, board.height - 110, 25, 5)
  var line5 = new Line(board, board.width / 2, board.height - 140, 25, 5)
  var line6 = new Line(board, board.width / 2 + 60, board.height - 170, 25, 5)
  var line7 = new Line(board, board.width / 2 + 180, board.height - 175, 25, 5)
  var line8 = new Line(board, board.width / 2 + 280, board.height - 210, 25, 5)
  var lineblock = new Line(board, board.width / 2 + 380, board.height - 240, 80, 220)
  var linecave = new Line(board, board.width / 2 + 450, board.height - 50, 10, 50)

  var elevator = new Elevator(board, board.width / 2 + 310, board.height - 20, 25, 5)
  var elevator2 = new Elevator(board, board.width / 2 + 470, board.height - 20, 25, 5)

  var block = new Line(board, 0, board.height - 120, 50, 120)
  var block2 = new Line(board, 0, board.height - 80, 100, 80)
  var block3 = new Line(board, 0, board.height - 40, 150, 40)

  var top = new Line(board, 0, 0, board.width, 1)
  var bottom = new Line(board, 0, board.height - 1, board.width, 1)
  var left = new Line(board, 0, 0, 1, board.height)
  var right = new Line(board, board.width - 1, 0, 1, board.height)

  var man = new Man(board, board.width / 2 - 10, board.height - 2 - 10, 10, 10)

  board.add(man);
  board.addMan(man);

  board.addLines(line);
  board.addLines(line2);
  board.addLines(line3);
  board.addLines(line4);
  board.addLines(line5);
  board.addLines(line6);
  board.addLines(line7);
  board.addLines(line8);
  board.addLines(lineblock);
  board.addLines(linecave);

  board.addLines(elevator);
  board.addElevator(elevator);
  board.addLines(elevator2);
  board.addElevator(elevator2);

  board.addLines(block);
  board.addLines(block2);
  board.addLines(block3);

  board.addLines(top);
  board.addLines(bottom);
  board.addLines(left);
  board.addLines(right);


  document.onkeydown = board.keyUpDown;
  document.onkeyup = board.keyUpDown;

  setInterval(function() {
    board.drawCells();
  }, 1000 / 60);

  setInterval(function() {
    board.turn()
  }, 1000 / 60);

  setInterval(function() {
    board.elevatorsTurn()
  }, 1000 / 100);
}

var restart = function() {
  board.man.restart()
}
