var start = function() {
  var element = document.getElementById("example");
  var elementText = false;
  element.onmouseup = function() {
    if (elementText) {
      element.innerHTML = "More Javascript!";
      element.style.fontSize = null;
      elementText = false;
    } else {
      elementText = true;
      element.innerHTML = "Hello Javascript!";
      element.style.fontSize = 50;
    }
  }
}
