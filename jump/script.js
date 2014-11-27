function Thing(board, x, y) {
  this.x = x;
  this.y = y;
  this.board = board;

  this.turn = function() {}

  this.canMoveUp = function() {
    return (!this.board.isBlocked(this.x + 1, this.y - 1)
     && !this.board.isBlocked(this.x + this.width - 1, this.y + this.height)
     && !this.board.isBlocked(this.x + 1, this.y + this.height / 2)
     && !this.board.isBlocked(this.x + this.width - 1, this.y + this.height / 2))
  }

  this.falling = function() {
    return !this.onGround()
  }

  this.onGround = function() {
    return (this.board.isBlocked(this.x - 1, this.y + this.height + 1) || (this.board.isBlocked(this.x + this.width + 1, this.y + this.height + 1)))
  }

  this.againstLeftLine = function() {
    return (this.board.isBlocked(this.x - 1, this.y) ||
      this.board.isBlocked(this.x - 1, this.y + this.height) ||
      this.board.isBlocked(this.x - 1, this.y + this.height / 2));
  }

  this.againstRightLine = function() {
    return (this.board.isBlocked(this.x + this.width + 1, this.y) ||
      this.board.isBlocked(this.x + this.width + 1, this.y + this.height) ||
      this.board.isBlocked(this.x + this.width + 1, this.y + this.height / 2));
  }

  this.within = function(thing) {
    if ((this.x >= thing.x && this.x <= thing.x + thing.width) &&
      (this.y >= thing.y && this.y <= thing.y + thing.height)) {
      return true;
    } else {
      return false;
    }
  }
} // end of Thing

function getMilliseconds() {
  return new Date().getTime();
}


function Man(board, x, y, height, width) {
  this.x = x;
  this.y = y;
  this.board = board;
  this.lineAbove = false;
  this.lineBelow = false;
  this.height = height;
  this.width = width;
  this.vForce = null;
  this.xChange = 0;
  this.lastXChange = 1;
  this.step = 2;
  this.lastBulletTime = null;

  this.draw = function() {
    //body
    this.board.context.fillStyle = "blue";
    this.board.context.fillRect(this.x, this.y, this.width, this.height)
    //gun
    this.board.context.fillStyle = "rgb(0, 10, 100)";
    this.board.context.fillRect(this.x + this.gunDirection(), this.y + this.width / 2, this.width, 4)
    //handle
    this.board.context.fillRect(this.x + this.handleDirection(), this.y + (this.height / 2 * 1.25), 2, 2)
  }

  this.handleDirection = function() {
    if (this.lastXChange === 1) {
      return (this.width)
    } else {
      return (-2)
    }
  }

  this.gunDirection = function() {
    if (this.lastXChange === 1) {
      return (this.width)
    } else {
      return (-5)
    }
  }

  this.bulletDirection = function() {
    if (this.lastXChange === 1) {
      return (this.width + 1)
    } else {
      return (-1)
    }
  }

  this.shoot = function() {
    if (this.lastBulletTime == null || this.lastBulletTime < (getMilliseconds() - 150)) {
      var bullet = new Bullet(board, this.x + this. bulletDirection(), this.y + this.width / 2, this.lastXChange)
      this.board.add(bullet);
      this.lastBulletTime = getMilliseconds();
    }
  }

  this.turn = function() {
    // look above us
    if (this.vForce > 0 && this.canMoveUp()) {
      // move to the positon unless we hit something first
      var pointsToMove = Math.round(this.vForce * .3);
      for (var i = 0; i < pointsToMove; i += 1) {
        if (this.canMoveUp()) {
          this.y -= 0.5;
        } else {
          this.vForce = null;
        }
      }
      this.vForce -= 1;
    } else if (this.falling()) {
      // if we are falling
      if (this.vForce === null);
        this.vForce = 0;
      this.vForce += 1;
      var pointsToMove = Math.round(this.vForce * .7);
      for (var i = 0; i < pointsToMove; i += 0.25) {
        if (this.falling()) {
          this.y += 1;
        } else {
          this.vForce = null;
        }
      }

    } else {
      this.vForce = null;
    }
    if ((this.xChange < 0 && !this.againstLeftLine()) ||
       (this.xChange > 0 && !this.againstRightLine())) {
       this.x += this.xChange * this.step;
    }
    this.xChange = 0;
  }
  this.jump = function() {
    if (this.vForce == null)
      this.vForce = 25;
  }

  this.moveleft = function() {
      this.xChange = -1;
      this.lastXChange = -1;
  }
  this.moveright = function() {
     this.xChange = 1;
     this.lastXChange = 1;
  }
  this.hit = function() {
    return false;
  }
}
Man.prototype = new Thing()

