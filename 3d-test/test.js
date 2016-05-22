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

  this.radToDeg = function(rad) {
    return  rad / (Math.PI / 180.0)
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

function Line(board, x, y, l, angle) {
  this.board = board;
  this.startPoint = new Point(x,y);
  this.endPoint = new Point(x,y);
  this.centre = new Point(x,y)
  this.l = l;
  this.angle = angle;

  this.calculateEndPoint = function() {
    this.endPoint.x = this.l * Math.cos(this.degToRad(this.angle)) + this.startPoint.x;
    this.endPoint.y = this.l * Math.sin(this.degToRad(this.angle)) + this.startPoint.y;

  }

  this.calculateCentre = function() {
    this.centre.x = this.startPoint.x + ((this.endPoint.x - this.startPoint.x) / 2.0)
    this.centre.y = this.startPoint.y + ((this.endPoint.y - this.startPoint.y) / 2.0)
  }

  this.changeLength = function(changeInLength) {
    // calc new startPoint and endPoint....
    this.l += changeInLength
    var adj = this.endPoint.x - this.startPoint.x
    var rads = Math.acos(adj / this.l);
    this.startPoint.x -= (changeInLength) * Math.cos(rads);
    this.startPoint.y -= (changeInLength) * Math.sin(rads);
    this.endPoint.x += (changeInLength) * Math.cos(rads);
    this.endPoint.y += (changeInLength) * Math.sin(rads);
  }

  this.calculateEndPoint();
  this.calculateCentre();

  this.verticies = [this.startPoint, this.endPoint]
  this.segments = [[this.verticies[0], this.verticies[1]]];

  this.turn = function() {
    //this.rotate(1, this.centre);
    //this.l += 1;
    this.changeLength(0.5)
    //this.calculateEndPoint();
    //this.calculateCentre();

  //  this.rotate(1, this.centre);

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

  var myLine = new Line(board, 390, 250, 100, 0);

  board.shapes.push(mySquare);
  board.shapes.push(myLine);

  //myLine.rotate(-15, myLine.centre);

  board.draw("black")

  setInterval(function() {
    board.turn()
  }, 1000 / 60);
  setInterval(function() {
    board.clearDraw();
  }, 1000 / 60);
}
