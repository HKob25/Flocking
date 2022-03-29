function boid(x, y) {
  this.acc = createVector(0, 0);
  this.vel = createVector(random(-1, 1), random(-1, 1));
  this.pos = createVector(x, y);
  this.size = 5;
  this.maxspeed = 3;    
  this.maxforce = 0.05; 
  this.main = 0;
}


boid.prototype.run = function(flock, s, a, c, obs) {

  	this.apply(flock, s, a, c, obs);
  	this.update();
	  this.borders();
  	this.render();
}

boid.prototype.applyForce = function(force) {
  
  this.acc.add(force);
}


boid.prototype.apply = function(flock, s, a, c, obs) {
  //applying the necessary 3 forces of the algorithm
  let sep = this.sep(flock);   
  let ali = this.ali(flock);      
  let coh = this.coh(flock);
  let obsep = this.obsep(obs);  
  let mous = this.mou(); 
  
  sep.mult(s);
  ali.mult(a);
  coh.mult(c);
  obsep.mult(20);
  mous.mult(1);
  
  this.applyForce(obsep);
  this.applyForce(mous);
  this.applyForce(sep);
  this.applyForce(ali);
  this.applyForce(coh);
}


boid.prototype.update = function() {
  
  this.vel.add(this.acc);
  if(this.vel.mag() < 1)
  	this.vel.normalize();
  this.vel.limit(this.maxspeed);
  this.pos.add(this.vel);
  this.acc.mult(0);
}


boid.prototype.borders = function() {
  if (this.pos.x < -this.size)  this.pos.x = width + this.size;
  if (this.pos.y < -this.size)  this.pos.y = height + this.size;
  if (this.pos.x > width + this.size) this.pos.x = -this.size;
  if (this.pos.y > height + this.size) this.pos.y = -this.size;
}


boid.prototype.render = function() {
  
  let theta = this.vel.heading() + radians(90);
  //radians(90) = pi/2 ?

  //drawing an individual boid
  fill(50,(this.pos.x)*.5,this.pos.y*0.5); 
  strokeWeight(1);
  stroke(200);
  //push-pop are there to end the applied transformations when done
  push();
  translate(this.pos.x, this.pos.y);
  rotate(theta);
  beginShape();
  vertex(0, -this.size * 2);
  vertex(-this.size, this.size * 2);
  vertex(this.size, this.size * 2);
  endShape(CLOSE);
  pop();
}



boid.prototype.obsep = function(flock, obs) {
  let dir = 25.0;
  let steer = createVector(0, 0);
  
  for (let i = 0; i < OBB.length; i++) {
    let d = p5.Vector.dist(this.pos,OBB[i].pos) - OBB[i].size/2;
    
    if ((d > 0) && (d < dir)) {
      
      let diff = p5.Vector.sub(this.pos, OBB[i].pos);
      diff.normalize();
      diff.div(d);        
      steer.add(diff);
    }
  }

  if (steer.mag() > 0) {
    
    steer.normalize();
    //steering force = desired vel - current vel
    steer.mult(this.maxspeed);
    steer.sub(this.vel);
    steer.limit(this.maxforce);
  }
  return steer;
}



boid.prototype.sep = function(flock, obs) {
  let dir = 25.0;
  let steer = createVector(0, 0);
  
  for (let i = 0; i < flock.length; i++) {
    let d = p5.Vector.dist(this.pos,flock[i].pos);
    
    if ((d > 0) && (d < dir)) {
      
      let diff = p5.Vector.sub(this.pos, flock[i].pos);
      diff.normalize();
      diff.div(d);        
      steer.add(diff);
    }
  }

  if (steer.mag() > 0) {
    
    steer.normalize();
    //steering force = desired vel - current vel
    steer.mult(this.maxspeed);
    steer.sub(this.vel);
    steer.limit(this.maxforce);
  }
  return steer;
}




boid.prototype.ali = function(flock) {
  let neighbordist = 200;
  let sum = createVector(0,0);

  for (let i = 0; i < flock.length; i++) {
    let d = p5.Vector.dist(this.pos,flock[i].pos);
    if ((d > 0) && (d < neighbordist)) {
      sum.add(flock[i].vel);
    }
  }

    sum.normalize();
    sum.mult(this.maxspeed);
	sum.sub(this.vel);
	sum.limit(this.maxforce);
    return sum;
}




boid.prototype.coh = function(flock) {
  let neighbordist = 200;
  let sum = createVector(0, 0);   
  let count = 0;
  
  for (let i = 0; i < flock.length; i++) {
    let d = p5.Vector.dist(this.pos,flock[i].pos);
    if ((d > 0) && (d < neighbordist)) {
      sum.add(flock[i].pos); 
      count++;
    }
  }

  if (count > 0) {
    sum.div(count);
    return this.seek(sum);  
  } else {
    return createVector(0, 0);
  }
}




boid.prototype.seek = function(target) {
  let desired = p5.Vector.sub(target,this.pos);  
  desired.normalize();
  desired.mult(this.maxspeed);
  
  let steer = p5.Vector.sub(desired,this.vel);
  steer.limit(this.maxforce);  
  return steer;
}


///////////////////////////////////////////////////////////////


boid.prototype.mou = function() {
  let neighbordist = 600;
  let m = createVector(mouseX, mouseY);
  let sum = createVector(0, 0);   
  let count = 0;
  
    let d = p5.Vector.dist(this.pos,m);
    if ((d > 0) && (d < neighbordist)) {
      sum.add(m); 
      count++;
    }

  if (count > 0) {
    return this.seek(sum);  
  } else {
    return createVector(0, 0);
  }
}
