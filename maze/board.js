function Thing(board, x, y, pixelWidth, context, colour) {

  this.draw = function() {
    this.context.fillStyle=this.colour;
    this.context.fillRect((this.x * this.pixelWidth) + 1, (this.y * this.pixelWidth) + 1, this.pixelWidth - 1, this.pixelWidth - 1)
  }

  this.moveup = function() {
    if (this.board.canMoveTo(this, this.x, this.y - 1))
      this.y -= 1;
  }
  this.movedown = function() {
    if (this.board.canMoveTo(this, this.x, this.y + 1))
      this.y += 1;
  }
  this.moveleft = function() {
    if (this.board.canMoveTo(this, this.x - 1, this.y))
      this.x -= 1;
  }
  this.moveright = function() {
    if (this.board.canMoveTo(this, this.x + 1, this.y))
      this.x += 1;
  }

  this.isMonster = function() {
    return false;
  }

  this.turn = function() {}

  this.checkAlive = function() {}
}

function Man(board, x, y, pixelWidth, context, colour) {
  this.x = x;
  this.y = y;
  this.pixelWidth = pixelWidth;
  this.context = context;
  this.colour = colour;
  this.board = board;
}

Man.prototype = new Thing();



function Monster(board, man, x, y, pixelWidth, context, colour)  {
  this.x = x;
  this.y = y;
  this.pixelWidth = pixelWidth;
  this.context = context;
  this.colour = colour;
  this.board = board;
  this.man = man;
  this.counter = 0;
  this.direction = 180;
  this.change_x = 0;
  this.change_y = 0;

  this.isMonster = function() {
    return true;
  }

  this.turn = function() {
    var multiplier = (this.board.attack) ? -1 : 1;
    var moved = false;
    if (this.counter % 4 == 0 || this.board.close(this.man, this.x, this.y)) {
      this.change_x = 0; this.change_y = 0;
      if ((this.x > this.man.x)) {
        this.change_x = -1 * multiplier;
      }
      if ((this.x < this.man.x)) {
        this.change_x = 1 * multiplier;
      }
      if ((this.y < this.man.y)) {
        this.change_y = 1 * multiplier;
      }
      if ((this.y > this.man.y)) {
        this.change_y = -1 * multiplier;
      }
    }
    if (this.board.canMoveTo(this, this.x + this.change_x, this.y + this.change_y)) {
      this.x += this.change_x;
      this.y += this.change_y;
      moved = true;
      //this.counter = 0;
    }

    if (!moved) {
      // lets try a random direction
      this.change_y = Math.floor(Math.random() * 3) - 1;
      this.change_x = Math.floor(Math.random() * 3) - 1;
    }
    this.counter += 1;
    if (this.board.attack === false) {
      if (this.x == man.x && this.y == man.y) {
        board.captured();
      }
    } else if (this.board.attack === true) {
      if (this.x === man.x && this.y === man.y) {
        var newLocation = this.board.spawnLocation()
        this.x = newLocation.x;
        this.y = newLocation.y;
      }
      this.counter += 1;
    }
  }
}


function Energy(board, man, x, y, pixelWidth, context)  {
  this.x = x;
  this.y = y;
  this.pixelWidth = pixelWidth;
  this.board = board;
  this.man = man;
  this.context = context;
  this.colour="green";

  this.checkAlive = function() {
    if (this.board.attack == false && man.x == this.x && man.y == this.y) {
      alert("Attack")
      this.board.attack = true;
    }
  }

}

Monster.prototype = new Thing();
Energy.prototype = new Thing();

