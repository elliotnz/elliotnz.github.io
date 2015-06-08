function Thing(board, x, y, physical) {
  this.x = x;
  this.y = y;
  this.originalX = x;
  this.originalY = y;
  this.board = board;
  this.step = null;
  this.physical = physical

  this.turn = function() {
    if (!this.physical && this.board.physicalLines.indexOf(this) > -1) {
      this.board.removePhysicalLine(this)
    } else if (this.physical && this.board.physicalLines.indexOf(this) === -1) {
      this.board.addPhysicalLine(this)
    }
  }

  this.canMoveUp = function() {
    var varCanMoveUp = true
    for (var i = 0; i <= this.width; i++) {
      if (this.board.isBlocked(this.x + i, this.y - 1)) {
        varCanMoveUp = false;
      }
    }
    return (varCanMoveUp);
  }

  this.blockedUp = function(y) {
    var blockedUp = false
    for (var i = 0; i <= this.width; i++) {
      if (this.board.isBlocked(this.x + i, y)) {
        blockedUp = true;
      }
    }
    return (blockedUp);
  }

  this.falling = function() {
    return !this.onGround()
  }

  this.onGround = function() {
    var onGround = false
    for (var i = 0; i <= this.width; i++) {
      if (this.board.isBlocked(this.x + i, this.y + this.height + 1)) {
        onGround = true;
      }
    }
    return (onGround);
  }

  this.towardsGround = function(y) {
    var onGround = false
    for (var i = 0; i <= this.width; i++) {
      if (this.board.isBlocked(this.x + i, y)) {
        onGround = true;
      }
    }
    return (onGround);
  }

  this.againstLeftLine = function() {
    var avaliableSteps = 0;
    var varLeftLine = false
    for (var i = 1; i <= this.step; i++) {
      for (var j = 0; j <= this.height; j++) {
        if (this.board.isBlocked(this.x - i, this.y + j)) {
          if (!this.board.isBlocked(this.x - avaliableSteps, this.y + j)) {
            avaliableSteps += 1
          } else {
            var used = avaliableSteps
            //this.getClose(used)
            avaliableSteps = 0
            varLeftLine = true;
            break;
            break;
          }
        }
      }
    }
    return (varLeftLine);
  }

  this.againstRightLine = function() {
    var avaliableSteps = 0;
    var varRightLine = false
    for (var i = 1; i <= this.step; i++) {
      for (var j = 0; j <= this.height; j++) {
        if (this.board.isBlocked(this.x + this.width + i, this.y + j)) {
          if (!this.board.isBlocked(this.x + this.width + avaliableSteps, this.y + j)) {
            avaliableSteps += 1
          } else {
            var used = avaliableSteps
            //this.getClose(used)
            avaliableSteps = 0
            varRightLine = true;
            break;
            break;
          }
        }
      }
    }
    return (varRightLine);
  }

  this.getClose = function(steps, direction) {
    if (steps < 0 && direction === "left") {
      steps *= -1
      this.x -= (steps - 1)
      this.movingX -= (steps - 1)
    } else if (steps > 0 && direction === "right") {
      steps *= 1
      this.x += (steps + this.width - 1)
      this.movingX += (steps + this.width - 1)
    }
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


function Man(board, x, y, height, width, colour) {
  this.x = x;
  this.y = y - height;
  this.originalX = x;
  this.originalY = y - height;
  this.board = board;
  this.lineAbove = false;
  this.lineBelow = false;
  this.height = height;
  this.width = width;
  this.colour = colour;
  this.physical = false;
  this.movingX = this.x;
  this.shifting = false;
  this.counter = 0;
  this.jumping = false;
  this.jumps = false;
  this.currentlyJumping = false;
  this.falling = false;
  this.readyToJump = false;
  this.upForce = 0;
  this.downForce = 0;
  this.xChange = 0;
  this.lastXChange = 1;
  this.step = 4;
  this.dead = false;

  this.draw = function() {
    //body
    var ctx = this.board.context
    ctx.fillStyle = this.colour;
    ctx.fillRect(this.x, this.y, this.width, this.height)
  }

  this.direction = function() {
    if (this.lastXChange !== 1) {
      return (this.width + 1)
    } else {
      return (-15)
    }
  }

  this.turn = function() {
    if (this.againstRightLine() && this.board.keyMap["39"]) {
      var distanceCanMoveRight = 0
      var canMoveRight = true;
      var readyToIncrease = true;
      while (canMoveRight) {
        readyToIncrease = true
        for (var i = 0; i <= this.height; i++) {
          if (this.board.isBlocked(this.x + this.width + distanceCanMoveRight + 0.1, this.y + i)) {
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
      if (this.movingX >= -150 && this.movingX <= 3600) {
        for (var i = 0; i < this.board.lines.length; i++) {
          this.board.lines[i].x -= distanceCanMoveRight
        }
      } else {
        this.x += distanceCanMoveRight
      }
      this.movingX += distanceCanMoveRight
    }
    if (this.againstLeftLine() && this.board.keyMap["37"]) {
      var distanceCanMoveLeft = 0
      var canMoveLeft = true;
      var readyToIncrease = true;
      while (canMoveLeft) {
        readyToIncrease = true
        for (var i = 0; i <= this.height; i++) {
          if (this.board.isBlocked(this.x - distanceCanMoveLeft - 0.1, this.y + i)) {
            //canMoveLeft = false
            readyToIncrease = false
            break;
            //break;
          }
        }
        if (readyToIncrease) {
          distanceCanMoveLeft += 0.1;
        } else {
          canMoveLeft = false
          break;
        }
      }
      if (this.movingX >= -150 && this.movingX <= 3600) {
        for (var i = 0; i < this.board.lines.length; i++) {
          this.board.lines[i].x += distanceCanMoveLeft
        }
      } else {
        this.x -= distanceCanMoveLeft
      }
      this.movingX -= distanceCanMoveLeft
    }
    if (this.jumps && !this.currentlyJumping) {
      this.jumping = true;
      this.upForce = 18;
      this.currentlyJumping = true;
    }
    if (this.currentlyJumping) {
      this.jumps = false;
    }
    if (this.onGround() && this.currentlyJumping) {
      this.currentlyJumping = false;
    }
    if (this.onGround()) {
      this.downForce = 0;
      var distanceCanMoveDown = 0
      var canMoveDown = true;
      var readyToIncrease = true;
      while (canMoveDown) {
        readyToIncrease = true
        for (var i = 0; i <= this.width; i++) {
          if (this.board.isBlocked(this.x + i, this.y + this.height + distanceCanMoveDown + 0.1)) {
            //canMoveDown = false
            readyToIncrease = false
            break;
            //break;
          }
        }
        if (readyToIncrease) {
          distanceCanMoveDown += 0.1;
        } else {
          canMoveDown = false
          break;
        }
      }
      this.y += distanceCanMoveDown
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
      for (var i = 0; i < this.height; i++) {
        if (this.blockedUp(this.y - this.upForce + i)) {
          canMoveUpForceUp = false
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
      for (var i = 0; i <= this.height + 1; i++) {
        if (this.towardsGround(this.y + (this.downForce * this.counter) + i)) {
          canMoveDownForceDown = false;
          break;
        }
      }

      if (canMoveDownForceDown) {
        this.y += this.downForce * this.counter;
      } else if (!canMoveDownForceDown && !this.onGround()) {
        this.y += 1;
      } else {
      }
      if (this.onGround()) {
        this.falling = false;
        this.currentlyJumping = false;
        this.counter = 0;
        this.downForce = 0
      }
    }

    if ((this.xChange < 0 && !this.againstLeftLine()) ||
    (this.xChange > 0 && !this.againstRightLine())) {
      this.x += this.xChange * this.step;
      this.movingX += this.xChange * this.step;
    }
    this.xChange = 0;
  }

  this.jump = function() {
    this.jumps = true
  }

  this.moveleft = function() {
    if (!this.dead) {
      if (this.movingX >= -150 && this.movingX <= 3600) {
        if (this.x === this.board.width / 2 - 1) {
          this.xChange = -1;
          this.lastXChange = -1;
        }
      } else {
        this.xChange = -1;
        this.lastXChange = -1;
      }
      var canShiftLeft = false
      for (var i = 0; i < this.board.physicalLines.length; i++) {
        if (/*this.x <= this.board.width / 2 && */this.movingX >= -150 && this.movingX <= 3600) {
          if ((this.board.physicalLines[i].x + this.board.physicalLines[i].width + this.step >= this.x && this.board.physicalLines[i].x + this.board.physicalLines[i].width + this.step <= this.x + this.width)
          && (this.board.physicalLines[i].y + this.board.physicalLines[i].height >= this.y && this.board.physicalLines[i].y <= this.y + this.height)) {
            canShiftLeft = false
            break;
          } else {
            canShiftLeft = true
          }
        } else {
          canShiftLeft = false
          break;
        }
      }
      if (canShiftLeft) {
        for (var i = 0; i < this.board.lines.length; i++) {
          this.board.lines[i].x += this.step
          this.shifting = true
        }
        this.movingX -= this.step
      } else {
        this.shifting = false
      }
    }
  }

  this.moveright = function() {
    if (!this.dead) {
      if (this.movingX <= 3600) {
        if (this.x <= this.board.width / 2 + 1) {
          this.xChange = 1;
          this.lastXChange = 1;
        }
      } else {
        this.xChange = 1;
        this.lastXChange = 1;
      }
      var canShiftRight = false
      for (var i = 0; i < this.board.physicalLines.length; i++) {
        if (this.x >= this.board.width / 2 && this.movingX <= 3600) {
          if ((this.board.physicalLines[i].x - this.step >= this.x && this.board.physicalLines[i].x - this.step <= this.x + this.width)
          && (this.board.physicalLines[i].y + this.board.physicalLines[i].height >= this.y && this.board.physicalLines[i].y <= this.y + this.height)) {
            canShiftRight = false
            break;
          } else {
            canShiftRight = true
          }
        } else {
          canShiftRight = false
          break;
        }
      }
      if (canShiftRight) {
        for (var i = 0; i < this.board.lines.length; i++) {
          this.board.lines[i].x -= this.step
          this.shifting = true
        }
        this.movingX += this.step
      } else {
        this.shifting = false
      }
    }
  }
}

Man.prototype = new Thing()

function Line(board, x, y, width, height, physical, colour) {
  this.board = board
  this.x = x;
  this.y = y;
  this.originalX = x;
  this.originalY = y;
  this.width = width;
  this.height = height;
  this.physical = physical
  this.colour = colour

  this.draw = function() {
    this.board.context.fillStyle = this.colour;
    this.board.context.fillRect(this.x, this.y, this.width, this.height)
  }
}

Line.prototype = new Thing()

function Border(board, x, y, width, height, physical, colour) {
  this.board = board
  this.x = x;
  this.y = y;
  this.originalX = x;
  this.originalY = y;
  this.width = width;
  this.height = height;
  this.physical = physical
  this.colour = colour

  this.draw = function() {
    this.board.context.fillStyle = this.colour;
    this.board.context.fillRect(this.x, this.y, this.width, this.height)
  }
}

Border.prototype = new Thing()

function ColourPlatform(board, x, y, width, height, colour) {
  this.board = board
  this.x = x;
  this.y = y;
  this.originalX = x;
  this.originalY = y;
  this.width = width;
  this.height = height;
  this.physical = false
  this.colour = colour

  this.draw = function() {
    var ctx = this.board.context;
    ctx.fillStyle = this.colour;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  this.turn = function() {
    if (this.board.man.colour === this.colour) {
      if (this.board.physicalLines.indexOf(this) === -1)
        this.board.addPhysicalLine(this)
    } else {
      if (this.board.physicalLines.indexOf(this) !== -1)
        this.board.removePhysicalLine(this)
    }
  }
}

ColourPlatform.prototype = new Thing()

function Coin(board, x, y, value) {
  this.board = board;
  this.x = x;
  this.y = y;
  this.originalX = x;
  this.originalY = y;
  this.radius = 10;
  this.value = value;
  this.colour = null;
  this.collected = false

  this.getColour = function() {
    if (this.value === 1) {
      this.colour = "yellow"
    } else if (this.value === 5) {
      this.colour = "#6C0E0E"
    } else if (this.value === 10) {
      this.colour = "silver"
    }
  }

  this.draw = function() {
    var ctx = this.board.context;
    ctx.strokeStyle = "black"
    this.getColour();
    ctx.fillStyle = this.colour
    ctx.lineWidth = 2;
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fill()
    ctx.stroke()
  }

  this.withinThing = function(thing) {
    if ((this.x - this.radius - thing.width + 1 <= thing.x && this.x + this.radius - 1 >= thing.x) &&
    (this.y - this.radius - thing.height + 1 <= thing.y && this.y + this.radius - 1 >= thing.y)) {
      return true;
    } else {
      return false;
    }
  }

  this.turn = function() {
    if (this.withinThing(this.board.man) && !this.collected) {
      this.collected = true
      this.board.money += this.value;
    }
    if (this.collected) {
      if (this.radius > 0) {
        this.radius -= 1;
      } else {
        this.board.removeCoin(this)
      }
    }
  }
}

Coin.prototype = new Thing()

function Money(board) {
  this.board = board

  this.draw = function() {
    var ctx = this.board.context;
    ctx.font = "15px Verdana";
    ctx.fillStyle = "black";
    ctx.fillText("Money: " + this.board.money, this.board.width - 100, 30);
  }
}

Money.prototype = new Thing()

function Text(board, writing, x, y, size) {
  this.board = board
  this.writing = writing;
  this.x = x;
  this.y = y;
  this.originalX = x;
  this.originalY = y;
  this.size = size

  this.draw = function() {
    var ctx = this.board.context;
    ctx.font = this.size + " " + "Verdana";
    ctx.fillStyle = "black";
    ctx.fillText(this.writing, this.x, this.y);
  }
}

Text.prototype = new Thing()

function Spike(board, x, y, width, height) {
  this.board = board;
  this.x = x;
  this.y = y;
  this.originalX = x;
  this.originalY = y;
  this.width = width;
  this.height = height;
  this.colour = "#9E0B0B";

  this.draw = function() {
    var spikes = Math.round(Math.sqrt(this.width))
    var pos = null
    var ctx = this.board.context;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y + this.height);
    for (var i = 0; i < spikes; i++) {
      if (i % 2 === 0) {
        pos = this.y + this.height
      } else {
        pos = this.y
      }
      ctx.lineTo(this.x + i * spikes, pos);
    }
    if (pos === this.y) {
      ctx.lineTo(this.x + spikes * spikes, this.y + this.height)
    }
    ctx.fillStyle = this.colour;
    ctx.fill();
  }

  this.turn = function() {
    if (this.within(this.board.man)) {
      this.board.remove(this.board.man)
      this.board.death = true
    }
    if (this.board.death) {
      this.board.man.dead = true
      this.board.counter += 1
      var x = Math.floor((Math.random() * 10) + 1);
      if (this.board.bits.length < 15) {
        var bit = new Bit(this.board, this.board.man.x - 5 + x, this.board.man.y - 10, this.board.man.colour)
        this.board.addBit(bit);
      }
      var movingDown = false
      for (var i = 0; i < this.board.bits.length; i++) {
        var b = this.board.bits[i];
        movingDown = false
        if (b.x > this.board.man.x) {
          if (b.x - 15 <= this.board.man.x) {
            b.x += 2;
          } else if (b.x - 20 > this.board.man.x) {

          } else {
            b.x += 1;
          }
        } else {
          if (b.x + 15 >= this.board.man.x) {
            b.x -= 2;
          } else if (b.x + 20 < this.board.man.x) {

          } else {
            b.x -= 1;
          }
        }
        if (!b.onGround()) {
          var s = this
          if (s.y === b.y + 5) {
            if (s.x <= b.x + 5 && b.x <= s.x + s.width) {

            } else {
              b.y += 1;
            }
          } else {
            b.y += 1;
          }
        }
      }
    }
    if (this.board.counter > 35) {
      this.board.counter = 0;
      this.board.death = false;
      this.board.man.dead = false
      this.board.add(this.board.man)
      this.board.addMan(this.board.man)
      this.board.reset()
      this.board.man.jumping = false;
      this.board.man.jumps = false;
      this.board.man.currentlyJumping = false;
      for (var i = 0; i < this.board.keysCollected.length; i += 0) {
        this.board.keysCollected[i].x = this.board.keysCollected[i].originalX
        this.board.keysCollected[i].y = this.board.keysCollected[i].originalY
        this.board.removeKeyCollected(this.board.keysCollected[i])
      }
    }
    if (!this.board.death) {
      for (var i = this.board.bits.length - 1; i >= 0; i--) {
        this.board.removeBit(this.board.bits[i])
      }
    }
  }
}

Spike.prototype = new Thing()

function Bit(board, x, y, colour) {
  this.board = board;
  this.x = x;
  this.y = y;
  this.originalX = x;
  this.originalY = y;
  this.colour = colour;

  this.draw = function() {
    var ctx = this.board.context;
    ctx.fillStyle = this.colour;
    ctx.fillRect(this.x, this.y, 5, 5);
  }
}

Bit.prototype = new Thing()

function Key(board, x, y) {
  this.board = board;
  this.x = x;
  this.y = y;
  this.originalX = x;
  this.originalY = y;
  this.width = 25
  this.height = 10
  this.colour = "#EFD23D";
  this.keyCollected = false

  this.draw = function() {
    var ctx = this.board.context;
    ctx.lineWidth = 3;
    ctx.strokeStyle = this.colour
    ctx.beginPath()
    ctx.arc(this.x + 5, this.y + 5, 5, 0, 2 * Math.PI);
    ctx.moveTo(this.x + 5, this.y + 10);
    ctx.lineTo(this.x + 20, this.y + 10);
    ctx.lineTo(this.x + 20, this.y + 5);
    ctx.moveTo(this.x + 15, this.y + 10);
    ctx.lineTo(this.x + 15, this.y + 5);
    ctx.stroke()
  }

  this.againstLeftLine = function() {
    for (var i = 0; i <= this.height; i++) {
      if (this.board.isBlocked(this.x - 1, this.y + i)) {
        return true;
        break;
      }
    }
    return false
  }

  this.againstRightLine = function() {
    for (var i = 0; i <= this.height; i++) {
      if (this.board.isBlocked(this.x + this.width + 1, this.y + i)) {
        return true;
        break;
      }
    }
    return false
  }

  this.canMoveUp = function() {
    for (var i = 0; i <= this.width; i++) {
      if (this.board.isBlocked(this.x + i, this.y - 1)) {
        return false;
        break;
      }
    }
    return true;
  }

  this.turn = function() {
    if (this.within(this.board.man)) {
      this.keyCollected = true
    }
    if (this.keyCollected) {
      //if man is too far left
      if (this.board.keyMap["37"]) {
        if ((this.x < this.board.man.x) && (!this.board.isBlocked(this.board.man.x + this.board.man.width + 26, this.y))
        && (!this.board.isBlocked(this.board.man.x + this.board.man.width + 26, this.y + this.height))) {
          this.x = this.board.man.x + this.board.man.width + 26
        }
      }
      //if man is too far right
      if (this.board.keyMap["39"]) {
        if (this.x > this.board.man.x && !this.board.isBlocked(this.board.man.x - 26, this.y)) {
          if (this.board.man.movingX - 26 > -650)
            this.x = this.board.man.x - 26
        }
      }
      //if man is above
      if (this.y > this.board.man.y) {
        for (var i = 0; i < this.y - this.board.man.y; i++) {
          if (this.canMoveUp()) {
            this.y -= (1 + this.board.keys.indexOf(this))
          }
        }
      }
      //if man is below
      if (this.y < this.board.man.y) {
        for (var i = 0; i < 3; i++) {
          if (!this.onGround()) {
            this.y += (1 + this.board.keys.indexOf(this))
          }
        }
      }
      if (this.x - 20 >= this.board.man.x) {
        for (var i = 0; i < 3; i++) {
          if (!this.againstLeftLine()) {
            if (this.x < this.board.width - 25) {
              this.x -= 1
            } else {
              this.x -= 4
            }
          }
        }
      }
      //if man is too far right
      if (this.x + this.width + 20 <= this.board.man.x) {
        for (var i = 0; i < 3; i++) {
          if (!this.againstRightLine()) {
            if (this.x > 0) {
              this.x += 1
            } else {
              this.x += 4
            }
          }
        }
      }
    }
  }
}

Key.prototype = new Thing()

function Door(board, x, y, width, height) {
  this.board = board;
  this.x = x;
  this.y = y;
  this.originalX = x;
  this.originalY = y;
  this.width = width;
  this.height = height;
  this.colour = "#EFD23D";
  this.readyToDisappear = false;
  this.counter = 0;

  this.draw = function() {
    var ctx = this.board.context;
    ctx.fillStyle = this.colour;
    ctx.strokeStyle = this.colour;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = "black"
    ctx.beginPath();
    ctx.arc(this.x + this.width / 2, this.y + this.height / 2, Math.floor((this.height / 5 + this.width / 4) / 2), 0, 2 * Math.PI);
    ctx.fill()
    ctx.stroke()
    ctx.fillRect(this.x + this.width / 2 - this.width / 8, this.y + this.height / 2, this.width / 4, Math.floor((this.height / 3 + this.width / 2) / 2))
  }

  this.turn = function() {
    for (var i = 0; i < this.board.keys.length; i++) {
      if (this.board.keys[i].keyCollected) {
        this.board.keysCollected.push(this.board.keys[i])
      }
    }
    if (this.board.keysCollected.length > 0) {
      var m = this.board.man
      if ((m.x + m.width + m.step >= this.x && m.x + m.width < this.x && m.y + m.height > this.y && m.y < this.y + this.height)// leftSide
      || (m.x - m.step <= this.x + this.width && m.x > this.x + this.width && m.y + m.height > this.y && m.y < this.y + this.height)//rightSide
      || (m.x + m.width + 1 >= this.x && m.x - 1 <= this.x + this.width && m.y + m.height + 1 >= this.y && m.y + m.height < this.y)//topSide
      || (m.x + m.width + 1 >= this.x && m.x - 1 <= this.x + this.width && m.y - 1 <= this.y + this.height && m.y > this.y + this.height)) {//bottomSide
        this.readyToDisappear = true

      }
    }
    if (this.readyToDisappear) {
      if (this.board.things.indexOf(this.board.keysCollected[0]) !== -1 ) {
        this.board.remove(this.board.keysCollected[0])
      }
      if (this.counter < this.height / 2) {
        this.y += 1;
        this.height -= 2;
        this.counter += 1;
      } else {
        this.board.remove(this)
        this.readyToDisappear = false;
      }
    }
  }
}

Door.prototype = new Thing()

function ColourConvertor(board, x, y, width, height, colour1, colour2) {
  this.board = board
  this.x = x;
  this.y = y;
  this.originalX = x;
  this.originalY = y;
  this.width = width;
  this.height = height;
  this.physical = false;
  this.manIn = false
  this.colour1 = colour1
  this.colour2 = colour2

  this.draw = function() {
    this.board.context.fillStyle = "orange";
    this.board.context.fillRect(this.x, this.y, this.width, this.height)
  }
  this.turn = function() {
    if (this.board.keysCollected.length > 0) {
    }
    if (this.board.man.colour !== this.colour1 && this.board.man.colour !== this.colour2) {
      if (this.board.physicalLines.indexOf(this) === -1)
        this.board.addPhysicalLine(this)
    } else {
      if (this.board.physicalLines.indexOf(this) !== -1)
        this.board.removePhysicalLine(this)
    }
    if (this.within(this.board.man)) {
      this.manIn = true
    } else {
      if (this.manIn) {
        if (this.board.man.colour === this.colour1) {
          this.board.man.colour = this.colour2
          this.draw()
        } else {
          this.board.man.colour = this.colour1
          this.draw()
        }
        this.manIn = false
      }
    }
  }
}

ColourConvertor.prototype = new Thing()

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
  this.man = null;
  this.lines = [];
  this.physicalLines = [];
  this.colourConvertors = [];
  this.colourPlatforms = [];
  this.keys = [];
  this.keysCollected = [];
  this.doors = [];
  this.coins = [];
  this.bits = [];
  this.texts = [];
  this.spikes = [];
  this.counter = 0;
  this.death = false;
  this.money = 0;

  this.add = function(thing) {
    this.things.push(thing);
  }

  this.remove = function(thing) {
    var index = this.things.indexOf(thing)
    if (index > -1) {
      this.things.splice(index, 1);
    }
    this.removeLine(thing)
    this.removePhysicalLine(thing)
    this.removeKey(thing)
  }

  this.removeLine = function(thing) {
    var index = this.lines.indexOf(thing)
    if (index > -1) {
      this.lines.splice(index, 1);
    }
  }

  this.removePhysicalLine = function(thing) {
    var index = this.physicalLines.indexOf(thing)
    if (index > -1) {
      this.physicalLines.splice(index, 1);
    }
  }

  this.removeText = function(text) {
    var index = this.texts.indexOf(text)
    if (index > -1) {
      this.texts.splice(index, 1);
    }
    this.removeLine(text)
    this.remove(text)
  }

  this.removeCoin = function(coin) {
    var index = this.coins.indexOf(coin)
    if (index > -1) {
      this.coins.splice(index, 1);
    }
    this.removeLine(coin);
    this.remove(coin);
  }

  this.removeBit = function(bit) {
    var index = this.bits.indexOf(bit)
    if (index > -1) {
      this.bits.splice(index, 1);
    }
    this.remove(bit);
  }

  this.removeKey = function(key) {
    var index = this.keys.indexOf(key)
    if (index > -1) {
      this.keys.splice(index, 1);
    }
    this.removeKeyCollected(key)
  }

  this.removeKeyCollected = function(key) {
    key.keyCollected = false
    var index = this.keysCollected.indexOf(key)
    if (index > -1) {
      this.keysCollected.splice(index, 1);
    }
  }

  this.addText = function(text) {
    this.lines.push(text)
    this.texts.push(text)
    this.add(text)
  }

  this.addKey = function(key) {
    this.keys.push(key);
    this.lines.push(key);
    this.add(key);
  }

  this.addKeyCollected = function(key) {
    this.keysCollected.push(key);
  }

  this.addDoor = function(door) {
    this.doors.push(door);
    this.lines.push(door);
    this.physicalLines.push(door);
    this.add(door);
  }

  this.addColourPlatform = function(colourPlatform) {
    this.colourPlatforms.push(colourPlatform);
    this.lines.push(colourPlatform);
    this.add(colourPlatform);
  }

  this.addColourConvertor = function(colourConvertor) {
    this.colourConvertors.push(colourConvertor);
    this.lines.push(colourConvertor)
    this.add(colourConvertor);
  }

  this.addMan = function(man) {
    this.man = man;
  }

  this.addLines = function(line) {
    this.lines.push(line);
    this.add(line);
  }

  this.addPhysicalLine = function(line) {
    this.physicalLines.push(line);
    this.add(line);
  }

  this.addCoin = function(coin) {
    this.lines.push(coin);
    this.coins.push(coin);
    this.add(coin);
  }

  this.addBit = function(bit) {
    this.lines.push(bit);
    this.bits.push(bit);
    this.add(bit);
  }

  this.addSpike = function(spike) {
    this.lines.push(spike);
    this.spikes.push(spike);
    this.add(spike);
  }

  this.drawCells = function() {
    this.clearBoard()
    for (var i = 0; i< this.things.length; i++) {
      this.things[i].draw()
    }
    for (var i = 0; i < this.colourConvertors.length; i++) {
      this.colourConvertors[i].draw()
    }
  }

  this.clearBoard = function() {
    this.context.clearRect(0, 0, this.width, this.height)
  }

  this.isBlocked = function(x, y) {
    for (var i = 0; i < this.physicalLines.length; i++) {
      if ((x >= this.physicalLines[i].x && x <= (this.physicalLines[i].x + this.physicalLines[i].width)) &&
      (y >= this.physicalLines[i].y && y <= (this.physicalLines[i].y + this.physicalLines[i].height))) {
        return true;
      }
    }
    return false;
  }

  this.turn = function() {
    var nextLeftLine = false
    for (var i = 0; i <= this.man.step; i++) {
      for (var j = 0; j <= this.man.height; j++) {
        if (this.isBlocked(this.man.x - i, this.man.y + j)) {
          nextLeftLine = true
        }
      }
    }
    var nextRightLine = false
    for (var i = 0; i <= this.man.step; i++) {
      for (var j = 0; j <= this.man.height; j++) {
        if (this.isBlocked(this.man.x + i, this.man.y + j)) {
          nextRightLine = true
        }
      }
    }
    for (var i = 0; i < this.things.length; i++) {
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
  }

  this.keyUpDown = function(e) {
    e = e || event; // to deal with IE
    board.keyMap[e.keyCode] = e.type == 'keydown';
  }

  this.reset = function() {
    for (var i = 0; i < this.things.length; i++) {
      this.things[i].x = this.things[i].originalX
      this.things[i].y = this.things[i].originalY
    }
    this.man.movingX = this.man.originalX
    this.money = 0;
  }
}

var getBoard = function() {
  var canvas = document.getElementById("myCanvas");
  var context = canvas.getContext("2d");

  return(new Board(1000, 500, 1, context));
}

var board = null;

function getMilliseconds() {
  return new Date().getTime();
}

var start = function() {
  board = getBoard()//new Board(1000, 500, 1, context);

  document.onkeydown = board.keyUpDown;
  document.onkeyup = board.keyUpDown;

  window.addEventListener("keydown", function(e) {
    // space and arrow keys
    if ([37, 39, 38, 40].indexOf(e.keyCode) > -1) {
      e.preventDefault();
    }
  }, false);

  var man = new Man(board, board.width / 2, board.height - 5, 16, 9, "blue")

  board.add(man);
  board.addMan(man);

  var text = new Text(board, "Watch out for these platforms!", 200, 350, "20px")
  var guideLine = new Line(board, 330, 360, 2, 80, false, "black")
  var welcome = new Text(board, "Welcome to the Game!", 30, 100, "80px")
  var colourConvertorText = new Text(board, "These are colour convertors", -400, 370, "20px")
  var guideLine2 = new Line(board, -115, 365, 115, 2, false, "black")
  var spikeText = new Text(board, "SPIKES!", 798, 470, "20px")

  var line = new Line(board, board.width / 2 - 240, board.height - 20, 25, 5, true, "black")
  var line2 = new ColourPlatform(board, board.width / 2 - 180, board.height - 50, 25, 5, "black")
  var line3 = new ColourPlatform(board, board.width / 2 - 110, board.height - 80, 25, 5, "black")
  var line4 = new Line(board, board.width / 2 - 60, board.height - 110, 25, 5, true, "black")
  var line5 = new ColourPlatform(board, board.width / 2, board.height - 140, 25, 5, "black")
  var line6 = new Line(board, board.width / 2 + 80, board.height - 170, 25, 5, true, "black")
  var line7 = new ColourPlatform(board, board.width / 2 + 180, board.height - 175, 25, 5, "black")
  var line8 = new Line(board, board.width / 2 + 280, board.height - 210, 25, 5, true, "black")
  var lineblock = new Line(board, board.width / 2 + 380, board.height - 240, 80, 220, true, "black")
  var linecave = new Line(board, board.width / 2 + 380, board.height - 20, 10, 20, true, "black")
  var linecave2 = new Line(board, board.width / 2 + 450, board.height - 20, 10, 20, true, "black")

  var brick = new Line(board, 2300, 450, 80, 10, true, "rgb(24, 79, 24)")
  var brick2 = new Line(board, 2450, 375, 70, 10, true, "rgb(24, 79, 24)")
  var brick3 = new Line(board, 2600, 375, 50, 10, true, "rgb(24, 79, 24)")
  var brick4 = new Line(board, 2700, 275, 50, 10, true, "rgb(24, 79, 24)")

  var beam = new Line(board, 2850, 250, 10, 249, false, "purple")
  var beam2 = new Line(board, 3050, 250, 10, 249, false, "purple")
  var beam3 = new Line(board, 2850, 240, 210, 10, true, "purple")

  var beam4 = new Line(board, 3150, 150, 150, 10, true, "purple")
  var beam5 = new Line(board, 3220, 0, 10, 150, false, "purple")

  var wall = new Line(board, 3400, 99, 25, 400, true, "black")

  var colourConvertor1 = new ColourConvertor(board, board.width / 2 + 270, board.height - 31, 25, 30, "blue", "red")
  var colourConvertor2 = new ColourConvertor(board, 5, board.height - 150, 25, 30, "green", "blue")

  var lineConvertor = new Line(board, board.width / 2 + 270, board.height - 35, 12.5, 5, true, "blue")
  var lineConvertor2 = new Line(board, board.width / 2 + 282.5, board.height - 35, 12.5, 5, true, "red")
  var lineConvertor3 = new Line(board, 5, board.height - 155, 12.5, 5, true, "green")
  var lineConvertor4 = new Line(board, 17.5, board.height - 155, 12.5, 5, true, "blue")

  var step = new Line(board, -120, board.height - 50, 25, 5, true, "black")
  var step2 = new Line(board, -60, board.height - 100, 25, 5, true, "black")

  var step3 = new Line(board, board.width - 40, board.height - 210, 100, 40, true, "black")
  var step4 = new Line(board, board.width + 40, board.height - 180, 100, 40, true, "black")
  var step5 = new Line(board, board.width + 120, board.height - 150, 100, 40, true, "black")
  var step6 = new Line(board, board.width + 200, board.height - 120, 100, 40, true, "black")
  var step7 = new Line(board, board.width + 280, board.height - 90, 100, 40, true, "black")
  var step8 = new Line(board, board.width + 360, board.height - 60, 100, 40, true, "black")

  var redLine2 = new ColourPlatform(board, board.width / 2 - 140, board.height - 60, 25, 5, "red")
  var greenLine = new ColourPlatform(board, -650, board.height - 60, 25, 5, "green")

  var block = new Line(board, 0, board.height - 120, 50, 120, true, "black")
  var block2 = new Line(board, 40, board.height - 80, 50, 80, true, "black")
  var block3 = new Line(board, 80, board.height - 40, 50, 40, true, "black")

  var coinPlatform = new Line(board, -600, board.height - 120, 150, 10, true, "black")

  var coin1 = new Coin(board, 200, board.height - 80, 1)
  var coin2 = new Coin(board, 1200, 200, 5)
  var coin3 = new Coin(board, -500, board.height - 140, 10)
  var coin4 = new Coin(board, 980, board.height - 50, 5)
  var coin5 = new Coin(board, 1000, board.height - 30, 5)
  var coin6 = new Coin(board, 1030, board.height - 80, 1)
  var coin7 = new Coin(board, 1060, board.height - 40, 5)
  var coin8 = new Coin(board, 1090, board.height - 60, 5)

  var moneyReader = new Money(board)

  var spike1 = new Spike(board, board.width / 2 + 300, board.height - 11, 90, 10)
  var spike2 = new Spike(board, board.width + 100, board.height - 21, 100, 20)

  var key1 = new Key(board, -550, board.height - 140)
  var door1 = new Door(board, board.width + 460, board.height - 60, 40, 59)

  var top = new Border(board, 0, 0, board.width, 1, true, "black")
  var bottom = new Border(board, 0, board.height - 1, board.width, 1, true, "black")
  var left = new Border(board, 0, 0, 1, board.height, true, "black")
  var right = new Border(board, board.width - 1, 0, 1, board.height, true, "black")

  var comingSoon = new Text(board, "More Coming Soon!", 3900, 450, "20px")

  board.addText(comingSoon)

  board.addLines(line);
  board.addColourPlatform(line2);
  board.addColourPlatform(line3);
  board.addLines(line4);
  board.addColourPlatform(line5);
  board.addLines(line6);
  board.addColourPlatform(line7);
  board.addLines(line8);
  board.addLines(lineblock);
  board.addLines(linecave);
  board.addLines(linecave2);

  board.addColourPlatform(redLine2);
  board.addColourPlatform(greenLine);

  board.addLines(step);
  board.addLines(step2);

  board.addLines(step3);
  board.addLines(step4);
  board.addLines(step5);
  board.addLines(step6);
  board.addLines(step7);
  board.addLines(step8);

  board.addLines(coinPlatform);

  board.addCoin(coin1);
  board.addCoin(coin2);
  board.addCoin(coin3);
  board.addCoin(coin4);
  board.addCoin(coin5);
  board.addCoin(coin6);
  board.addCoin(coin7);
  board.addCoin(coin8);

  board.add(moneyReader);

  board.addText(text)
  board.addText(welcome)
  board.addLines(guideLine)
  board.addText(colourConvertorText)
  board.addLines(guideLine2)
  board.addText(spikeText)

  board.addSpike(spike1);
  board.addSpike(spike2);

  board.addColourConvertor(colourConvertor1)
  board.addColourConvertor(colourConvertor2)

  board.addLines(lineConvertor);
  board.addLines(lineConvertor2);
  board.addLines(lineConvertor3);
  board.addLines(lineConvertor4);

  board.addLines(block);
  board.addLines(block2);
  board.addLines(block3);

  board.addLines(brick)
  board.addLines(brick2)
  board.addLines(brick3)
  board.addLines(brick4)

  board.addLines(beam)
  board.addLines(beam2)
  board.addLines(beam3)
  board.addLines(beam4)
  board.addLines(beam5)

  board.addLines(wall)

  board.addKey(key1);
  board.addDoor(door1);

  board.addPhysicalLine(top);
  board.addPhysicalLine(bottom);
  board.addPhysicalLine(left);
  board.addPhysicalLine(right);

  if (board.man.x !== board.width / 2) {
    for (var i = 0; i < board.lines.length; i++) {
      board.lines[i].x += (board.width / 2 - board.man.x)
    }
    board.man.x = board.width / 2
  }

  setInterval(function() {
    board.drawCells();
  }, 1000 / 60);

  setInterval(function() {
    board.turn()
  }, 1000 / 60);
}
