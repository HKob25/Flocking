let OBB = [];
let f;
let s;
let a;
let c;
let size = 50;


function setup() {
  createCanvas(1500, 650);
  createP("Drag the mouse to generate new boids.");

  //assignig the "flock" variable as a "Flock" object
  f = new flock();

  //filling the flock with boids
  for (let i = 0; i < 200; i++) {
    let b = new boid(random(width/4, 3*width/4), random(height/4, 3*height/4));
    f.addBoid(b);
  }


  for (let i = 0; i < 3; i++) {
    let o = new obst(random(width/5, 4*width/5), random(height/5, 4*height/5), size);
    OBB.push(o);
  }
  
  createSpan("Separation");
  ss = createSlider(0, 5, 2, 0.1);
  createSpan("Alignment");
  aa = createSlider(0, 5, 1, 0.1);
  createSpan("Cohesion");
  cc = createSlider(0, 5, 1, 0.1);
}


function draw() {
  background(50);
  let s = ss.value();
  let a = aa.value();
  let c = cc.value();
  fill(0);
  strokeWeight(3);
  for (let i = 0; i < OBB.length; i++) 
    circle(OBB[i].pos.x, OBB[i].pos.y, size);
  f.run(s, a, c, OBB);
  noFill();
  circle(f.boids[0].pos.x, f.boids[0].pos.y, 200);
}


function mouseDragged() {
  f.addBoid(new boid(mouseX, mouseY));
}
