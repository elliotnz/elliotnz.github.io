var mouseDown = false;

function getCursorPosition(e) {
  e = e || window.event;
  var cursor = {x:0, y:0};
  if (e.pageX || e.pageY) {
    cursor.x = e.pageX - 15;
    cursor.y = e.pageY - 15;
  } else {
    cursor.x = e.clientX +
    (document.documentElement.scrollLeft || document.body.scrollLeft) - document.documentElement.clientLeft;
    cursor.y = e.clientY +
    (document.documentElement.scrollTop || document.body.scrollTop) - document.documentElement.clientTop;
  }
  return cursor;
}

function Dot(board, x, y) {
  this.board = board;
  this.x = x;
  this.y = y;

  this.draw = function() {
    var ctx = this.board.context
    ctx.beginPath();
    ctx.lineWidth = 1
    ctx.arc(this.x, this.y, 5, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();

    //if (mouseDown) {
    document.onmousemove = function(e) {
      cursor = getCursorPosition();
    }
    ctx.beginPath();
    //ctx.strokeStyle = colour
    ctx.lineWidth = 11
    ctx.moveTo(this.x, this.y)
    ctx.lineTo(cursor.x, cursor.y)
    ctx.stroke();
    ctx.lineWidth = 1
    ctx.arc(cursor.x, cursor.y, 5, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
  }

  this.turn = function() {}
}

function Board(width, height, pixelWidth, context) {
  this.width = width;
  this.height = height;
  this.pixelWidth = pixelWidth;
  this.context = context;
  this.things = new Array();
  this.context.canvas.width = width;
  this.context.canvas.height = height;
  this.context.canvas.style.width = '' + (width * pixelWidth)  + 'px';
  this.context.canvas.style.height = '' + (height * pixelWidth) + 'px';
  this.keyMap = [];

  this.add = function(thing) {
    this.things.push(thing);
  }

  this.remove = function(thing) {
    var index = this.things.indexOf(thing)
    if (index > -1) {
      this.things.splice(index, 1);
    }
    this.removeLine(thing)
    this.removePhysicalLine(thing)
    this.removeKey(thing)
  }

  this.clicked = function(x, y) {
    var obj = new Dot(this, x, y)
    this.add(obj)
  }

  this.mouseMoved = function(x,y) {
    var obj = new Dot(this, x, y)
    this.add(obj)
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

  this.turn = function() {
    for (var i = 0; i < this.things.length; i++) {
      this.things[i].turn()
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

  document.onmousedown = function(e) {
    cursor = getCursorPosition();
    board.clicked(cursor.x, cursor.y)
    mouseDown = true
  }

  document.onmousemove = function(e) {
    if (mouseDown) {
      cursor = getCursorPosition();
      board.clicked(cursor.x, cursor.y)
    }
  }

  document.onmouseup = function(e) {
    mouseDown = false
  }

  setInterval(function() {
    board.drawCells();
  }, 1000 / 60);

  setInterval(function() {
    board.turn()
  }, 1000 / 60);
}
