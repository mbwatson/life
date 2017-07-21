// Dimensions
var radius = 8;
var cols;
var rows;
var current_cells;
var next_cells;
var fillRatio = 0.1;
// Colors
var backgroundColor;
var aliveColor;
var deadColor;
// Timing
var time;
var last_time;
var ticksPerSecond = 6;
var paused = false;

var canvasStyle = 'cursor: default;\
						 			 margin-left: auto;\
									 margin-right: auto;\
 									 display: block;';

function setup() {
	// UI
	var buttonStyle = 'padding: 2px 20px; border-radius: 5px; margin: 0 5px;';
	ui = createDiv('').style('text-align: center; padding: 20px 0; height:50px;');
	ui.child(killButton = createButton("Nuke").addClass('btn-danger').style(buttonStyle).mousePressed(killCells));
	ui.child(spacer = createSpan(' ').style('padding: 0 30px;'));
	ui.child(populateButton = createButton("Populate").addClass('btn-warning').style(buttonStyle).mousePressed(populateCells));
	ui.child(playButton = createButton("&#9208;").addClass('btn-primary').style(buttonStyle));
	ui.child(stepButton = createButton('+1').addClass('btn-primary').style(buttonStyle));
	ui.child(spacer = createSpan(' ').style('padding: 0 30px;'));
	ui.child(decelButton = createButton("&#9194;").addClass('btn-primary').style(buttonStyle));
	ui.child(ticksPerSecondP = createElement('p', ticksPerSecond).addClass('rate').style('display: inline; padding: 0 15px; font-weight: bold;'));
	ui.child(accelButton = createButton("&#9193;").addClass('btn-primary').style(buttonStyle));
	ui.child(spacer = createSpan(' ').style('padding: 0 30px;'));
	ui.child(infoButton = createButton("?").addClass('btn-info').style(buttonStyle));
  killButton.mousePressed(killCells);
  populateButton.mousePressed(populateCells);
  playButton.mousePressed(playPauseGame);
  stepButton.mousePressed(stepForward);
  decelButton.mousePressed(decelerate);
  accelButton.mousePressed(accelerate);
  infoButton.mousePressed(showInfo);

	createCanvas(windowWidth-2, windowHeight-40).style(canvasStyle);
	cols = floor((width/radius - 1)/2);
	rows = floor((height-2*radius/cos(PI/12))/(radius*sqrt(3)) - 1)-2;
	frameRate(60);
	ellipseMode(CENTER);
	time = millis();
	last_time = millis();

	// Settings
	backgroundColor = color(255, 255, 255);
	aliveColor = color(31, 31, 31);
	deadColor = color(210, 210, 220);
	stroke(backgroundColor);
	strokeWeight(1);


  // Initialize cells
	current_cells = make2DArray(cols, rows);
	next_cells = make2DArray(cols, rows);
	for (var i = 0; i < cols; i++) {
		for (var j = 0; j < rows; j++) {
			current_cells[i][j] = new Cell(i, j, random() < fillRatio);
			next_cells[i][j] = new Cell(i, j);
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
	// Find cell that's hovered over
	for (var col = 0; col < cols; col++) {
		for (var row = 0; row < rows; row++) {
			var this_cell = current_cells[col][row];
			if (this_cell.contains(mouseX, mouseY)) {
				fill(this_cell.alive ? aliveColor : deadColor);
				hexagon(this_cell.center.x, this_cell.center.y, radius);
			}
			break;
		}
	}
	if (time - last_time >= floor(1000 / ticksPerSecond)) {
		if (!paused) {
			tick();
			last_time = time;
		}
	}
}

function giveLife() {
	for (var col = 0; col < cols; col++) {
		for (var row = 0; row < rows; row++) {
			if (current_cells[col][row].contains(mouseX, mouseY)) {
				current_cells[col][row].alive = true;
			}
		}
	}
}

function mouseDragged() {
	giveLife();
}

function mousePressed() {
	giveLife();
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
			var this_cell = current_cells[col][row];
			if (this_cell.alive == true) {
				if ((this_cell.countNeighbors() == 3) ||
						this_cell.countNeighbors() == 4) {
					next_cells[col][row].alive = true;
				} else {
					next_cells[col][row].alive = false;
				}
			} else {
				if (this_cell.countNeighbors() == 2) { next_cells[col][row].alive = true; }
			}
		}
	}
	for (var col = 0; col < cols; col++) {
		for (var row = 0; row < rows; row++) {
			current_cells[col][row].alive = next_cells[col][row].alive;
		}
	}
}

function hexagon(x, y, apothem) {
	beginShape();
	vertex(x, y - 2 * apothem / sqrt(3));
	vertex(x + apothem, y - apothem / 2);
	vertex(x + apothem, y + apothem / 2);
	vertex(x, y + 2 * apothem / sqrt(3));
	vertex(x - apothem, y + apothem / 2);
	vertex(x - apothem, y - apothem / 2);
	endShape();

}
