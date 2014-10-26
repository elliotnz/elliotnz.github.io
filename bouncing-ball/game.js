
function Ball(board, x,y, diameter, direction, speed, colour) {
    this.board = board;
    this.x = x;
    this.y = y;
    this.diameter = diameter
    this.direction = direction;
    this.speed = speed; // how far to go in each tick
    this.colour = colour;
    var BORDER = 10;

    this.draw = function(ctx, fill) {
      ctx.beginPath();
      ctx.fillStyle = colour;
      ctx.arc(this.x, this.y, this.diameter,0, 2 * Math.PI)
      if(fill){
            ctx.fill()
      }
      ctx.stroke();

    }

    this.move = function(ctx) {
      var radians = this.direction * (Math.PI / 180.0); // degrees
      this.x += this.speed * Math.sin(radians);
      this.y += this.speed * Math.cos(radians);

      if (this.x < BORDER) {
        if (this.direction < 270) {
          this.direction = 90 + (270 - this.direction);
        } else {
          this.direction = (90 - (this.direction - 270) ) % 360;
        this.x = BORDER;
        }
      }

      if (this.x > (this.board.width - BORDER)) {
          if (this.direction < 90) {
              this.direction = 270 + (90 - this.direction)
          } else {
              this.direction = 270 + (90 - this.direction)
          }
        this.x = this.board.width - BORDER;
      }

      if (this.y < BORDER) {
        if (this.direction < 180) {
          this.direction = (180 - this.direction ) % 360;
        } else {
          this.direction = 360 - (this.direction - 180);
        }
        this.y = BORDER;
      }

      if (this.y > (this.board.height - BORDER)) {
        if (this.direction < 90) {
          this.direction = 90 + (90 - this.direction);
        } else {
            this.direction = 180 + (360 - this.direction)
        }
        this.y = this.board.height - BORDER;
      }
    }
}

function Board(canvas, width, height) {
  this.width = width;
  this.height = height;
  this.ctx = document.getElementById(canvas).getContext("2d");
  this.info = document.getElementById("info");
  this.balls = [
    new Ball(this, 100,100,6, 25,  3, "red"),
    new Ball(this, 200,50, 7, 225, 4, "yellow"),
    new Ball(this, 80 ,50, 8, 125, 2, "green")
  ]
  this.ctx.canvas.width = width;
  this.ctx.canvas.height = height;
  document.getElementById(canvas).style.width = '' + (width  + 50)  + 'px';
  document.getElementById(canvas).style.height = '' + (height + 50) + 'px' ;

  this.log = function(message) {
    info.innerHTML = message;
  }

  this.clear = function() {
    this.ctx.fillStyle = "grey";
    this.ctx.fillRect(0,0,width,height)
  }

  this.tick = function() {
    this.clear()
    for (i = 0; i < this.balls.length; i++) {
      this.balls[i].move(this.ctx)
      this.balls[i].draw(this.ctx, true)
    }
  }

}

function begin() {
  var board = new Board("canvas", 600, 400)
  setInterval(function() {board.tick()}, 1000/60.0);
}
