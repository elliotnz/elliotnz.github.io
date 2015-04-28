function Point(x, y) {
  this.x = x;
  this.y = y;
  this.verticies = []
  this.segments = []

  this.draw = function(ctx, style) {
    ctx.beginPath();
    ctx.arc(x,y,5,0,2*Math.PI);
    ctx.stroke();
  }
}

function Shape(segments, verticies) {
  this.segments = segments;
  this.verticies = verticies;

  this.draw = function(ctx, style) {
    for (var iSegment = 0; iSegment < this.segments.length; iSegment++) {
      ctx.beginPath();
      ctx.strokeStyle = style.toString();
      var lines = this.segments[iSegment];
      for (var i = 0; i < lines.length; i++) {
        var point = lines[i];
        if (i === 0) {
          ctx.moveTo(point.x, point.y);
        } else {
          ctx.lineTo(point.x, point.y);
        }
      }
      ctx.stroke();
    }
  }

  this.degToRad = function(deg) {
    return deg * (Math.PI / 180.0)
  }

  this.rotate = function(degreesToRotate, origin) {
    var r = this.degToRad(degreesToRotate);
    for (var i = 0; i < this.verticies.length; i++) {
      var point = this.verticies[i];
      var newPoint = new Point(null, null);
      newPoint.x = ( (point.x - origin.x) * Math.cos(r) - (point.y - origin.y) * Math.sin(r)) + origin.x
      newPoint.y = ( (point.x - origin.x) * Math.sin(r) + (point.y - origin.y) * Math.cos(r)) + origin.y
      point.x = newPoint.x;
      point.y = newPoint.y;
    }
  }
}

function Square(board, x, y, w, h) {
  this.board = board;
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
  this.verticies = [new Point(this.x, this.y), new Point(this.x + this.w, this.y),
  new Point(this.x + this.w, this.y + this.h), new Point(this.x, this.y + this.h)]
  this.segments =
    [
      [this.verticies[0], this.verticies[1], this.verticies[2], this.verticies[3], this.verticies[0]]
    ];
  this.centre = new Point(this.x + (this.w / 2), this.y + (this.h / 2));

  this.turn = function() {
    this.rotate(0.5, this.centre);
  }
}
Square.prototype = new Shape();

function Line(board, x, y, endX, endY) {
  this.board = board;
  this.x = x;
  this.y = y;
  this.endX = endX;
  this.endY = endY;
  this.verticies = [new Point(this.x, this.y), new Point(this.endX, this.endY)]
  this.segments =
  [
  [this.verticies[0], this.verticies[1]]
  ];
  this.centre = new Point(this.x + Math.abs(this.endX - this.x) / 2, this.y + Math.abs(this.endY - this.y) / 2);

  this.turn = function() {
    this.rotate(-1, this.centre);
  }
}
Line.prototype = new Shape();

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
  this.shapes = [];

  this.draw = function(style) {
    for (var i = 0; i < this.shapes.length; i++) {
      this.shapes[i].draw(this.context, style)
    }
  }

  this.clearBoard = function() {
    this.context.clearRect(0, 0, this.width, this.height)
  }

  this.clearDraw = function(style) {
    this.clearBoard()
    for (var i = 0; i < this.shapes.length; i++) {
      this.shapes[i].draw(this.context, "black")
    }
  }

  this.turn = function() {
    for (var i = 0; i < this.shapes.length; i++) {
      this.shapes[i].turn()
    }
  }

}

var getBoard = function() {
  var canvas = document.getElementById("myCanvas");
  var context = canvas.getContext("2d");

  return(new Board(1000, 500, 1, context));
}

var start = function() {
  var board = getBoard();
  var mySquare = new Square(board, 300, 200, 100, 100);

  var myLine = new Line(board, 300, 250, 400, 250);

  board.shapes.push(mySquare);
  board.shapes.push(myLine);

  mySquare.rotate(-15, mySquare.centre);
  myLine.rotate(-15, myLine.centre);

  board.draw("black")

  setInterval(function() {
    board.turn()
  }, 1000 / 60);
  setInterval(function() {
    board.clearDraw();
  }, 1000 / 60);
}
