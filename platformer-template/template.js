function Thing(board, x, y) {
  this.x = x;
  this.y = y;
  this.board = board;
  this.step = null;

  this.turn = function() {}

  this.canMoveUp = function() {
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
      if (this.board.isBlocked(this.x + i, this.y + this.height + 0.1)) {
        onGround = true;
      }
    }
    return (onGround);
  }

  this.againstLeftLine = function() {
    var varLeftLine = false
    for (var i = 0; i <= this.step; i++) {
      for (var j = 0.1; j <= this.height; j++) {
        if (this.board.isBlocked(this.x - i, this.y + j)) {
          varLeftLine = true;
          break;
        }
      }
    }
    return (varLeftLine);
  }

  this.againstRightLine = function() {
    var varRightLine = false
    for (var i = 0; i <= this.step; i++) {
      for (var j = 0.1; j <= this.height; j++) {
        if (this.board.isBlocked(this.x + this.width + i, this.y + j)) {
          varRightLine = true;
          break;
        }
      }
    }
    return (varRightLine);
  }

  this.within = function(thing) {
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
  this.colour = colour
  this.counter = 0;
  this.jumping = false;
  this.jumps = false;
  this.currentlyJumping = false;
  this.falling = false;
  this.readyToJump = false;
  this.upForce = 0;
  this.downForce = 0;
  this.xChange = 0;
  this.lastXChange = 1;
  this.step = 4;
  this.foundSecret = false;

  this.draw = function() {
    //body
    this.board.context.fillStyle = this.colour;
    this.board.context.fillRect(this.x, this.y, this.width, this.height)
    if (this.foundSecret) {
      this.board.context.font = "25px Verdana";
      this.board.context.fillStyle = "black";
      this.board.context.fillText("You found the secret!", 700, 25)
    }
  }

  this.turn = function() {
    if (this.x <= 5 && Math.floor(this.y) === 1) {
      this.x = 525;
      this.y = 20;
      for (var i = 0; i < this.board.lines.length; i++) {
        this.board.lines[i].colour = "black"
      }
      this.foundSecret = true
    }
    if (this.againstRightLine() && this.board.keyMap["39"]) {
      var distanceCanMoveRight = 0
      var canMoveRight = true;
      var readyToIncrease = true;
      while (canMoveRight) {
        readyToIncrease = true
        for (var i = 0; i <= this.height; i++) {
          if (this.board.isBlocked(this.x + this.width + distanceCanMoveRight + 0.1, this.y + i)) {
            readyToIncrease = false
            break;
          }
        }
        if (readyToIncrease) {
          distanceCanMoveRight += 0.1;
        } else {
          canMoveRight = false
          break;
        }
      }
      this.x += distanceCanMoveRight
    }
    if (this.againstLeftLine() && this.board.keyMap["37"]) {
      var distanceCanMoveLeft = 0
      var canMoveLeft = true;
      var readyToIncrease = true;
      while (canMoveLeft) {
        readyToIncrease = true
        for (var i = 0; i <= this.height; i++) {
          if (this.board.isBlocked(this.x - distanceCanMoveLeft - 0.1, this.y + i)) {
            readyToIncrease = false
            break;
          }
        }
        if (readyToIncrease) {
          distanceCanMoveLeft += 0.1;
        } else {
          canMoveLeft = false
          break;
        }
      }
      this.x -= distanceCanMoveLeft
    }
    if (this.jumps && !this.currentlyJumping) {
      this.upForce = 18;
      this.jumping = true;
      this.currentlyJumping = true;
    }
    if (this.onGround() && this.currentlyJumping) {
      this.currentlyJumping = false;
    }
    if (this.currentlyJumping) {
      this.jumps = false;
    }
    if (this.falling && this.upForce > 0) {
      this.upForce = 0;
      this.jumping = false;
    }
    if (!this.onGround() && !this.jumping) {
      this.falling = true;
      this.downForce = 1;
    } else {
      this.falling = false;
      this.downForce = 0;
    }
    if (this.jumping) {
      var oldUpForce = this.upForce
      this.upForce = Math.floor(oldUpForce * .89);
      var canMoveUpForceUp = true
      for (var i = 1; i <= this.width; i++) {
        for (var j = 0; j <= this.height + this.upForce; j++) {
          if (this.board.isBlocked(this.x + i, this.y + this.height - j)) {
            canMoveUpForceUp = false
            break;
          }
        }
        if (!canMoveUpForceUp) {
          break;
        }
      }
      if (canMoveUpForceUp && this.canMoveUp() && this.upForce > 0) {
        this.y -= this.upForce
      } else if (!canMoveUpForceUp && this.canMoveUp() && this.upForce > 0) {
        var distanceCanMoveUp = 0
        var canMoveUp = true;
        var readyToIncrease = true;
        while (canMoveUp) {
          readyToIncrease = true
          for (var i = 0; i <= this.width; i++) {
            if (this.board.isBlocked(this.x + i, this.y - distanceCanMoveUp - 0.1)) {
              canMoveUp = false
              readyToIncrease = false
              break;
            }
          }
          if (readyToIncrease) {
            distanceCanMoveUp += 0.1;
          } else {
            canMoveUp = false
            break;
          }
        }
        this.y -= distanceCanMoveUp
      } else {
        this.counter += 2;
      }
      if (this.counter > 10) {
        this.counter = 0;
        this.downForce = 1
        this.jumping = false
        this.falling = true
      }
    }
    if (this.falling) {
      this.counter += 0.1
      var canMoveDownForceDown = true
      for (var i = 1; i <= this.width; i++) {
        for (var j = 0; j <= this.height; j++) {
          if (this.board.isBlocked(this.x + i, this.y + (this.downForce * this.counter) + j)) {
            canMoveDownForceDown = false;
            break;
          }
        }
        if (!canMoveDownForceDown) {
          break;
        }
      }
      if (canMoveDownForceDown) {
        this.y += this.downForce * this.counter;
      } else {
        var distanceCanMoveDown = 0
        var canMoveDown = true;
        var readyToIncrease = true;
        while (canMoveDown) {
          readyToIncrease = true
          for (var i = 0; i <= this.width; i++) {
            if (this.board.isBlocked(this.x + i, this.y + this.height + distanceCanMoveDown + 0.1)) {
              readyToIncrease = false
              break;
            }
          }
          if (readyToIncrease) {
            distanceCanMoveDown += 0.1;
          } else {
            canMoveDown = false
            break;
          }
        }
        if (distanceCanMoveDown < this.downForce * this.counter) {
          this.y += distanceCanMoveDown
          this.falling = false;
          this.currentlyJumping = false;
          this.counter = 0;
          this.downForce = 0;
        } else {
          this.y += this.downForce * this.counter;
        }
      }
    }
    if ((this.xChange < 0 && !this.againstLeftLine()) ||
    (this.xChange > 0 && !this.againstRightLine())) {
      this.x += this.xChange * this.step;
    }
    this.xChange = 0;
  }

  this.jump = function() {
    this.jumps = true;
  }
  this.moveleft = function() {
    this.xChange = -1;
    this.lastXChange = -1;
  }

  this.moveright = function() {
    this.xChange = 1;
    this.lastXChange = 1;
  }
}

