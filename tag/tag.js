function Thing(board, x, y) {
  this.x = x;
  this.y = y;
  this.board = board;
  this.step = null;

  this.turn = function() {}

  this.canMoveUp = function() {
    var varCanMoveUp = true
    for (var i = 0; i <= this.width; i++) {
      if (this.board.isBlocked(this.x + i, this.y - 1)) {
        varCanMoveUp = false;
      }
    }
    return (varCanMoveUp);
  }

  this.falling = function() {
    return !this.onGround()
  }

  this.onGround = function() {
    var onGround = false
    for (var i = 0; i <= this.width; i++) {
      if (this.board.isBlocked(this.x + i, this.y + this.height + 0.1)) {
        onGround = true;
      }
    }
    return (onGround);
  }

  this.againstLeftLine = function() {
    var varLeftLine = false
    for (var i = 0; i <= this.step; i++) {
      for (var j = 0.1; j <= this.height; j++) {
        if (this.board.isBlocked(this.x - i, this.y + j)) {
          varLeftLine = true;
          break;
        }
      }
    }
    return (varLeftLine);
  }

  this.againstRightLine = function() {
    var varRightLine = false
    for (var i = 0; i <= this.step; i++) {
      for (var j = 0.1; j <= this.height; j++) {
        if (this.board.isBlocked(this.x + this.width + i, this.y + j)) {
          varRightLine = true;
          break;
        }
      }
    }
    return (varRightLine);
  }

  this.within = function(thing) {
    if ((this.x - thing.width + 1 <= thing.x && this.x + this.width - 1 >= thing.x) &&
      (this.y - thing.height + 1 <= thing.y && this.y + this.height - 1 >= thing.y)) {
        return true;
    } else {
      return false;
    }
  }
} // end of Thing

function getMilliseconds() {
  return new Date().getTime();
}