function Board(width, height, pixelWidth, context) {
  this.width = width;
  this.height = height;
  this.pixelWidth = pixelWidth;
  this.context = context;
  this.things = new Array();
  this.context.canvas.width = (width + 1) * pixelWidth;
  this.context.canvas.height = (height + 1) * pixelWidth;
  this.deaths = 0;
  this.lives = 5;
  this.health = 100;
  this.attack = false

  this.createCellArray = function() {
    var cells = new Array(this.width);
    for (var x = 0; x < this.width; x += 1) {
      cells[x] = new Array(this.height);

    }
    for (var x=0; x < this.width; x += 1) {
      for (var y=0; y < this.height; y += 1) {
        cells[x][y] = 0
      }
    }
    return cells;
  }
  this.cells = this.createCellArray();

  this.createMaze = function() {
    for (var i=0; i < this.width; i += 1) {
      for (var j=0; j < this.height; j += 1) {
        this.cells[i][j] = (Math.random() > 0.23) ? 0 : 1
      }
    }
  }


  this.add = function(object) {
    this.things.push(object);
  }

  this.canMoveTo = function(thing, x, y) {
    var withinBoardAndNotWall = ((x >= 0) && (x < this.width)
      && (y >= 0) && (y < this.height)
      && (this.cells[x][y] === 0));
    if (!withinBoardAndNotWall)
      return false;
    if (thing != null && thing.isMonster()) {
      for (var i = 0; i< this.things.length; i++) {
        if (this.things[i].isMonster() && thing !== this.things[i]) {
          var isMonsterIntoMonster = (x === this.things[i].x && y === this.things[i].y)
          if (isMonsterIntoMonster) {
            return false;
          }
        }
      }
    }
    return true;
  }

  this.close = function(man, x, y) {
    return (x >= (man.x - 3)) && (x <= (man.x + 3)) && (y >= (man.y - 3)) && (y <= (man.y + 3))
  }

  this.drawGrid = function() {
    for (var x = 0; x < (this.width + 1); x += 1) {
      this.context.moveTo(x * this.pixelWidth, 0);
      this.context.lineTo(x * this.pixelWidth, this.height * this.pixelWidth);
    }

    for (var y = 0; y < (this.height + 1); y += 1) {
      this.context.moveTo(0, y * this.pixelWidth);
      this.context.lineTo(this.width * this.pixelWidth, y * this.pixelWidth);
    }

    this.context.strokeStyle = "black";
    this.context.stroke();
  }

  this.drawCells = function() {
    this.context.clearRect(0, 0, (this.width + 1) * pixelWidth, (this.height + 1) * pixelWidth)
    for (var x = 0; x < this.width; x += 1) {
      for (var y = 0; y < this.height; y += 1) {
        if (this.cells[x][y] === 1) {
          this.context.fillStyle="black";
          this.context.fillRect((x * this.pixelWidth) + 1, (y * this.pixelWidth) + 1, this.pixelWidth - 1, this.pixelWidth - 1)
        }
      }
    }
    for (i = 0; i< this.things.length; i++) {
      this.things[i].draw()
    }
  }

  this.turn = function() {
    for (var i = 0; i< this.things.length; i++) {
      this.things[i].turn()
    }
  }

  this.checkAlive = function() {
    for (var i = 0; i< this.things.length; i++) {
      this.things[i].checkAlive()
    }
  }

  this.spawnLocation = function() {
    while (true) {
      x = Math.floor(Math.random() * this.width);
      y = Math.floor(Math.random() * this.height);
      if (this.canMoveTo(null, x,y))
        return {x: x, y: y}
    }
  }

  this.captured = function() {
    if (this.attack === false) {
      if (this.lives <= 0) {
        this.lives = 5;
        this.deaths += 1;
        document.getElementById('deaths').innerHTML = "DEATHS: " + this.deaths;
      } else if (this.health <= 0) {
        this.health = 120;
        this.lives -= 1;
        document.getElementById('lives').innerHTML = "LIVES: " + this.lives;
      } else if (this.health > 0){
        this.health -= 20;
        document.getElementById('health').innerHTML = "HEALTH: " + this.health;
      }
    }
  }
}

var start = function() {
  var canvas = document.getElementById("myCanvas");
  var context = canvas.getContext("2d");
  var board = new Board(50, 50, 10, context);
  board.createMaze();
  canvas.style.width = '' + (board.width * 10)  + 'px';
  canvas.style.height = '' + (board.height * 10) + 'px' ;

  var loc = board.spawnLocation()
  var location = board.spawnLocation()
  var man = new Man(board, loc.x, loc.y, 10, context, "blue");
  loc = board.spawnLocation()
  var monster = new Monster(board, man, loc.x, loc.y + 10, 10, context, "yellow");
  loc = board.spawnLocation()
  var monster2 = new Monster(board, man, loc.x + 10, loc.y, 10, context, "red");
  board.add(man);
  board.add(monster);
  board.add(monster2);


  document.onkeydown = function(e) {
    e = e || window.event;
    if (e.keyCode == '38') {
      man.moveup()
    } else if (e.keyCode == '40') {
      man.movedown()
    } else if (e.keyCode == '37') {
      man.moveleft()
    } else if (e.keyCode == '39') {
      man.moveright()
    }
  }
  var points = 0;

  setInterval(function() {
    board.drawCells();
  }, 1000 / 60);
  setInterval(function() {
    if (board.deaths < 1) {
      var pointsInterval = setInterval(function() {
        points += 1
        document.getElementById("points").innerHTML = "POINTS: " + points;
        clearInterval(pointsInterval)
      }, 100)
    }
  }, 1000)
  setInterval(function() {
    loc = board.spawnLocation()
    var energy = new Energy(board, man, loc.x, loc.y, 10, context);
    board.add(energy);
    energy.turn()
  }, 10000)
  setInterval(function() {
    if (Monster.x == man.x && Monster.y == man.y) {
      if (board.attack === false) {
        board.captured();
      } else if (board.attack === true) {
        loc = board.spawnLocation()
        Monster.x = loc.x;
        Monster.y = loc.y;
      }
    }
  }, 1000 / 60)
  setInterval(function() {
    board.turn();
  }, 1000 / 5);

  setInterval(function() {
    board.checkAlive();
  }, 10);
}