Man.prototype = new Thing()

function Line(board, x, y, width, height, colour) {
  this.board = board
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.colour = colour

  this.draw = function() {
    this.board.context.fillStyle = this.colour;
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
  this.elevators = []
  this.spikes = []

  this.add = function(thing) {
    this.things.push(thing);
  }

  this.remove = function(thing) {
    var index = this.things.indexOf(thing)
    if (index > -1) {
      this.things.splice(index, 1);
    }
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

  this.keyUpDown = function(e) {
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

  var line = new Line(board, board.width / 2 - 240, board.height - 20, 25, 5, "black")
  var line2 = new Line(board, board.width / 2 - 180, board.height - 50, 25, 5, "black")
  var line3 = new Line(board, board.width / 2 - 110, board.height - 80, 25, 5, "black")
  var line4 = new Line(board, board.width / 2 - 60, board.height - 110, 25, 5, "black")
  var line5 = new Line(board, board.width / 2, board.height - 140, 25, 5, "black")
  var line6 = new Line(board, board.width / 2 + 60, board.height - 170, 25, 5, "black")
  var line7 = new Line(board, board.width / 2 + 180, board.height - 175, 25, 5, "black")
  var line8 = new Line(board, board.width / 2 + 280, board.height - 210, 25, 5, "black")
  var lineblock = new Line(board, board.width / 2 + 380, board.height - 240, 80, 220, "black")
  var linecave = new Line(board, board.width / 2 + 450, board.height - 50, 10, 50, "black")

  var block = new Line(board, 0, board.height - 120, 50, 120, "black")
  var block2 = new Line(board, 40, board.height - 80, 50, 80, "black")
  var block3 = new Line(board, 80, board.height - 40, 50, 40, "black")

  var secret1 = new Line(board, 80, board.height - 170, 25, 5, "silver")
  var secret2 = new Line(board, 10, board.height - 250, 25, 5, "silver")
  var secret3 = new Line(board, 120, board.height - 310, 25, 5, "silver")
  var secret4 = new Line(board, 200, board.height - 360, 25, 5, "silver")
  var secret5 = new Line(board, 10, board.height - 415, 25, 5, "silver")
  var secret6 = new Line(board, 450, 50, 200, 10, "silver")
  var secret7 = new Line(board, 450, 0, 5, 50, "silver")
  var secret8 = new Line(board, 645, 0, 5, 50, "silver")

  var top = new Line(board, 0, 0, board.width, 1, "black")
  var bottom = new Line(board, 0, board.height - 1, board.width, 1, "black")
  var left = new Line(board, 0, 0, 1, board.height, "black")
  var right = new Line(board, board.width - 1, 0, 1, board.height, "black")

  var man = new Man(board, board.width / 2 - 10, board.height - 2 - 40, 16, 9, "blue")

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

  board.addLines(block);
  board.addLines(block2);
  board.addLines(block3);

  board.addLines(secret1);
  board.addLines(secret2);
  board.addLines(secret3);
  board.addLines(secret4);
  board.addLines(secret5);
  board.addLines(secret6);
  board.addLines(secret7);
  board.addLines(secret8);

  board.addLines(top);
  board.addLines(bottom);
  board.addLines(left);
  board.addLines(right);


  document.onkeydown = board.keyUpDown;
  document.onkeyup = board.keyUpDown;

  window.addEventListener("keydown", function(e) {
    // space and arrow keys
    if ([37, 39, 38, 40].indexOf(e.keyCode) > -1) {
      e.preventDefault();
    }
  }, false);

  setInterval(function() {
    board.drawCells();
  }, 1000 / 60);

  setInterval(function() {
    board.turn()
  }, 1000 / 60);
}

var restart = function() {
  board.man.restart()
}
