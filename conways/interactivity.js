function playPauseGame() {
	if (paused) {
		paused = false;
		playButton.html('&#9208;');
	} else {
		paused = true;
		playButton.html('&#9654;');
	}
}

function populateCells() {
	for (var i = 0; i < cols; i++) {
		for (var j = 0; j < rows; j++) {
			current_cells[i][j] = new Cell(i, j, cell_width, random() < fillRatio);
			next_cells[i][j] = new Cell(i, j, cell_width);
		}
	}
}

function stepForward() {
	tick();
}

function decelerate() {
	if (ticksPerSecond > 1) {
		ticksPerSecond--;
		ticksPerSecondP.html(ticksPerSecond);
	}
}

function accelerate() {
	if (ticksPerSecond < 10) {
		ticksPerSecond++;
		ticksPerSecondP.html(ticksPerSecond);
	}
}

function killCells() {
	for (var col = 0; col < cols; col++) {
		for (var row = 0; row < rows; row++) {
			current_cells[col][row].alive = false;
			next_cells[col][row].alive = false;
		}
	}
}

function showInfo() {
	// soon.
}