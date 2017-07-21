function Cell(x, y, alive) {
	this.col = x;
	this.row = y;
	this.center = createVector(
		(y % 2 == 1 ? x * 2*radius + 2*radius : x * 2*radius + 2*radius / 2),
		y * 2*radius * sqrt(3) / 2 + 2*radius / sqrt(3) + 1
	);
	this.alive = alive || false;

	this.show = function() {
		fill(this.alive ? aliveColor : deadColor);
		hexagon(this.center.x, this.center.y, radius)
		// ellipse(this.center.x, this.center.y, radius * 2, radius * 2);
	}

	this.contains = function(x, y) {
		return dist(x, y, this.center.x, this.center.y) < radius;
	}

	this.toggle = function() {
		this.alive = !this.alive;
	}

	this.countNeighbors = function() {
		var count = 0;
		var adj = (this.row % 2 == 1 ?
			[ {x: 0, y: -1}, {x:1 , y:-1 }, {x:-1 , y:0 }, {x:1 , y:0 }, {x:0 , y:1 }, {x:1 , y:1 } ] :
			[ {x: -1, y: -1}, {x:0 , y:-1 }, {x:-1 , y:0 }, {x:1 , y:0 }, {x:-1 , y:1 }, {x:0 , y:1 } ]
		);
		for (var i = 0; i < 6; i++) {
 			if (0 <= this.col + adj[i].x && this.col + adj[i].x < cols && 0 <= this.row + adj[i].y && this.row + adj[i].y < rows) {
				var neighbor = current_cells[this.col + adj[i].x][this.row + adj[i].y];
				if (neighbor.alive) { count++; }
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