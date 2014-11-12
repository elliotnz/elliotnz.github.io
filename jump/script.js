function Thing(board, x, y) {
  this.x = x;
  this.y = y;
  this.board = board;
  this.hForce = null;
  this.xChange = 0;

  this.turn = function() {}

  this.draw = function() {
    this.board.context.fillStyle = "blue";
    this.board.context.fillRect(this.x, this.y - 9, 5, 10)
  }
}
function Man(board, x, y) {
  this.x = x;
  this.y = y;
  this.colour = "blue";
  this.board = board;

  this.turn = function() {
    if (this.hForce == null) {

    } else if (this.hForce >= 0) {
      this.hForce -= 1;
      this.y -= (this.hForce * .3);
    } else if (this.hForce < 0) {
      this.hForce -= 1;
      this.y -= (this.hForce * .3);
      if (this.board.onGround(this.x, this.y)) {
        this.hForce = null;
      }
    }
    this.x += this.xChange;
    this.xChange = 0;
  }
  this.jump = function() {
    if (this.board.onGround(this.x, this.y)) {
      this.hForce = 10;
    }
  }
  this.moveleft = function() {
    this.xChange = -1;
  }
  this.moveright = function() {
    this.xChange = 1;
  }
  this.upleft = function() {
    if (!this.board.onGround(this.x, this.y)) {
      this.xChange = -1;
    } else {
      this.moveleft()
    }
  }
  this.upright = function() {
    if (!this.board.onGround(this.x, this.y)) {
      this.xChange = 1;
    } else {
      this.moveright()
    }
  }
}
Man.prototype = new Thing()

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

  this.add = function(thing) {
    this.things.push(thing);
  }
  this.addMan = function(man) {
    this.man = man;
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

  this.canMoveTo = function(x, y) {
    var withinBoardAndNotWall = (x !== this.width) && (y !== this.height);
    if (!withinBoardAndNotWall) {
      return false;
    }
    return true;
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
    }  //else if (this.keyMap['37'] && this.keyMap['38']) {
    //   alert("f")
    // }
    //   man.upleft()
    // }
    // if (e.keyCode == '39') {
    //   man.moveright()
    // } else  if ((e.keyCode == '39') && (e.keyCode == '38')){
    //   man.upright()
    // }
  }

  this.onGround = function(x,y) {
    return (!this.canMoveTo(x, y + 1))
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

  var man = new Man(board, 5, board.height - 1)


  board.add(man);

  board.addMan(man);

  document.onkeydown = board.keyUpDown;
  document.onkeyup = board.keyUpDown;

  setInterval(function() {
    board.turn()
    board.drawCells();
  }, 1000 / 60);
}
