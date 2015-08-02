function Handler() {
  this.game = new Game();

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

    var myGame = this.game
    var canPlace = null;
    node.style.backgroundColor = "red";
    document.getElementsByTagName("body")[0].onmousemove = function(e) {
      if (!thing.placed) {
        thing.x = e.x - thing.radius / 2
        thing.y = e.y - thing.radius / 2
        node.style.left = thing.x
        node.style.top = thing.y
      }
      canPlace = true
      for (var i = 0; i < myGame.towersPlaced.length; i++) {
        if ((myGame.towersPlaced[i].x - thing.radius / 2 - 1 < e.x && myGame.towersPlaced[i].x + myGame.towersPlaced[i].radius + thing.radius / 2 + 1 > e.x)
        && (myGame.towersPlaced[i].y - thing.radius / 2 - 1 < e.y && myGame.towersPlaced[i].y + myGame.towersPlaced[i].radius + thing.radius / 2 + 1 > e.y)) {
          if (myGame.towersOnScreen.length > 1) {
            canPlace = false
            break;
          }
        }
      }
      if (e.x < window.innerWidth - 126 - thing.radius / 2 + 1&& e.y < window.innerHeight - 100 - thing.radius / 2 + 1) {

      } else {
        canPlace = false
      }
      if (!canPlace && !thing.placed) {
        node.style.backgroundColor = "red"
      } else {
        node.style.backgroundColor = "grey"
      }
    }
    document.getElementsByClassName(thing.name)[this.game.towersOnScreen.length - 1].onclick = function(e) {
      if (canPlace) {
        thing.placed = true;
        node.style.zIndex = "1";
        myGame.towersPlaced.push(thing)
      }
    }
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
}

var handler = null;

var run = function() {
  handler = new Handler();
  handler.init();
};
