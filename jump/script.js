function Thing(board, x, y) {
  this.x = x;
  this.y = y;
  this.board = board;
  this.vForce = null;
  this.xChange = 0;

  this.turn = function() {}

}
function Man(board, line, x, y) {
  this.x = x;
  this.y = y;
  this.colour = "blue";
  this.board = board;
  this.line = line;
  this.lineAbove = false;
  this.lineBelow = false;
  this.height = 10;
  this.width = 5;

  this.draw = function() {
    this.board.context.fillStyle = "blue";
    this.board.context.fillRect(this.x, this.y - this.height + 1, this.width, this.height)
  }

  this.turn = function() {
    if (this.vForce == null) {

    } else if (this.vForce >= 0) {
      if (this.lineBelow) {
        this.lineBelow = false;
      }
      if ((this.y >= this.line.y && this.y - 2.5 < this.line.y + this.height + this.line.height) && (this.x <= this.line.x + this.line.width && this.x >= this.line.x)) {
        this.vForce -= 1;
        this.lineAbove = true;
      } else if (!this.lineAbove){
        this.vForce -= 1;
        this.y -= (this.vForce * .7);
      }
    } else if (this.vForce < 0) {
      if (this.lineBelow) {
        this.lineBelow = false;
      }
      if ((this.y <= this.line.y && this.y + 2.5 > this.line.y) && (this.x <= this.line.x + this.line.width && this.x >= this.line.x)) {
        this.lineBelow = true;
      } else if (!this.lineBelow) {
        this.vForce -= .25;
        this.y -= (this.vForce * .7);
      }
      if (this.x < this.line.x + this.line.width && this.x > this.line.x && this.y < this.line.y && this.y > this.line.y + this.line.height) {
        //this.lineBelow = false;
        this.lineBelow = true;
      }
      // if ((this.x > this.line.x) && (parseInt(this.y) + 1 === this.line.y)) {
      //   this.lineBelow = false;
      // }
      if ((this.board.onGround(this))) {
        this.lineBelow = false;
        this.vForce = null;
      }
      if (this.lineBelow) {
        this.lineBelow = true;
        //this.vForce = null;
      } else {
        this.lineBelow = false;
      }
    }
    if (this.board.canMoveRight(this.x - 1, this.y)) {
      if (this.board.canMoveLeft(this.x - 1, this.y)) {
        this.x += this.xChange * 3;
        this.xChange = 0;
        this.lineAbove = false;
        //this.lineBelow = false;
      }
    }
  }
  this.jump = function() {
    if ((this.board.onGround(this)) || this.lineBelow) {
      this.vForce = 10;
    }
  }
  this.moveleft = function() {
    if (this.board.canMoveLeft(this.x - 1 * 3, this.y)) {
      this.xChange = -1;
    }
  }
  this.moveright = function() {
    if (this.board.canMoveRight(this.x + 1 * 10, this.y)) {
     this.xChange = 1;
    }
  }
}
Man.prototype = new Thing()

function Line(board, x, y) {
  this.board = board
  this.x = x;
  this.y = y;
  this.width = 25;
  this.height = 5;

  this.draw = function() {
    this.board.context.fillStyle = "black";
    // this.board.context.fillRect(this.x, this.y, this.width, this.y)
    this.board.context.fillRect(this.x, this.y, this.width, this.height)
    // this.board.context.beginPath();
    // this.board.context.moveTo(this.x, this.y);
    // this.board.context.lineTo(this.width, this.y);
    // this.board.context.stroke();
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
  this.line = null;

  this.add = function(thing) {
    this.things.push(thing);
  }
  this.addMan = function(man) {
    this.man = man;
  }
  this.addLine = function(line) {
    this.line = line;
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

  this.canMoveLeft = function(x, y) {
    if ((y > this.line.y && y < this.line.y + this.line.height + 5)
           && (x < this.line.x + this.line.width + 1 && x > this.line.x)) {
      return false;
    }
    return (x !== 0);
  }
  this.canJumpTo = function(x, y) {
    return (x < this.line.x || x > this.line.x + this.line.width)
          && (y > this.line.y + this.line.height || y < this.line.y)
  }
  this.canMoveRight = function(x, y) {
    if ((y > this.line.y && y < this.line.y + this.line.height)
        && (x < this.line.x + this.line.width + 1 && x > this.line.x)) {
      return false;
    }
    return (x !== this.width - 1);
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

  this.onGround = function(thing) {
    if (thing.y >= this.height - 1) {
      this.y = this.height;
      return true;
    } else {
      return false;
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

  var line = new Line(board, board.width / 2 - 10, board.height - 20)

  var man = new Man(board, line, board.width / 2 - 10, board.height - 1)



  board.add(man);
  board.add(line);

  board.addMan(man);
  board.addLine(line);

  document.onkeydown = board.keyUpDown;
  document.onkeyup = board.keyUpDown;

  setInterval(function() {
    board.turn()
    board.drawCells();
  }, 1000 / 60);
}
