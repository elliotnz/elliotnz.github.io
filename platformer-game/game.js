function Thing(board, x, y, physical) {
  this.x = x;
  this.y = y;
  this.board = board;
  this.step = null;
  this.physical = physical

  this.turn = function() {
    if (!this.physical && this.board.lines.indexOf(this) > -1) {
      this.board.removeLine(this)
    } else if (this.physical && this.board.lines.indexOf(this) === -1) {
      this.board.addLines(this)
    }
  }

  this.canMoveUp = function() {
    //bad:
    // return (!this.board.isBlocked(this.x + 1, this.y - 1)
    // && !this.board.isBlocked(this.x + this.width - 1, this.y + this.height)
    // && !this.board.isBlocked(this.x + 1, this.y + this.height / 2)
    // && !this.board.isBlocked(this.x + this.width - 1, this.y + this.height / 2))
    //better:
    //return (!this.board.isBlocked(this.x - 1, this.y - 1))
    //&& !this.board.isBlocked(this.x + this.width, this.y - 1)
    //boss:
    var varCanMoveUp = true
    for (var i = 0; i <= this.width; i++) {
      if (this.board.isBlocked(this.x + i, this.y - 1)) {
        varCanMoveUp = false;
      }
    }
    return (varCanMoveUp);
  }

  this.falling = function() {
    return !this.onGround()
  }

  this.onGround = function() {
    var onGround = false
    for (var i = 0; i <= this.width; i++) {
      if (this.board.isBlocked(this.x + i, this.y + this.height + 1)) {
        onGround = true;
      }
    }
    return (onGround);
    // return ((this.board.isBlocked(this.x - 1, this.y + this.height + 1)) ||
    // (this.board.isBlocked(this.x + this.width / 2 - this.step, this.y + this.height + 1)) ||
    // (this.board.isBlocked(this.x + this.width - this.step, this.y + this.height + 1)))
  }

  this.againstLeftLine = function() {
    var avaliableSteps = 0;
    var varLeftLine = false
    for (var i = 1; i <= 4; i++) {
      for (var j = 0; j <= this.height; j++) {
        if (this.board.isBlocked(this.x - i, this.y + j)) {
          if (!this.board.isBlocked(this.x - avaliableSteps, this.y + j)) {
            avaliableSteps += 1
          }
        }
        if (this.board.isBlocked(this.x - i, this.y + j)) {
          var used = avaliableSteps
          this.getClose(used)
          avaliableSteps = 0
          varLeftLine = true;
          break;
        }
      }
    }
    return (varLeftLine);
  }

  this.againstRightLine = function() {
    var avaliableSteps = 0;
    var varRightLine = false
    for (var i = 1; i <= 4; i++) {
      for (var j = 0; j <= this.height; j++) {
        if (this.board.isBlocked(this.x + this.width + i, this.y + j)) {
          if (!this.board.isBlocked(this.x + this.width + avaliableSteps, this.y + j)) {
            avaliableSteps += 1
          }
        }
        if (this.board.isBlocked(this.x + this.width + i, this.y + j)) {
          var used = avaliableSteps
          this.getClose(used)
          avaliableSteps = 0
          varRightLine = true;
          break;
        }
      }
    }
    return (varRightLine);
  }

  this.getClose = function(steps, direction) {
    if (steps < 0 && direction === "left") {
      steps *= -1
      this.x -= (steps - 1)
    } else if (steps > 0 && direction === "right") {
      steps *= 1
      this.x += (steps + this.width - 1)
    }
  }

  this.within = function(thing) {
    // if ((this.x >= thing.x && this.x + <= thing.x + thing.width) &&
    // ((this.x + this.width >= thing.x && this.x + <= thing.x + thing.width) &&
    // (this.y >= thing.y && this.y <= thing.y + thing.height)) {
    //   return true;
    // } else {
    //   return false;
    // }
    if ((this.x - thing.width + 1 <= thing.x && this.x + this.width - 1 >= thing.x) &&
    (this.y - thing.height + 1 <= thing.y && this.y + this.height - 1 >= thing.y)) {
      return true;
    } else {
      return false;
    }
  }
} // end of Thing

  function getMilliseconds() {
    return new Date().getTime();
  }


