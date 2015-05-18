var colour = "black";
var size = 5;
var mouseDown = false;
var mouseMoving = false;

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

function Line(x, y, x2, y2) {}

function Dot(board, x, y, colour) {
  this.board = board;
  this.x = x;
  this.y = y;
  this.colour = colour
  this.size = size
  this.counter = 0

  this.draw = function() {
    var b = this.board
    var t = b.things
    var ctx = b.context
    ctx.beginPath();
    ctx.strokeStyle = this.colour
    ctx.fillStyle = this.colour
    ctx.lineWidth = 1
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();

    if (mouseMoving && t.length > 1) {
      ctx.beginPath();
      ctx.lineWidth = this.size * 2 + 1;
      ctx.moveTo(t[t.length - 2].x, t[t.length - 2].y);
      ctx.lineTo(t[t.length - 1].x, t[t.length - 1].y);
      ctx.stroke();
    }
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
  }

  this.clicked = function(x, y) {
    var obj = new Dot(this, x, y, colour, size)
    this.add(obj)
    obj.draw();
  }

  this.clearBoard = function() {
    this.context.clearRect(0, 0, this.width, this.height)
  }

  this.turn = function() {
    for (var i = 0; i < this.things.length; i++) {
      this.things[i].turn()
    }
    if (this.keyMap['49']) {
      colour = "blue"
    }
    if (this.keyMap['50']) {
      colour = "red"
    }
    if (this.keyMap['51']) {
      colour = "yellow"
    }
    if (this.keyMap['52']) {
      colour = "purple"
    }
    if (this.keyMap['53']) {
      colour = "orange"
    }
    if (this.keyMap['54']) {
      colour = "green"
    }
    if (this.keyMap['48']) {
      colour = "black"
    }
    if (this.keyMap['37']) {
      if (size > 1) {
        size -= 1
      }
    }
    if (this.keyMap['39']) {
      size += 1
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

  return(new Board(screen.availWidth - 30, screen.availHeight - 170, 1, context));
}

var board = null;

var resetSize = function() {
  size = 5
}

var clearBoard = function() {
  board.clearBoard();
}

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
      mouseMoving = true
    }
  }

  document.onmouseup = function(e) {
    mouseDown = false
    mouseMoving = false
  }

  document.onkeydown = board.keyUpDown;
  document.onkeyup = board.keyUpDown;

  setInterval(function() {
    board.turn()
  }, 1000 / 60);
}
