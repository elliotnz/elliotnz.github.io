function Handler() {
  this.game = new Game();

  this.keyMap = [];

  this.checkIfCanPlace = function(thing, event) {
    var myGame = this.game
    var e = {x: event.x, y: event.y}
    var canPlace = null;
    //document.getElementsByTagName("body")[0].onmousemove = function(e) {
      canPlace = true
      for (var i = 0; i < myGame.towersPlaced.length; i++) {
        if ((myGame.towersPlaced[i].x - thing.radius / 2 < e.x && myGame.towersPlaced[i].x + myGame.towersPlaced[i].radius + thing.radius / 2 > e.x)
        && (myGame.towersPlaced[i].y - thing.radius / 2 < e.y && myGame.towersPlaced[i].y + myGame.towersPlaced[i].radius + thing.radius / 2 > e.y)) {
          if (myGame.towersOnScreen.length > 1) {
            canPlace = false
            break;
          }
        }
      }
      if (e.x < window.innerWidth - 126 - thing.radius / 2 + 1 && e.y < window.innerHeight - 100 - thing.radius / 2 + 1) {

      } else {
        canPlace = false
      }
    //}
    return canPlace
  }

  this.addElement = function(thing) {
    var node = document.createElement("div");
    node.setAttribute("id", thing.id);
    node.setAttribute("class", thing.name + " tower");
    node.style.left = thing.x - thing.radius / 2
    node.style.top = thing.y - thing.radius / 2
    node.style.backgroundColor = "grey"

    document.getElementsByTagName("body")[0].appendChild(node);

    this.game.towersOnScreen.push(thing)
    var node = document.getElementsByClassName(thing.name)[this.game.towersOnScreen.length - 1]

    node.style.backgroundColor = "red"

    var canPlace = null
    var me = this
    document.getElementsByTagName("body")[0].onmousemove = function(e) {
      if (!thing.placed) {
        thing.x = e.x - thing.radius / 2
        thing.y = e.y - thing.radius / 2
        node.style.left = thing.x
        node.style.top = thing.y
      }
      canPlace = me.checkIfCanPlace(thing, e)
      if (!canPlace && !thing.placed) {
        node.style.backgroundColor = "red"
      } else {
        node.style.backgroundColor = "grey"
      }
    }

    var toRemove = false
    if (this.keyMap['27']) {
      alert("hi")
      //alert("hi")
      // var parentDiv = node.parentNode;
      // parentDiv.removeChild(node);
      toRemove = true
      canPlace = false
    }

    var myGame = this.game
    //if (canPlace) {
      document.getElementsByClassName(thing.name)[this.game.towersOnScreen.length - 1].onclick = function(e) {
        if (canPlace) {
          thing.placed = true;
          node.style.zIndex = "1";
          myGame.towersPlaced.push(thing)
        } else if (toRemove) {
          var parentDiv = node.parentNode;
          parentDiv.removeChild(node);
        }
      }
    //}
  }

  this.init = function() {
    for (var i = 0; i < this.game.towers.length; i++) {
      var node = document.createElement("div");
      node.setAttribute("id", this.game.towers[i].name);
      node.setAttribute("class", "tool");
      var toolbar = document.getElementById("right")
      toolbar.appendChild(node);
      if (i < 2) {
          node.style.borderTopWidth = "2px"
      }
      if (i >= this.game.towers.length - 2) {

      }
      if (i % 2 !== 0) {
        node.style.borderRightWidth = "2px"
      } else if (i === this.game.towers.length - 1) {
        node.style.borderRightWidth = "2px"
      }
    }
    document.getElementsByTagName("HTML")[0].onclick = function(e) {
      handler.addThing(e);
    };
  }

  this.addThing = function(event) {
    var x = event.target;
    if (x.className === "tool") {
      var pos = {x: event.x, y: event.y}
      var thing = eval("new " + x.id + "(this.game, pos)");
      this.addElement(thing);
    }
  }
  this.keyUpDown = function(e) {
    e = e || event; // to deal with IE\
    this.keyMap = [];
    this.keyMap[e.keyCode] = e.type == 'keydown';
  }
}

var handler = null;

var run = function() {
  window.addEventListener("keydown", function(e) {
    // space and arrow keys
    if ([37, 39, 38, 40].indexOf(e.keyCode) > -1) {
      e.preventDefault();
    }
  }, false);
  handler = new Handler();
  //handler.keyMap = [];
  document.onkeydown = handler.keyUpDown;
  document.onkeyup = handler.keyUpDown;

  handler.init();
};
