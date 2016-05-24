var game = new Game();

function Game() {
  this.keyMap = [];
  this.alert = false;
  this.balls = [];
  this.browserWidth = null;
  this.browserHeight = null;
  this.playerBalls = [];

  this.addball = function(ball) {
    var node = document.createElement("div");
    node.setAttribute("class", "ball");
    node.style.position = "absolute";
    node.style.borderRadius = "50%";

    if (!ball.player) {
      node.style.zIndex="-1"
    }
    node.style.marginLeft = (((window.innerWidth || document.body.clientWidth) - ball.size) / 2) + "px";
    node.style.marginTop = (((window.innerHeight || document.body.clientHeight) - ball.size) / 4 + (this.balls.length - 1) * 100) + "px";
    node.style.width = ball.size + "px";
    node.style.height = ball.size + "px";

    document.getElementsByTagName("body")[0].appendChild(node);
    this.balls.push(ball);
  }

  this.getballs = function() {
    for (var i in this.balls) {
      if (this.balls[i].player) {
        this.playerBalls.push(this.balls[i]);
        this.balls[i].myPosition = i;
        //this.ballPosition = i;
        //break;
      }
    }
  }

  this.turn = function() {
    if (this.playerBalls.length === 0) {
      this.getballs();
    }
    this.browserWidth = (window.innerWidth || document.body.clientWidth);
    this.browserHeight = (window.innerHeight || document.body.clientHeight);
    for (var i in this.balls) {
      this.balls[i].turn();
    }
    if (this.keyMap['37']) {
      for (var i in this.playerBalls) {
        this.playerBalls[i].moveHorizontal(-1);
      }
    }
    if (this.keyMap['39']) {
      for (var i in this.playerBalls) {
        this.playerBalls[i].moveHorizontal(1);
      }
    }
    if (!this.keyMap['37'] && !this.keyMap['39']) {
      for (var i in this.playerBalls) {
        this.playerBalls[i].notPressingHorizontal();
      }
    }
    if (this.keyMap['38']) {
      for (var i in this.playerBalls) {
        this.playerBalls[i].moveVertical(-1);
      }
    }
    if (this.keyMap['40']) {
      for (var i in this.playerBalls) {
        this.playerBalls[i].moveVertical(1);
      }
    }
    if (!this.keyMap['38'] && !this.keyMap['40']) {
      for (var i in this.playerBalls) {
        this.playerBalls[i].notPressingVertical();
      }
    }
  }

  this.keyUpDown = function(e) {
    e = e || event; // to deal with IE
    game.keyMap[e.keyCode] = e.type == 'keydown';
  }
}