function Monster(board, man, x, y, height, width) {
  this.x = x;
  this.y = y;
  this.board = board;
  this.man = man;
  this.lineAbove = false;
  this.lineBelow = false;
  this.height = height;
  this.width = width;
  this.vForce = null;
  this.xChange = 0;
  this.lastXChange = 1;
  this.step = 1;
  this.health = 12;
  document.getElementById("monsterHealth").innerHTML = "Monster Health: " + this.health;

  this.draw = function() {
    //body
    this.board.context.fillStyle = "red";
    this.board.context.fillRect(this.x, this.y + 5, this.width, this.height - 5)
    //head
    this.board.context.fillRect(this.x, this.y, this.width, 3)
    //neck
    this.board.context.fillRect(this.x + this.neckDirection(), this.y + 3, 2, 2)
  }

  this.neckDirection = function() {
    if (this.lastXChange === 1) {
      return (this.width - 2)
    } else {
      return (0)
    }
  }

  this.rightOfMan = function() {
    if (this.x >= this.man.x + this.man.width + 1) {
      return true;
    } else {
      return false;
    }
  }

  this.leftOfMan = function() {
    if (this.x + this.width < this.man.x - 1) {
      return true;
    } else {
      return false;
    }
  }

  this.turn = function() {
    if (this.leftOfMan()) {
      this.xChange = 1;
      this.lastXChange = -1;
    }
    if (this.rightOfMan()) {
      this.xChange = -1;
      this.lastXChange = 1;
    }

    if (this.man.y + 30 <= this.y) {
      //if (this.leftOfMan() || this.rightOfMan()) {
        if (this.vForce == null) {
          this.vForce = 20;
        }
      //}
    }
    if (this.x + this.width < this.man.x - 100 || this.x > this.man.x + 100) {
      document.getElementById("monsterHealth").innerHTML = null;
      document.getElementById('monsterHealth').style.WebkitAnimation = 'healthFade 1s';
      document.getElementById("monsterHealth").style.width = "0";
    } else {
      document.getElementById('monsterHealth').style.WebkitAnimation = 'healthAppear 1s';
      document.getElementById("monsterHealth").style.width = "200";
      document.getElementById("monsterHealth").innerHTML = "Monster Health: " + this.health;
    }
    if (this.vForce > 0 && this.canMoveUp()) {
      // move to the positon unless we hit something first
      var pointsToMove = Math.round(this.vForce * .3);
      for (var i = 0; i < pointsToMove; i += 1) {
        if (this.canMoveUp()) {
          this.y -= 1;
        } else {
          this.vForce = null;
        }
      }
      this.vForce -= 1;
    } else if (this.falling()) {
      // if we are falling
      if (this.vForce === null);
        this.vForce = 0;
      this.vForce += 1;
      var pointsToMove = Math.round(this.vForce * .7);
      for (var i = 0; i < pointsToMove; i += 0.25) {
        if (this.falling()) {
          this.y += 1;
        } else {
          this.vForce = null;
        }
      }
    } else {
      this.vForce = null;
    }
    if ((this.xChange < 0 && !this.againstLeftLine()) ||
       (this.xChange > 0 && !this.againstRightLine())) {
       this.x += this.xChange * 0.75;
    }
    this.xChange = 0;
  }

  this.hit = function() {
    this.health -= 1;
    if (this.health <= 0) {
      board.remove(this)
      document.getElementById('monsterHealth').style.WebkitAnimation = 'healthFade 1s';
      document.getElementById("monsterHealth").style.width = "0";
      document.getElementById("monsterHealth").innerHTML = null;
      board.remove(this)
    }
    if (this.board.monsters.length === 0) {
      this.board.wave += 1;
      document.getElementById("waveNumber").innerHTML = "Wave " + this.board.wave;
      this.board.startWave()
    }
    return true;
  }

}

Monster.prototype = new Thing()

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

