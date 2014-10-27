var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d")

var grd = ctx.createLinearGradient(0,0,145,0);
grd.addColorStop(0,"red");
grd.addColorStop(0.2,"orange");
grd.addColorStop(0.4,"yellow");
grd.addColorStop(0.6,"green");
grd.addColorStop(0.8,"blue");
grd.addColorStop(1,"purple");

ctx.save();
ctx.fillStyle = grd;
x = 60;
y = 100;

ctx.translate(x, y);
ctx.rotate(-Math.PI / 7);

ctx.textAlign = 'center';
ctx.font = "30px Courier";
ctx.fillText('Javascript', 60, 25);

var grd2 = ctx.createLinearGradient(0,0,200,0);
grd2.addColorStop(0,"black");
grd2.addColorStop(1,"white");

ctx.fillStyle = grd2;
x = 60;
y = 50;

ctx.translate(x, y);
ctx.rotate(-Math.PI / -5);

ctx.textAlign = 'center';
ctx.font = "25px Verdana";
ctx.fillText('Python', 60, 25);

ctx.restore();

ctx.font = "20px sans-serif";
ctx.strokeText('HTML and CSS', 10, 25);
