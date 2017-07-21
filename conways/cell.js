function Cell(x, y, width, alive) {
	this.col = x;
	this.row = y;
	this.alive = alive || false;
	this.width = width;

	this.show = function() {
		stroke(strokeColor);
		fill(this.alive ? aliveColor : deadColor);
		rect(this.col * this.width, this.row * this.width, this.width, this.width);
	}

	this.contains = function(x, y) {
		return (this.col * this.width < x && x < this.col * this.width + this.width && this.row * this.width < y && y < this.row * this.width + this.width);
	}

	this.toggle = function() {
		this.alive = !this.alive;
	}

	this.countNeighbors = function() {
		var count = 0;
		for (var col_offset = -1; col_offset <= 1; col_offset++) {
			for (var row_offset = -1; row_offset <=1; row_offset++) {
				if (0 <= this.col + col_offset && this.col + col_offset < cols && 0 <= this.row + row_offset && this.row + row_offset < rows) {
					if (col_offset != 0 || row_offset != 0) {
						var neighbor = current_cells[this.col + col_offset][this.row + row_offset];
						if (neighbor.alive) {
							count++;
						}
					}
				}
			}
		}
		return count;
	}

	this.aliveNext = function() {
		if (this.alive) {
			if (this.countNeighbors() < 2 || this.countNeighbors() > 3) {
				return false;
			} else {
				return true;
			}
		} else {
			if (this.countNeighbors() == 3) {
				return true;
			}
		}
	}
}