function Man(board, x, y, height, width, colour) {
  this.x = x;
  this.y = y - height;
  this.board = board;
  this.lineAbove = false;
  this.lineBelow = false;
  this.height = height;
  this.width = width;
  this.colour = colour;
  this.physical = false;
  this.vForce = null;
  this.xChange = 0;
  this.lastXChange = 1;
  this.step = 4;

  this.draw = function() {
    //body
    this.board.context.fillStyle = this.colour;
    this.board.context.fillRect(this.x, this.y, this.width, this.height)
    //var url = document.getElementById('chrome');
    //this.board.context.drawImage(url,this.x,this.y);
  }

  this.turn = function() {
    // look above us
    if (this.vForce > 0 && this.canMoveUp()) {
      // move to the positon unless we hit something first
      var pointsToMove = Math.round(this.vForce * .4);
      for (var i = 0; i < pointsToMove; i += 1) {
        if (this.canMoveUp()) {
          this.y -= pointsToMove / 20;
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
          this.y += pointsToMove;
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
      this.vForce = 30;
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
    this.y = board.height - 2 - this.height;
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

function Line(board, x, y, width, height, physical, colour) {
  this.board = board
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.physical = physical
  this.colour = colour

  this.draw = function() {
    this.board.context.fillStyle = this.colour;
    this.board.context.fillRect(this.x, this.y, this.width, this.height)
  }
}

Line.prototype = new Thing()

function ColourPlatform(board, x, y, width, height, colour) {
  this.board = board
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.physical = false
  this.colour = colour

  this.draw = function() {
    this.board.context.fillStyle = this.colour;
    this.board.context.fillRect(this.x, this.y, this.width, this.height)
  }

  this.turn = function() {
    if (this.board.man.colour === this.colour) {
      if (this.board.lines.indexOf(this) === -1)
        this.board.addLines(this)
    } else {
      if (this.board.lines.indexOf(this) !== -1)
        this.board.removeLine(this)
    }
  }
}

ColourPlatform.prototype = new Thing()

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
    //TIDY!:
    // var varCanGoUp = true;
    // for (var i = 0; i <= this.width; i++) {
    //   if (this.board.isBlocked(this.x + i, this.board.man.y + this.board.man.height + 1)) {
    //     varCanGoUp = false;
    //   }
    // }
    // if (varCanGoUp) {
    //   this.goingUp = true;
    // }
    // var eX = this.mAndEX() //this.x + this.i;
    // var eY = this.y - 1 + this.board.man.height;
    // var mX = this.board.man.x;
    // var mY = Math.floor(this.board.man.y + this.board.man.height * 2);
    // if (eX === mX && eY === mY) {
    //   this.goingUp = true;
    //   this.board.man.y -= 1;
    //   this.y -= 1;
    // } else {
    //   this.goingUp = false;
    // }
    //if (this.onGround =)
    //document.getElementById("nextToLeft").innerHTML = this.x + ": " + this.y;
    var manOnElevator = false
    this.goingUp = false
    for (var i = this.board.man.width * -1 + 1; i <= this.width + this.board.man.width - 1; i++) {
      for (var j = this.board.man.width * -1 + 1; j <= this.width + this.board.man.width - 1; j++) {
        // document.getElementById("mX").innerHTML = "Man: " + this.board.man.x;
        //document.getElementById("mY").innerHTML = Math.floor(this.board.man.y + this.board.man.height);
        // document.getElementById("eX").innerHTML = "Elevator: " + this.x;

        if ((this.x + i === (this.board.man.x + j)) && (Math.floor(this.board.man.y + this.board.man.height) === (this.y - 1))) {
          this.goingUp = true
        }
        //if (this.board.isBlocked(this.x + i, this.y + this.height + 1)) {
        //this.goingUp = true;
        //}
        //

        if (this.goingUp) {
          this.board.man.y -= 0.00001
          this.y -= 0.5
          //document.getElementById("nextToLeft").innerHTML = this.x + ": " + this.y;
        } else {
          if (this.y !== this.board.height - 20) {
            this.y += 0.1;
          }
        }
      }
    }
  }
}

Elevator.prototype = new Line()
Elevator.prototype = new Thing()

function colourConvertor(board, x, y, width, height) {
  this.board = board
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.physical = false;
  this.manIn = false

  this.draw = function() {
    this.board.context.fillStyle = "orange";
    this.board.context.fillRect(this.x, this.y, this.width, this.height)
  }
  this.turn = function() {
    if (this.within(this.board.man)) {
      this.manIn = true
    } else {
      if (this.manIn) {
        if (this.board.man.colour === "red") {
          this.board.man.colour = "blue"
        } else {
          this.board.man.colour = "red"
        }
        this.manIn = false
      }
    }
  }
}

colourConvertor.prototype = new Thing()

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
  this.colourConvertors = []
  this.colourPlatforms = []

  this.add = function(thing) {
    this.things.push(thing);
  }

  this.remove = function(thing) {
    var index = this.things.indexOf(thing)
    if (index > -1) {
      this.things.splice(index, 1);
    }
  }

  this.removeLine = function(thing) {
    var index = this.lines.indexOf(thing)
    if (index > -1) {
      this.lines.splice(index, 1);
    }
  }

  this.addElevator = function(elevator) {
    this.elevators.push(elevator);
    this.add(elevator);
  }

  this.addColourPlatform = function(colourPlatform) {
    this.colourPlatforms.push(colourPlatform);
    this.lines.push(colourPlatform);
    this.add(colourPlatform);
  }

  this.addColourConvertor = function(colourConvertor) {
    this.colourConvertors.push(colourConvertor);
    this.add(colourConvertor);
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

  var line = new Line(board, board.width / 2 - 240, board.height - 20, 25, 5, true, "black")
  var line2 = new Line(board, board.width / 2 - 180, board.height - 50, 25, 5, true, "black")
  //var line3 = new ColourPlatform(board, board.width / 2 - 110, board.height - 80, 25, 5, "blue")
  var line4 = new ColourPlatform(board, board.width / 2 - 60, board.height - 110, 25, 5, "red")
  var line5 = new Line(board, board.width / 2, board.height - 140, 25, 5, true, "black")
  var line6 = new Line(board, board.width / 2 + 60, board.height - 170, 25, 5, true, "black")
  var line7 = new Line(board, board.width / 2 + 180, board.height - 175, 25, 5, true, "black")
  var line8 = new Line(board, board.width / 2 + 280, board.height - 210, 25, 5, true, "black")
  var lineblock = new Line(board, board.width / 2 + 380, board.height - 240, 80, 220, true, "black")
  var linecave = new Line(board, board.width / 2 + 450, board.height - 50, 10, 50, true, "black")

  // var elevator = new Elevator(board, board.width / 2 + 310, board.height - 20, 25, 5)
  // var elevator2 = new Elevator(board, board.width / 2 + 470, board.height - 20, 25, 5)

  var colourConvertor1 = new colourConvertor(board, board.width / 2 + 270, board.height - 30, 25, 30)

  var lineConvertor = new Line(board, board.width / 2 + 270, board.height - 35, 25, 5, true, "orange")

  var blueLine = new ColourPlatform(board, board.width / 2 + 10, board.height - 10, 25, 5, "blue")
  var redLine = new ColourPlatform(board, board.width / 2 + 80, board.height - 10, 25, 5, "red")
  var test = new ColourPlatform(board, board.width / 2 + 60, board.height - 20, 25, 5, "black")

  var block = new Line(board, 0, board.height - 120, 50, 120, true, "black")
  var block2 = new Line(board, 40, board.height - 80, 50, 80, true, "black")
  var block3 = new Line(board, 80, board.height - 40, 50, 40, true, "black")

  var top = new Line(board, 0, 0, board.width, 1, true, "black")
  var bottom = new Line(board, 0, board.height - 1, board.width, 1, true, "black")
  var left = new Line(board, 0, 0, 1, board.height, true, "black")
  var right = new Line(board, board.width - 1, 0, 1, board.height, true, "black")

  var man = new Man(board, board.width / 2 - 10, board.height - 2 - 10, 16, 9, "blue")

  board.add(man);
  board.addMan(man);

  board.addLines(line);
  board.addLines(line2);
  // board.addColourPlatform(line3);
  // board.addColourPlatform(line4);
  board.addLines(line5);
  board.addLines(line6);
  board.addLines(line7);
  board.addLines(line8);
  board.addLines(lineblock);
  board.addLines(linecave);

  board.addColourPlatform(blueLine);
  board.addColourPlatform(redLine);
  board.addColourPlatform(test);

  // board.addLines(elevator);
  // board.addElevator(elevator);
  // board.addLines(elevator2);
  // board.addElevator(elevator2);


  board.addColourConvertor(colourConvertor1)

  board.addLines(lineConvertor);

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