function Ball(player, size) {
  this.player = player;
  this.myPosition = null;
  this.size = size;
  this.x = null;
  this.y = null;
  this.speedX = 0;
  this.speedY = 0;
  this.speedY = 0;
  this.drag = 1;

  this.turn = function() {
    if (this.player) {
      this.x = parseInt(document.getElementsByClassName("ball")[this.myPosition].style.marginLeft);
      this.y = parseInt(document.getElementsByClassName("ball")[this.myPosition].style.marginTop);
    }
  }

  this.moveHorizontal = function(direction) {
    var speed = direction * (10000 / (parseInt(document.getElementsByClassName("ball")[this.myPosition].style.width) * parseInt(document.getElementsByClassName("ball")[this.myPosition].style.height)));
    this.speedX += speed;
    speed = this.speedX;
    var browserWidth = game.browserWidth - this.size;
    if ((this.x + speed) > 0 && (this.x + speed) < browserWidth) {
      this.x += speed;
    } else if ((this.x + speed) > 0 && speed < 0) {
      this.x += speed;
    } else if (this.x > 0 && (this.x + speed) < browserWidth) {
      this.x -= this.x;
    } else if (this.x < browserWidth && (this.x + speed) > 0) {
      this.x += browserWidth - this.x;
    } else {
      this.speedX *= -0.5;
    }
    document.getElementsByClassName("ball")[this.myPosition].style.marginLeft = (this.x) + "px";
  }

  this.moveVertical = function(direction) {
    var speed = direction * (10000 / (parseInt(document.getElementsByClassName("ball")[this.myPosition].style.width) * parseInt(document.getElementsByClassName("ball")[this.myPosition].style.height)));
    this.speedY += speed;
    speed = this.speedY;
    var browserHeight = game.browserHeight - this.size;
    if ((this.y + speed) > 0 && (this.y + speed) < browserHeight) {
      this.y += speed;
    } else if ((this.y + speed) > 0 && speed < 0) {
      this.y += speed;
    } else if (this.y > 0 && (this.y + speed) < browserHeight) {
      this.y -= this.y;
    } else if (this.y < browserHeight && (this.y + speed) > 0) {
      this.y += browserHeight - this.y;
    } else {
      this.speedY *= -0.5;
    }
    document.getElementsByClassName("ball")[this.myPosition].style.marginTop = (this.y) + "px";
  }

  this.notPressingHorizontal = function() {
    if (this.speedX !== 0) {
      if ((this.drag > this.speedX && this.speedX > 0) || ((this.drag * -1) < this.speedX && this.speedX < 0)) {
        this.speedX = 0;
      } else {
        if (this.speedX < 0) {
          this.speedX += this.drag;
        } else {
          this.speedX -= this.drag;
        }
        var browserWidth = game.browserWidth - this.size;
        if ((this.x + this.speedX) > 0 && (this.x + this.speedX) < browserWidth) {
          this.x += this.speedX;
        } else if ((this.x + this.speedX) > 0 && this.speedX < 0) {
          this.x += this.speedX;
        } else if (this.x > 0 && (this.x + this.speedX) < browserWidth) {
          this.x -= this.x;
        } else if (this.x < browserWidth && (this.x + this.speedX) > 0) {
          this.x += browserWidth - this.x;
        } else {
          this.speedX *= -0.5;
        }
        document.getElementsByClassName("ball")[this.myPosition].style.marginLeft = (this.x) + "px";
      }
    }
  }

  this.notPressingVertical = function() {
    if (this.speedY !== 0) {
      if ((this.drag > this.speedY && this.speedY > 0) || ((this.drag * -1) < this.speedY && this.speedY < 0)) {
        this.speedY = 0;
      } else {
        if (this.speedY < 0) {
          this.speedY += this.drag;
        } else {
          this.speedY -= this.drag;
        }
        var browserHeight = game.browserHeight - this.size;
        if ((this.y + this.speedY) > 0 && (this.y + this.speedY) < browserHeight) {
          this.y += this.speedY;
        } else if ((this.y + this.speedY) > 0 && this.speedY < 0) {
          this.y += this.speedY;
        } else if (this.y > 0 && (this.y + this.speedY) < browserHeight) {
          this.y -= this.y;
        } else if (this.y < browserHeight && (this.y + this.speedY) > 0) {
          this.y += browserHeight - this.y;
        } else {
          this.speedY *= -0.5;
        }
        document.getElementsByClassName("ball")[this.myPosition].style.marginTop = (this.y) + "px";
      }
    }
  }
}

function start() {
  game.addball(new Ball(true, 150));
  //game.addball(new Ball(false, 75));
  game.addball(new Ball(true, 50));
  game.addball(new Ball(true, 100));
  //game.addball(new Ball(false, 75));
  game.addball(new Ball(true, 75));

  document.onkeydown = game.keyUpDown;
  document.onkeyup = game.keyUpDown;

  window.addEventListener("keydown", function(e) {
    // space and arrow keys
    if ([37, 39, 38, 40].indexOf(e.keyCode) > -1) {
      e.preventDefault();
    }
  }, false);

  setInterval(function() {
    game.turn()
  }, 1000 / 60);
}
