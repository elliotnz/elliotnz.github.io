function Point(x, y) {
  this.x = x;
  this.y = y;

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


  // sin(o) = o/h
  this.rotate = function(degreesToRotate, origin) {
    var radians = degreesToRotate * (Math.PI / 180.0);
    for (var i = 0; i < this.verticies.length; i++) {
      var point = this.verticies[i];
      // first with pythagorus to get length H
      //  c**2 = a**2 + b**2
      var a2 = Math.abs(point.x - origin.x) * Math.abs(point.x - origin.x);
      var b2 = Math.abs(point.y - origin.y) * Math.abs(point.y - origin.y);
      var hyp = Math.sqrt(a2 + b2); // c or hypotenuse
      var opp = Math.sin(radians) * hyp;
      var adj = opp / Math.tan(radians);
      var o = Math.sin(radians) * adj;
      var a = o / Math.tan(radians);
      // new x and y
      var newX = point.x + a;
      var newY = point.y + o;
      console.log("Old point (" + point.x + ", " + point.y + ")")
      point.x = Math.floor(newX);
      point.y = Math.floor(newY);
      console.log("New point (" + point.x + ", " + point.y + ")")
    }
    this.debug()
  }

  this.debug = function() {
    for (var i = 0; i < this.verticies.length; i++) {
      point = this.verticies[i]
      console.log("point (" + point.x + ", " + point.y + ")")
    }

  }
}

function Square(x, y, w, h) {
  this.verticies = [new Point(x ,y), new Point(x + w, y), new Point(x + w, y + h), new Point(x, y + h)]
  this.segments =
    [
      [this.verticies[0], this.verticies[1], this.verticies[2], this.verticies[3], this.verticies[0]],
      [this.verticies[0], this.verticies[2]]
    ];

}
Square.prototype = new Shape();

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
  this.shapes = new Array()

  this.draw = function(style) {
    for (var i in this.shapes) {
      this.shapes[i].draw(this.context, style);
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
  var rotateOrigin = new Point(50, 50);
  var mySquare = new Square(100, 100, 100, 100);

  board.shapes.push(mySquare);
  board.shapes.push(rotateOrigin);

  board.draw("black")

  mySquare.rotate(25, rotateOrigin)

  board.draw("red");
}
