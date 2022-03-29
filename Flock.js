function flock()
{
	this.boids = [];
}

flock.prototype.run = function(s, a, c, obs) {
  //drawing all boids within flock
  for (let i = 0; i < this.boids.length; i++) 
  {
    this.boids[i].run(this.boids, s, a, c, obs); 
  }
}


flock.prototype.addBoid = function(b) {
  this.boids.push(b);
}
