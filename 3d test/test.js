function Point(x, y) {
  this.x = x;
  this.y = y;
}

function Shape(lines) {
  this.lines = lines;

  this.draw = function(ctx) {

    for (var lIndex = 0; lIndex < this.lines.length; lIndex++) {
      ctx.beginPath();
      for (var i = 0; i < this.lines[lIndex].length; i++) {
        var line =  this.lines[lIndex];
        for (var j = 0; j < line.length; j++) {
          var point = line[j];
          if (j === 0) {
            ctx.moveTo(point.x, point.y);
          } else {
            ctx.lineTo(point.x, point.y);
          }
        }
      }
      ctx.stroke();
    }
  }

  this.rotate = function(degreesToRotate, point) {


  }
}

function Square(x, y, w, h) {
  this.lines = [[new Point(x ,y), new Point(x + w, y), new Point(x + w, y + h), new Point(x, y + h), new Point(x, y)]]
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

  this.draw = function() {
    for (var i in this.shapes) {
      this.shapes[i].draw(this.context);
    }
  }

}

var getBoard = function() {
  var canvas = document.getElementById("myCanvas");
  var context = canvas.getContext("2d");

  return(new Board(500, 250, 1, context));
}

var start = function() {
  var board = getBoard();
  var mySquare = new Square(100, 100, 50, 30);
  board.shapes.push(mySquare);

  board.draw()

  mySquare.rotate(20, new Point(100, 100))

  board.draw();
}
