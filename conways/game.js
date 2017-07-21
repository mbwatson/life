// Dimensions
var xDim;
var yDim;
var cell_width = 25;
var current_cells;
var next_cells;
var cols;
var rows;
var fillRatio = 0.20;
// Colors
var backgroundColor;
var aliveColor;
var deadColor;
var strokeColor;
var time;
var last_time;
var ticksPerSecond;
// UI
var paused = false;

function setup() {
	// Timing
	frameRate(20);
	time = millis();
	last_time = millis();
	ticksPerSecond = 4;
	
	// UI
	var buttonStyle = 'padding: 2px 20px; border-radius: 5px; margin: 0 5px;';
	ui = createDiv('').style('text-align: center; padding: 20px 0; height:50px;');
	ui.child(killButton = createButton("Nuke").addClass('btn-danger').style(buttonStyle).mousePressed(killCells));
	ui.child(spacer = createSpan(' ').style('padding: 0 5%;'));
	ui.child(populateButton = createButton("Populate").addClass('btn-warning').style(buttonStyle).mousePressed(populateCells));
	ui.child(playButton = createButton("&#9208;").addClass('btn-primary').style(buttonStyle));
	ui.child(stepButton = createButton('+1').addClass('btn-primary').style(buttonStyle));
	ui.child(spacer = createSpan(' ').style('padding: 0 5%;'));
	ui.child(decelButton = createButton("&#9194;").addClass('btn-primary').style(buttonStyle));
	ui.child(ticksPerSecondP = createElement('p', ticksPerSecond).addClass('rate').style('display: inline; padding: 0 15px; font-weight: bold;'));
	ui.child(accelButton = createButton("&#9193;").addClass('btn-primary').style(buttonStyle));
	ui.child(spacer = createSpan(' ').style('padding: 0 5%;'));
	ui.child(infoButton = createButton("?").addClass('btn-info').style(buttonStyle));
  killButton.mousePressed(killCells);
  populateButton.mousePressed(populateCells);
  playButton.mousePressed(playPauseGame);
  stepButton.mousePressed(stepForward);
  decelButton.mousePressed(decelerate);
  accelButton.mousePressed(accelerate);
  infoButton.mousePressed(showInfo);

	// Dimensions
	cols = floor(windowWidth / cell_width);
	rows = floor(windowHeight / cell_width) - 3;
  xDim = cols * cell_width;
  yDim = rows * cell_width;
  var canvasStyle = 'cursor: default;\
  									margin-left: auto;\
  									margin-right: auto;\
  									display: block;';
	createCanvas(xDim, yDim).style(canvasStyle);
	
	// Colors
	backgroundColor = color(255);
	aliveColor = color(31, 31, 31);
	deadColor = color(210, 210, 220);
	strokeColor = backgroundColor;
	
	// Initialize cells
	current_cells = make2DArray(cols, rows);
	next_cells = make2DArray(cols, rows);
	for (var i = 0; i < cols; i++) {
		for (var j = 0; j < rows; j++) {
			current_cells[i][j] = new Cell(i, j, cell_width, random() < fillRatio);
			next_cells[i][j] = new Cell(i, j, cell_width);
		}
	}
}

function draw() {
	time = millis();
	background(backgroundColor);
	for (var i = 0; i < cols; i++) {
		for (var j = 0; j < rows; j++) {
			current_cells[i][j].show();
		}
	}
	if (time - last_time > 1000 / ticksPerSecond) {
		if (!paused) {
			tick();
			last_time = time;
		}
	}
}

function make2DArray(cols, rows) {
	var arr = new Array(cols);
	for (var i = 0; i < arr.length; i++) {
		arr[i] = new Array(rows);
	}
	return arr;
}

function tick() {
	for (var col = 0; col < cols; col++) {
		for (var row = 0; row < rows; row++) {
			if (current_cells[col][row].alive == true) {
				if ((current_cells[col][row].countNeighbors() == 2) || (current_cells[col][row].countNeighbors() == 3)) {
					next_cells[col][row].alive = true;
				} else {
					next_cells[col][row].alive = false;
				}
			} else {
				if (current_cells[col][row].countNeighbors() == 3) { next_cells[col][row].alive = true; }
			}
		}
	}
	// current_cells = next_cells.slice();
	for (var col = 0; col < cols; col++) {
		for (var row = 0; row < rows; row++) {
			current_cells[col][row].alive = next_cells[col][row].alive;
		}
	}
}

function giveLife() {
	for (var col = 0; col < cols; col++) {
		for (var row = 0; row < rows; row++) {
			if (current_cells[col][row].contains(mouseX, mouseY)) {
				// var aliveOrDead = current_cells[col][row].alive ? "Alive" : "Dead";
				// var nextState = current_cells[col][row].aliveNext() ? "alive" : "dead";
				// console.log("("+col+","+row+") : " + aliveOrDead +
				// 	" with " + current_cells[col][row].countNeighbors() + " neighbors. " +
				// 	" About to be " + nextState + ".");
				current_cells[col][row].alive = true;
			}
		}
	}
}

function mousePressed() {
	giveLife();
}

function mouseDragged() {
	giveLife();
}