function Bullet(board, x, y, xChange) {
  this.board = board;
  this.x = x;
  this.y = y;
  this.width = 2
  this.height = 2;
  this.shoot = null;
  this.xChange = xChange;
  this.step = 2;

  this.draw = function() {
    this.board.context.fillStyle = "white";
    this.board.context.fillRect(this.x, this.y, this.width, this.height)
  }

  this.turn = function() {
    for (var i = 0; i < this.step; i++) {
      this.x += this.xChange * 1.2;
      if (this.board.isBlocked(this.x, this.y)) {
        this.board.remove(this);
        return;
      }
    }
    for (var i = 0; i < this.board.things.length; i++) {
      if (this !== this.board.things[i] && this.within(this.board.things[i])) {
        if (this.board.things[i].hit()) {
          this.board.remove(this)
          return;
        }
      }
    }

  }

  this.hit = function() {
    return false;
  }

}

Bullet.prototype = new Thing()

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
  this.keyMap = [];
  this.man = null;
  this.lines = [];
  this.wave = 1;
  this.monsters = []

  this.add = function(thing) {
    this.things.push(thing);
  }

  this.remove = function(thing) {
    var index = this.things.indexOf(thing)
    if (index > -1) {
      this.things.splice(index, 1);
    }
    var index2 = this.monsters.indexOf(thing)
    if (index2 > -1) {
      this.monsters.splice(index2, 1);
    }
  }

  this.addMan = function(man) {
    this.man = man;
  }

  this.startWave = function() {
    var xPosition = 0;
    for (var i = 0; i < this.wave; i++) {
      var monster = new Monster(this, this.man, 5 + xPosition, this.height - 120 - 10 - 1, 10, 5)
      xPosition += 7;
      this.things.push(monster)
      this.monsters.push(monster)
      this.add(monster)
    }
  }

  this.addLines = function(line) {
    this.lines.push(line);
    this.add(line);
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

  this.hitByBullet = function(thing) {
    for (var i = 0; i < this.things.length; i++) {
      if (this.things[i].isBullet()) {
        var bullet = this.things[i];
        if (bullet.within(thing)) {
          this.remove(bullet)
          return true;
        }
      }
    }
    return false;
  }

  this.turn = function() {
    for (var i = 0; i< this.things.length; i++) {
      this.things[i].turn()
    }
    if (this.keyMap['38']) {
      this.man.jump();
    }
    if (this.keyMap['37']) {
      this.man.moveleft();
    }
    if (this.keyMap['39']) {
      this.man.moveright();
    }
    if (this.keyMap['32']) {
      this.man.shoot();
    }
  }

  this.keyUpDown = function(e){
    e = e || event; // to deal with IE
    board.keyMap[e.keyCode] = e.type == 'keydown';
  }
}

var board = null;

var start = function() {
  var canvas = document.getElementById("myCanvas");
  var context = canvas.getContext("2d");

  board = new Board(1000, 500, 1, context);

  var line = new Line(board, board.width / 2 - 15, board.height - 20, 25, 5)
  var line2 = new Line(board, board.width / 2, board.height - 50, 25, 5)
  var line3 = new Line(board, board.width / 2 + 15, board.height - 80, 25, 5)
  var line4 = new Line(board, board.width / 2 + 30, board.height - 110, 25, 5)
  var line5 = new Line(board, board.width / 2 + 45, board.height - 140, 25, 5)
  var line6 = new Line(board, board.width / 2 + 60, board.height - 170, 25, 5)
  var block = new Line(board, 0, board.height - 120, 50, 120)
  var block2 = new Line(board, 0, board.height - 80, 100, 80)
  var block3 = new Line(board, 0, board.height - 40, 150, 40)
  var top = new Line(board, 0, 0, board.width, 1)
  var bottom = new Line(board, 0, board.height - 1, board.width, 1)
  var left = new Line(board, 0, 0, 1, board.height)
  var right = new Line(board, board.width - 1, 0, 1, board.height)

  var man = new Man(board, board.width / 2 - 10, board.height - 2 - 10, 10, 5)

  document.getElementById("monsterHealth").style.top = "10px";
  document.getElementById("monsterHealth").style.left = board.width - 230;

  document.getElementById("waveNumber").innerHTML = "Wave 1";

  board.add(man);
  board.addMan(man);

  board.startWave()

  board.addLines(line);
  board.addLines(line2);
  board.addLines(line3);
  board.addLines(line4);
  board.addLines(line5);
  board.addLines(line6);

  board.addLines(block);
  board.addLines(block2);
  board.addLines(block3);

  board.addLines(top);
  board.addLines(bottom);
  board.addLines(left);
  board.addLines(right);


  document.onkeydown = board.keyUpDown;
  document.onkeyup = board.keyUpDown;

  setInterval(function() {
    board.drawCells();
  }, 1000 / 60);

  setInterval(function() {
    board.turn()
  }, 1000 / 60);
}
