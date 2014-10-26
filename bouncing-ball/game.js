function Man(x,y, diameter, direction, speed, colour) {
    this.x = x;
    this.y = y;
    this.diameter = diameter
    this.direction = direction;
    this.speed = speed; // how far to go in each tick
    this.colour = colour

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

      if (this.x < 8) {
        if (this.direction < 270) {
          this.direction = 90 + (270 - this.direction);
        } else {
          this.direction = (90 - (this.direction - 270) ) % 360;
        this.x = 8;
        }
      }


      if (this.x > 290) {
          if (this.direction < 90) {
              this.direction = 270 + (90 - this.direction)
          } else {
              this.direction = 270 + (90 - this.direction)
          }
        this.x = 290;
      }

      if (this.y < 7) {
        if (this.direction < 180) {
          this.direction = (180 - this.direction ) % 360;
        } else {
          this.direction = 360 - (this.direction - 180);
        }
        this.y = 7
      }

      if (this.y > 145) {
        if (this.direction < 90) {
          this.direction = 90 + (90 - this.direction);
        } else {
            this.direction = 180 + (360 - this.direction)
        }
        this.y = 145
      }
    }
}


var people = [
  new Man(100,100,6, 25,  3, "red"),
  new Man(200,50, 7, 225, 4, "yellow"),
  new Man(80 ,50, 8, 125, 2, "green")
  ]

var ctx;
var info;
function setup() {
  var c = document.getElementById("canvas");
  ctx = c.getContext("2d");
  info = document.getElementById("info");
}

log = function(message) {
  info.innerHTML = message;
}

clear = function(ctx) {
  ctx.fillStyle = "grey";
  ctx.fillRect(0,0,400,400)
}


function tick() {
  clear(ctx)
  for (i = 0; i < people.length; i++) {
    people[i].move(ctx)
    people[i].draw(ctx, true)

  }
}

function begin() {
  setup();
  setInterval(tick, 15);
}
