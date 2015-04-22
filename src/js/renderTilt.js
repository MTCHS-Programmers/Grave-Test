$(document).ready(function() {
	c.width = window.innerWidth;
	c.height = window.innerHeight;
});

newID = 0;

function addBall() {
	ballList[ballList.length] = new Ball();
}

function Ball() {
	this.id = newID;
	newID++;
	this.x = window.innerWidth/2,
	this.y = window.innerHeight/2,
	this.rad = 0,
	this.vel = 0,
	this.velAvg = {
		"total": 0,
		"count": 1,
		"calc": function() {
			return this.total / this.count;
		}
	}
	this.move = function() {
		var newVec = addVector(this, calcGravity());
		this.rad = newVec.rad;
		this.vel = newVec.vel;
		
		this.x += Math.cos(this.rad) * this.vel;
		this.y += Math.sin(this.rad) * this.vel;
		
		if(this.x < 10) {
			this.x = 10;
			this.rad = Math.PI - this.rad;
		}
		else if(this.x > window.innerWidth - 10) {
			this.x = window.innerWidth - 10;
			this.rad = Math.PI - this.rad;
		}
		
		if(this.y < 10) {
			this.y = 10;
			this.rad = (2*Math.PI) - this.rad;
		}
		else if(this.y > window.innerHeight - 10) {
			this.y = window.innerHeight - 10;
			this.rad = (2*Math.PI) - this.rad;
		}
		
		this.velAvg.total += this.vel;
		this.velAvg.count++;
		
		/* collision detection */
		for(j=0; j<ballList.length; j++) {
			if(Math.sqrt(Math.pow(this.x - ballList[j].x, 2) + Math.pow(this.y - ballList[j].y, 2)) <= 20 && ballList[j].id != this.id) {
				var temp = {
					"rad": this.rad,
					"vel": this.vel
				};
				
				this.rad = ballList[j].rad;
				this.vel = ballList[j].vel;
				
				ballList[j].rad = temp.rad;
				ballList[j].vel = temp.vel;
			}
		}
	}
}

function render() {
	if(game.touch.length > 0) {
		game.touch.length = [];
		addBall();
	}
	
	clear();
	ctx.fillText(ballList[0].velAvg.calc(), 10, 10);
	
	ctx.beginPath();
	ctx.moveTo(window.innerWidth/2, window.innerHeight/2);
	ctx.lineTo((window.innerWidth/2) + Math.cos(calcGravity().rad) * (calcGravity().vel*500), (window.innerHeight/2) + Math.sin(calcGravity().rad) * (calcGravity().vel*500));
	ctx.stroke();
	
	for(i=0; i<ballList.length; i++) {
		ballList[i].move();
		for(j=i+1; j<ballList.length; j++) {
			ctx.beginPath();
			ctx.moveTo(ballList[i].x, ballList[i].y);
			ctx.lineTo(ballList[j].x, ballList[j].y);
			ctx.stroke();
		}
	}
};

function clear() {
	ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
}

addVector = function(point1, point2) {
	var ax = Math.cos(point1.rad) * point1.vel;
	var ay = Math.sin(point1.rad) * point1.vel;
	
	var bx = Math.cos(point2.rad) * point2.vel;
	var by = Math.sin(point2.rad) * point2.vel;
	
	var rx = bx + ax;
	var ry = by + ay;
	
	var r = Math.sqrt(Math.pow(rx, 2) + Math.pow(ry, 2));
	var theta = Math.atan(ry/rx);
	
	if (rx < 0) theta = theta + Math.PI;
	
	return {
		"vel": r || 0,
		"rad": theta || 0
	}
};

function calcGravity() {
	var xAxisGrav = {
		"rad": Math.PI,
		"vel": game.motion.gravity.x/16 || 0
	}
	
	var yAxisGrav = {
		"rad": Math.PI/2,
		"vel": game.motion.gravity.y/16 || 0
	}
	
	return addVector(xAxisGrav, yAxisGrav);
};

ballList = [];
addBall();
addBall();
setInterval(render, 16);