function Man(board, x, y, height, width, colour, button1, button2, button3, button4) {
  this.x = x;
  this.y = y - height;
  this.board = board;
  this.lineAbove = false;
  this.lineBelow = false;
  this.height = height;
  this.width = width;
  this.colour = colour;
  this.button1 = button1;
  this.button2 = button2;
  this.button3 = button3;
  this.button4 = button4;
  this.upForce = 0;
  this.downForce = 0;
  this.jumps = false;
  this.currentlyJumping = false
  this.jumping = false;
  this.falling = false;
  this.counter = 0;
  this.direction = 0;
  this.xChange = 0;
  this.lastBulletTime = null;
  this.getBulletTime = null;
  this.lastXChange = 1;
  this.bullets = 10;
  this.bulletSpeed = 5;
  this.tagTimer = getMilliseconds()
  this.score = 0;
  this.step = 5;

  this.draw = function() {
    //body
    this.board.context.fillStyle = this.colour;
    this.board.context.fillRect(this.x, this.y, this.width, this.height)
    var player1x = Math.pow(this.board.playerNamesArray[0].length, 1) * 5;
    var player2x = Math.pow(this.board.playerNamesArray[1].length, 1) * 5;
    this.board.context.font = "20px Verdana"
    if (this.board.men.indexOf(this) === 0) {
      this.board.context.fillText(this.board.playerNamesArray[0] + ": "+ this.bullets, this.x - player1x, this.y - 3)
    } else {
      this.board.context.fillText(this.board.playerNamesArray[1] + ": " + this.bullets, this.x - player2x, this.y - 3)
    }
  }

  this.bulletDirection = function(man) {
    if (man.lastXChange === 1) {
      return (man.width + 1)
    } else {
      var bt = new Bullet(board, 0, 0, man.lastXChange)
      return (-bt.width)
    }
  }

  this.removeAllBullets = function() {
    for (var i = this.board.bullets.length - 1; i >= 0; i--) {
      this.board.removeBullet(this.board.bullets[i])
    }
  }

  this.bulletNotInLine = function(b, x) {
    var notInLine = true
    if (x > 0) {
      for (var i = 0; i <= x; i++) {
        for (var j = 0; j < b.height; j++) {
          if (this.board.isBlocked(b.x + i, b.y + j)) {
            notInLine = false
            break;
          }
        }
      }
    } else {
      for (var i = 0; i >= x; i--) {
        for (var j = 0; j < b.height; j++) {
          if (this.board.isBlocked(b.x + i, b.y + j)) {
            notInLine = false
            break;
          }
        }
      }
    }
    if (notInLine) {
      return true;
    } else {
      return false;
    }
  }

  this.testForTagWithBullet = function(b) {
    if (this.colour !== "red") {
      var m = this
      if (b.x + b.width - 1 >= m.x && b.x <= m.x + m.width - 1 && b.y + b.height - 1 >= m.y && b.y <= m.y + m.height - 1) {
        return true
      }
    }
    return false
  }

  this.bulletCanGetCloser = function(b, x) {
    var canGetCloser = true
    for (var i = 0; i < b.height; i++) {
      if (this.board.isBlocked(b.x + x + b.direction, b.y + i)) {
        canGetCloser = false;
        break;
      }
    }
    if (canGetCloser) {
      return true
    } else {
      return false
    }
  }

  this.shoot = function(man) {
    if (this.lastBulletTime == null || this.lastBulletTime < (getMilliseconds() - 150)) {
      this.bullets -= 1
      var bullet = new Bullet(board, man.x + this.bulletDirection(man), man.y + man.width / 2, man.lastXChange)
      bullet.x = (man.x + man.width / 2) - bullet.width / 2
      this.board.addBullet(bullet);
      this.lastBulletTime = getMilliseconds();
    }
  }

  this.turn = function() {
    //score stuff
    if (this.colour !== "red") {
      this.score += 1
    }

    //moving stuff
    if (this.jumps && !this.currentlyJumping) {
      this.upForce = 18;
      this.jumping = true;
      this.currentlyJumping = true;
    }
    if (this.currentlyJumping) {
      this.jumps = false;
    }
    if (this.onGround() && this.currentlyJumping) {
      this.currentlyJumping = false;
      this.downForce = 1;
    }
    if (this.falling && this.upForce > 0) {
      this.upForce = 0;
      this.jumping = false;
    }
    if (!this.onGround() && !this.jumping) {
      this.falling = true;
      this.downForce = 1;
    } else {
      this.falling = false;
      this.downForce = 0;
    }
    if (this.jumping) {
      var oldUpForce = this.upForce
      this.upForce = Math.floor(oldUpForce * .89);
      var canMoveUpForceUp = true
      for (var i = 1; i <= this.width; i++) {
        for (var j = 0; j <= this.height + this.upForce; j++) {
          if (this.board.isBlocked(this.x + i, this.y + this.height - j)) {
            canMoveUpForceUp = false
            break;
          }
        }
        if (!canMoveUpForceUp) {
          break;
        }
      }
      if (canMoveUpForceUp && this.canMoveUp() && this.upForce > 0) {
        this.y -= this.upForce
      } else if (!canMoveUpForceUp && this.canMoveUp() && this.upForce > 0) {
        var distanceCanMoveUp = 0
        var canMoveUp = true;
        var readyToIncrease = true;
        while (canMoveUp) {
          readyToIncrease = true
          for (var i = 0; i <= this.width; i++) {
            if (this.board.isBlocked(this.x + i, this.y - distanceCanMoveUp - 0.1)) {
              canMoveUp = false
              readyToIncrease = false
              break;
            }
          }
          if (readyToIncrease) {
            distanceCanMoveUp += 0.1;
          } else {
            canMoveUp = false
            break;
          }
        }
        this.y -= distanceCanMoveUp
      } else {
        this.counter += 2;
      }
      if (this.counter > 10) {
        this.counter = 0;
        this.downForce = 1
        this.jumping = false
        this.falling = true
      }
    }
    if (this.falling) {
      this.counter += 0.1
      var canMoveDownForceDown = true
      for (var i = 1; i <= this.width; i++) {
        for (var j = 0; j <= this.height; j++) {
          if (this.board.isBlocked(this.x + i, this.y + (this.downForce * this.counter) + j)) {
            canMoveDownForceDown = false;
            break;
          }
        }
        if (!canMoveDownForceDown) {
          break;
        }
      }
      if (canMoveDownForceDown) {
        this.y += this.downForce * this.counter;
      } else {
        var distanceCanMoveDown = 0
        var canMoveDown = true;
        var readyToIncrease = true;
        while (canMoveDown) {
          readyToIncrease = true
          for (var i = 0; i <= this.width; i++) {
            if (this.board.isBlocked(this.x + i, this.y + this.height + distanceCanMoveDown + 0.1)) {
              readyToIncrease = false
              break;
            }
          }
          if (readyToIncrease) {
            distanceCanMoveDown += 0.1;
          } else {
            canMoveDown = false
            break;
          }
        }
        if (distanceCanMoveDown < this.downForce * this.counter) {
          this.y += distanceCanMoveDown
          this.falling = false;
          this.currentlyJumping = false;
          this.counter = 0;
          this.downForce = 0;
        } else {
          this.y += this.downForce * this.counter;
        }
      }
    }

    if ((this.xChange < 0 && !this.againstLeftLine()) ||
    (this.xChange > 0 && !this.againstRightLine())) {
      this.x += this.xChange * this.step;
      this.direction = this.xChange
    }
    this.xChange = 0;
    if (this.bullets < 10 && this.colour === "red") {
      if (this.getBulletTimer === null) {
        this.getBulletTimer = getMilliseconds()
      }
      if (this.getBulletTimer < (getMilliseconds() - 2000)) {
        this.bullets += 1
        this.getBulletTimer = getMilliseconds()
      }
    } else {
      this.getBulletTimer = null
    }

    if (this.againstLeftLine() && this.board.keyMap[this.button1]) {
      var distanceCanMoveLeft = 0
      var canMoveLeft = true;
      var readyToIncrease = true;
      while (canMoveLeft) {
        readyToIncrease = true
        for (var i = 0; i <= this.height; i++) {
          if (this.board.isBlocked(this.x - distanceCanMoveLeft - 0.2, this.y + i)) {
            readyToIncrease = false
            break;
          }
        }
        if (readyToIncrease) {
          distanceCanMoveLeft += 0.1;
        } else {
          canMoveLeft = false
          break;
        }
      }
      if (distanceCanMoveLeft < 4) {
        this.x -= distanceCanMoveLeft
      } else {
        this.x -= 1
      }
    }
    if (this.againstRightLine() && this.board.keyMap[this.button2]) {
      var distanceCanMoveRight = 0
      var canMoveRight = true;
      var readyToIncrease = true;
      while (canMoveRight) {
        readyToIncrease = true
        for (var i = 0; i <= this.height; i++) {
          if (this.board.isBlocked(this.x + this.width + distanceCanMoveRight + 0.2, this.y + i)) {
            readyToIncrease = false
            break;
          }
        }
        if (readyToIncrease) {
          distanceCanMoveRight += 0.1;
        } else {
          canMoveRight = false
          break;
        }
      }
      if (distanceCanMoveRight < 4) {
        this.x += distanceCanMoveRight
      } else {
        this.x += 1
      }
    }

    //bullet and tagging stuff
    if (this.board.men[1].colour === "red") {
      this.board.men[0].bullets = 0
    } else {
      this.board.men[1].bullets = 0
    }
    for (var i = 0; i < this.board.bullets.length; i++) {
      var readyToRemoveBullet = false
      var bulletX = 1
      if (this.board.bullets[i].direction < 0) {
        bulletX = -this.bulletSpeed
      } else {
        bulletX = this.board.bullets[i].width + this.bulletSpeed
      }
      if (this.bulletNotInLine(this.board.bullets[i], bulletX)) {
        this.board.bullets[i].x += this.board.bullets[i].direction * this.bulletSpeed
        this.board.bullets[i].counter = 0
      } else {
        if (this.board.bullets[i].direction > 0) {
          bulletX = this.board.bullets[i].width
        } else {
          bulletX = 0
        }
        if (!this.bulletCanGetCloser(this.board.bullets[i], bulletX)) {
          this.board.bullets[i].counter += 1
        } else {
          this.board.bullets[i].x += this.board.bullets[i].direction
        }
      }
      if (this.board.bullets[i].counter > 200) {
        readyToRemoveBullet = true
      }
      if (this.testForTagWithBullet(this.board.bullets[i])) {
        this.board.toBeIn = true
      }
      if (readyToRemoveBullet) {
        this.board.removeBullet(this.board.bullets[i])
      }
    }
    if (this.bullets > 0) {
      if (this.board.keyMap[this.button4] && this.colour === "red") {
        this.shoot(this)
      }
    }
    if (this.board.men[0].within(this.board.men[1])) {
      this.board.changeTag = true
    } else {
      this.board.changeTag = false
    }
    if (this.board.changeTag) {
      this.board.toBeIn = true
    }
    if (this.board.toBeIn && !this.board.changeTag) {
      if (this.tagTimer < (getMilliseconds() - 300)) {
        this.removeAllBullets()
        if (this.board.men[1].colour === "red") {
          this.board.men[0].colour = "red"
          this.board.men[0].bullets = 10
          this.board.men[1].colour = "purple"
          this.board.men[1].bullets = 0
          this.board.toBeIn = false;
        } else if (this.board.men[0].colour === "red") {
          this.board.men[0].colour = "blue"
          this.board.men[0].bullets = 0
          this.board.men[1].colour = "red"
          this.board.men[1].bullets = 10
          this.board.toBeIn = false;
        }
        this.tagTimer = getMilliseconds()
      } else {
        this.board.toBeIn = false
      }
    }
  }// end of turn

  this.jump = function() {
    this.jumps = true;
  }

  this.moveleft = function() {
    this.xChange = -1;
    this.lastXChange = -1;
  }

  this.moveright = function() {
    this.xChange = 1;
    this.lastXChange = 1;
  }

}

