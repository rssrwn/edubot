var canvas = document.getElementById("game_canvas");
var entityPicker = document.getElementById("entityPicker");
var saverField = document.getElementById("saverField");

document.getElementById("saveButton").addEventListener("click", saveLevel);
document.getElementById("loadButton").addEventListener("change", loadLevel);
document.getElementById("newLevelButton").addEventListener("click", newLevel);

new ClipboardJS(".clipboard_button");

function canvasClicked(event){
	let x = event.offsetX ? (event.offsetX) : event.pageX-canvas.offsetLeft;
	let y = event.offsetY ? (event.offsetY) : event.pageY-canvas.offsetTop;
  
  // Assumes that the style width is given explicitely in pixels.
  
  x *= canvas.width / Number(canvas.style.width.replace(/[^\d\.\-]/g, ''));
  y *= canvas.height / Number(canvas.style.width.replace(/[^\d\.\-]/g, ''));
  
	let topLeft = level.getTopLeft();
  let bottomRight = level.getBottomRight();
  
  if (x >= topLeft.x && x <= bottomRight.x && y >= topLeft.y && y <= bottomRight.y) {
    let xIndex = Math.floor((x - topLeft.x) / level.squareSize);
    let yIndex = Math.floor((y - topLeft.y) / level.squareSize);
    let square = level.getSquare(xIndex, yIndex);
    
    if (square != null) {
      squareClicked(event.button, xIndex, yIndex);
    }
  }
}

function squareClicked(button, x, y) {
	if (button === 0) {
	  let type = entityPicker.options[entityPicker.selectedIndex].value;
	  eval("var entityToCreate = new " + type + "();");
	  
	  if (entityToCreate !== null) {
	    level.addEntity(entityToCreate, x, y);
	  }
	} else if (button === 1){
		level.getSquare(x, y).setEntity(null);
	}
}

function newLevel() {
	let width = getDimension(document.getElementById("widthField").value);
	let height = getDimension(document.getElementById("heightField").value);
	
	if (width > 0 && height > 0) {
		let lev = createBoundedLevel(width, height, defaultSquareSize);
		
		setLevel(lev);
	}
}

function getDimension(value) {
	let dim = Number(value);
	
	if (dim !== NaN && dim > 0 && dim <= 64) {
		return dim;
	} else {
		return -1;
	}
}

function saveLevel() {
	saverField.value = JSON.stringify(level);
}

var canvasResize = function(e) {
  let canvasPaddingDiv = document.getElementById("canvasPaddingDiv");
  let gameCanvas = document.getElementById("game_canvas");
  
  let size = Math.min(canvasPaddingDiv.offsetWidth, canvasPaddingDiv.offsetHeight);
  gameCanvas.style.width = size + "px";
  gameCanvas.style.height = size + "px";
};

var onResize = function(e) {
  canvasResize(e);
};
window.addEventListener("resize", onResize, false);
onResize();
