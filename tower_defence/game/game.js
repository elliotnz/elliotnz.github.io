function Thing()  {
  this.id = Math.floor(Math.random() * 9999999);
  this.x = 0;
  this.y = 0;
  this.name = null;

  this.turn = function() {};
}


function Tower() {
  this.name = null;
  this.radius = 0;
  this.attackRange = 0;
  this.attackSpeed = 0;
  this.weapon = null;
  this.cost = 0;
  this.sellPrice = 0;
  this.enemiesDestroyed = 0;
}

Tower.prototype = new Thing()

function Koala(game, pos) {
  this.id = Math.floor(Math.random() * 9999999);
  this.placed = false;
  this.x = pos.x;
  this.y = pos.y;
  this.name = "Koala";
  this.radius = 60;
  this.attackRange = 100;
  this.attackSpeed = 5;
  this.cost = 200;
  this.sellPrice = 150;
  this.enemiesDestroyed = 0;
  this.setWeapon = function(weapon) {
    this.weapon = weapon;
  }
}
Koala.prototype = new Tower()

function Weapon()  {
  this.name = null
  this.tower = null;

  this.turn = function() {}
}

Weapon.prototype = new Thing()

function Stick() {
  this.name = "stick"
}

Stick.prototype = new Weapon()

function Game() {
  this.towers = [new Koala(this, {x: 0, y: 0})]
  this.towersOnScreen = [];
  this.towersPlaced = [];
}