Man.prototype = new Thing()

function Line(board, x, y, width, height) {
  this.board = board
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;

  this.draw = function() {
    this.board.context.fillStyle = "black";
    this.board.context.fillRect(this.x, this.y, this.width, this.height)
  }
}

Line.prototype = new Thing()

function Bullet(board, x, y, direction) {
  this.board = board
  this.x = x;
  this.y = y;
  this.width = 10
  this.height = 4
  this.counter = 0;
  this.direction = direction;
  this.lastBulletTime = null;
  this.counter = 0;

  this.draw = function() {
    this.board.context.fillStyle = "white";
    this.board.context.fillRect(this.x, this.y, this.width, this.height)
  }
}

Bullet.prototype = new Thing()

function Score(board, man, x, y) {
  this.board = board;
  this.scoreMan = man;
  this.x = x;
  this.y = y;

  this.draw = function() {
    this.board.context.fillStyle = "black";
    this.board.context.font = "20px Verdana"
    this.board.context.fillText("Score of Player " + (this.board.men.indexOf(this.scoreMan) + 1) + ": " + this.scoreMan.score, this.x, this.y)
  }
}

Score.prototype = new Thing()

function Board(width, height, pixelWidth, context) {
  this.changeTag = false;
  this.toBeIn = false;
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
  this.playerNamesArray = [];
  this.men = [];
  this.lines = [];
  this.elevators = [];
  this.spikes = [];
  this.bullets = [];
  this.scores = [];
  this.paused = false;

  this.add = function(thing) {
    this.things.push(thing);
  }

  this.remove = function(thing) {
    var index = this.things.indexOf(thing)
    if (index > -1) {
      this.things.splice(index, 1);
    }
  }

  this.removeBullet = function(bullet) {
    var index = this.bullets.indexOf(bullet)
    if (index > -1) {
      this.bullets.splice(index, 1);
    }
    this.remove(bullet);
  }

  this.addMan = function(man) {
    this.men.push(man);
  }

  this.addLines = function(line) {
    this.lines.push(line);
    this.add(line);
  }

  this.addBullet = function(bullet) {
    this.bullets.push(bullet);
    this.add(bullet);
  }

  this.addScore = function(score) {
    this.scores.push(score)
    this.add(score)
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

  this.isBlocked = function(x, y) {
    for (var i = 0; i < this.lines.length; i++) {
      if ((x >= this.lines[i].x && x <= (this.lines[i].x + this.lines[i].width)) &&
      (y >= this.lines[i].y && y <= (this.lines[i].y + this.lines[i].height))) {
        return true;
      }
    }
    return false;
  }

  this.turn = function() {
    for (var i = 0; i < this.things.length; i++) {
      this.things[i].turn()
    }
    if (this.keyMap[this.men[0].button3]) {
      this.men[0].jump();
    }
    if (this.keyMap[this.men[0].button1]) {
      this.men[0].moveleft();
    }
    if (this.keyMap[this.men[0].button2]) {
      this.men[0].moveright();
    }
    if (this.keyMap[this.men[1].button3]) {
      this.men[1].jump();
    }
    if (this.keyMap[this.men[1].button1]) {
      this.men[1].moveleft();
    }
    if (this.keyMap[this.men[1].button2]) {
      this.men[1].moveright();
    }
  }

  this.keyUpDown = function(e){
    e = e || event; // to deal with IE
    board.keyMap[e.keyCode] = e.type == 'keydown';
  }
}

var getBoard = function() {
  var canvas = document.getElementById("myCanvas")
  var context = canvas.getContext("2d");

  return(new Board(1300, 600, 1, context));
}

var board = null;

var pause = function() {
  if (board.paused) {
    board.paused = false
    document.getElementById("myCanvas").style.backgroundColor = "silver"
    document.getElementById("pauseSign").style.visibility = "hidden"
  } else {
    board.paused = true
    document.getElementById("myCanvas").style.backgroundColor = "gray"
    document.getElementById("pauseSign").style.visibility = "visible"
  }
}

var add = function() {
  var line = new Line(board, board.width / 2 - 240, board.height - 20, 25, 5)
  var line2 = new Line(board, board.width / 2 - 180, board.height - 50, 25, 5)
  var line3 = new Line(board, board.width / 2 - 110, board.height - 80, 25, 5)
  var line4 = new Line(board, board.width / 2 - 60, board.height - 110, 25, 5)
  var line5 = new Line(board, board.width / 2, board.height - 140, 25, 5)
  var line6 = new Line(board, board.width / 2 + 60, board.height - 170, 25, 5)
  var line7 = new Line(board, board.width / 2 + 180, board.height - 175, 25, 5)
  var line8 = new Line(board, board.width / 2 + 280, board.height - 210, 25, 5)
  var lineblock = new Line(board, board.width / 2 + 380, board.height - 240, 80, 220)

  var block = new Line(board, 0, board.height - 120, 50, 120)
  var block2 = new Line(board, 40, board.height - 80, 50, 80)
  var block3 = new Line(board, 80, board.height - 40, 50, 40)

  var l = new Line(board, 200, board.height - 40, 10, 40)
  var l2 = new Line(board, 700, board.height - 30, 15, 30)
  var l3 = new Line(board, 1250, board.height - 100, 50, 5)
  var l4 = new Line(board, 1250, board.height - 200, 50, 5)
  var l5 = new Line(board, 1250, board.height - 300, 50, 5)
  var l6 = new Line(board, 1250, board.height - 400, 50, 5)
  var l7 = new Line(board, 1250, board.height - 500, 50, 5)

  var l8 = new Line(board, 950, board.height - 500, 50, 5)
  var l9 = new Line(board, 650, board.height - 500, 50, 5)
  var l10 = new Line(board, 350, board.height - 500, 50, 5)
  var l11 = new Line(board, 50, board.height - 500, 50, 5)

  var l12 = new Line(board, 90, board.height - 350, 150, 10)
  var l13 = new Line(board, 90, board.height - 400, 10, 50)
  var l14 = new Line(board, 230, board.height - 400, 10, 50)
  var l15 = new Line(board, 90, board.height - 400, 100, 10)

  var l16 = new Line(board, board.width / 2 + 30, board.height - 270, 25, 5)
  var l17 = new Line(board, board.width / 2 - 60, board.height - 370, 25, 5)
  var l18 = new Line(board, board.width / 2 - 170, board.height - 470, 25, 5)

  var l19 = new Line(board, board.width / 2 + 400, board.height - 353, 50, 7)

  var l20 = new Line(board, 100, board.height - 200, 40, 5)
  var l21 = new Line(board, 175, board.height - 250, 40, 5)
  var l22 = new Line(board, 250, board.height - 300, 40, 5)
  var l23 = new Line(board, 325, board.height - 350, 40, 5)
  var l24 = new Line(board, 400, board.height - 400, 40, 5)

  board.addLines(line);
  board.addLines(line2);
  board.addLines(line3);
  board.addLines(line4);
  board.addLines(line5);
  board.addLines(line6);
  board.addLines(line7);
  board.addLines(line8);
  board.addLines(lineblock);

  board.addLines(block);
  board.addLines(block2);
  board.addLines(block3);

  board.addLines(l)
  board.addLines(l2)
  board.addLines(l3)
  board.addLines(l4)
  board.addLines(l5)
  board.addLines(l6)
  board.addLines(l7)
  board.addLines(l8)
  board.addLines(l9)
  board.addLines(l10)
  board.addLines(l11)
  board.addLines(l12)
  board.addLines(l13)
  board.addLines(l14)
  board.addLines(l15)
  board.addLines(l16)
  board.addLines(l17)
  board.addLines(l18)
  board.addLines(l19)
  board.addLines(l20)
  board.addLines(l21)
  board.addLines(l22)
  board.addLines(l23)
  board.addLines(l24)

  var top = new Line(board, 0, 0, board.width, 1)
  var bottom = new Line(board, 0, board.height - 1, board.width, 1)
  var left = new Line(board, 0, 0, 1, board.height)
  var right = new Line(board, board.width - 1, 0, 1, board.height)

  board.addLines(top);
  board.addLines(bottom);
  board.addLines(left);
  board.addLines(right);

  var man1X = Math.floor(Math.random() * (board.width / 2)) + 50
  while (man1X < 130) {
    man1X = Math.floor(Math.random() * (board.width / 2)) + 50
  }
  var man2X = Math.floor(Math.random() * (board.width / 2)) + board.width / 2 - 50
  while (man2X > board.width / 2 + 370 && man2X < board.width / 2 + 480) {
    man2X = Math.floor(Math.random() * (board.width / 2)) + board.width / 2 - 50
  }

  var man1 = new Man(board, man1X, 500, 16, 9, "blue", "37", "39", "38", "32")
  var man2 = new Man(board, man2X, 500, 16, 9, "red", "65", "68", "87", "49")

  board.add(man1);
  board.addMan(man1);

  board.add(man2);
  board.addMan(man2);

  var score1 = new Score(board, man1, 50, 50)
  var score2 = new Score(board, man2, 900, 50)

  board.addScore(score1)
  board.addScore(score2)
}

var submitPlayerNames = function() {
  var x = document.forms["frm1"];
  var canStart = true;
  for (var i = 0; i < x.length; i++) {
    if (x.elements[i].value.length > 0) {
      board.playerNamesArray[i] = x.elements[i].value;
    } else {
      canStart = false;
    }
  }
  if (canStart) {
    document.getElementById("playerNames").style.visibility = "hidden";
    document.getElementById("myCanvas").style.visibility = "visible";
    document.getElementById("controls").style.visibility = "visible";
    document.getElementById("pause").style.visibility = "visible";
    start()
  }
};

var setUp = function() {
  board = getBoard()//new Board(1000, 500, 1, context);

  document.getElementById("playerNames").style.visibility = "visible";
  document.getElementById("myCanvas").style.visibility = "hidden";
  document.getElementById("controls").style.visibility = "hidden";
  document.getElementById("pause").style.visibility = "hidden";
};

var start = function() {
  add()

  document.onkeydown = board.keyUpDown;
  document.onkeyup = board.keyUpDown;

  window.addEventListener("keydown", function(e) {
    // space and arrow keys
    window.scroll(0,0);
    if ([37, 39, 38, 40, 32].indexOf(e.keyCode) > -1) {
      e.preventDefault();
    }
  }, false);

  setInterval(function() {
    if (!board.paused)
      board.drawCells();
  }, 1000 / 60);

  setInterval(function() {
    if (!board.paused)
      board.turn()
  }, 1000 / 60);
};
