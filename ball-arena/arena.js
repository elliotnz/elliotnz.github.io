var game = new Game();

function Game() {
  this.keyMap = [];
  this.alert = false;
  this.cars = [];
  this.car = null;
  this.carPosition = null;
  this.browserWidth = null;
  this.browserHeight = null;

  this.addCar = function(car) {
    var node = document.createElement("div");
    node.setAttribute("class", "car");
    node.style.position = "absolute";
    node.style.borderRadius = "50%";
    if (!car.player) {
      node.style.zIndex="-1"
    }
    node.style.marginLeft = (((window.innerWidth || document.body.clientWidth) - car.size) / 2) + "px";
    node.style.marginTop = (((window.innerHeight || document.body.clientHeight) - car.size) / 2) + "px";
    node.style.width = car.size + "px";
    node.style.height = car.size + "px";
    node.style.backgroundColor = car.colour;

    document.getElementsByTagName("body")[0].appendChild(node);
    this.cars.push(car);
  }

  this.getCar = function() {
    for (var i in this.cars) {
      if (this.cars[i].player) {
        this.car = this.cars[i];
        this.carPosition = i;
        break;
      }
    }
  }

  this.turn = function() {
    if (this.car == null) {
      this.getCar();
    }
    this.browserWidth = (window.innerWidth || document.body.clientWidth) - parseInt(document.getElementsByClassName("car")[game.carPosition].style.width);
    this.browserHeight = (window.innerHeight || document.body.clientHeight) - parseInt(document.getElementsByClassName("car")[game.carPosition].style.height);
    for (var i in this.cars) {
      this.cars[i].turn();
    }
    if (this.keyMap['37']) {
      this.car.moveHorizontal(-1);
    }
    if (this.keyMap['39']) {
      this.car.moveHorizontal(1);
    }
    if (!this.keyMap['37'] && !this.keyMap['39']) {
      this.car.notPressingHorizontal();
    }
    if (this.keyMap['38']) {
      this.car.moveVertical(-1);
    }
    if (this.keyMap['40']) {
      this.car.moveVertical(1);
    }
    if (!this.keyMap['38'] && !this.keyMap['40']) {
      this.car.notPressingVertical();
    }
  }

  this.keyUpDown = function(e) {
    e = e || event; // to deal with IE
    game.keyMap[e.keyCode] = e.type == 'keydown';
  }
}

function Car(colour, player, size) {
  this.colour = colour;
  this.player = player;
  this.size = size;
  this.x = null;
  this.y = null;
  this.speedX = 0;
  this.speedY = 0;
  this.speedY = 0;
  this.drag = 1;
  this.counter = 0;
  this.currentColor = 1;
  this.colours = ["red", "orange", "yellow", "green", "blue", "purple", "indigo"]

  this.turn = function() {
    this.x = parseInt(document.getElementsByClassName("car")[game.carPosition].style.marginLeft);
    this.y = parseInt(document.getElementsByClassName("car")[game.carPosition].style.marginTop);
    if (this.currentColor < this.colours.length - 1 && this.counter === 20) {
      document.getElementsByClassName("car")[game.carPosition].style.backgroundColor = this.colours[this.currentColor];
      this.currentColor += 1;
      this.counter = 0;
    } else if (this.counter === 20) {
      document.getElementsByClassName("car")[game.carPosition].style.backgroundColor = this.colours[this.currentColor];
      this.currentColor = 0;
      this.counter = 0;
    } else {
      this.counter += 1;
    }
  }

  this.moveHorizontal = function(direction) {
    var speed = direction * (10000 / (parseInt(document.getElementsByClassName("car")[game.carPosition].style.width) * parseInt(document.getElementsByClassName("car")[game.carPosition].style.height)));
    this.speedX += speed;
    speed = this.speedX;
    var browserWidth = game.browserWidth;
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
    document.getElementsByClassName("car")[game.carPosition].style.marginLeft = (this.x) + "px";
  }

  this.moveVertical = function(direction) {
    var speed = direction * (10000 / (parseInt(document.getElementsByClassName("car")[game.carPosition].style.width) * parseInt(document.getElementsByClassName("car")[game.carPosition].style.height)));
    this.speedY += speed;
    speed = this.speedY;
    var browserHeight = game.browserHeight;
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
    document.getElementsByClassName("car")[game.carPosition].style.marginTop = (this.y) + "px";
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
        var browserWidth = game.browserWidth;
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
        document.getElementsByClassName("car")[game.carPosition].style.marginLeft = (this.x) + "px";
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
        var browserHeight = game.browserHeight;
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
        document.getElementsByClassName("car")[game.carPosition].style.marginTop = (this.y) + "px";
      }
    }
  }
}

function start() {
  var car3 = new Car("red", true, 75);
  game.addCar(car3);

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
