var moverObjs = [];
var tentacles = [];
var tentSegLen = 20;
var tentNumSeg = 20;
var mySegSnake;

function setup(){
  createCanvas(800,800).parent("viz");
  smooth();
  
  moverObjs.push(new BouncyBall(vec2(width/2,height/2)).setVelocityRandom());

  tentacles.push(new Tentacle(vec2(0,0),tentSegLen,tentNumSeg));
  tentacles.push(new Tentacle(vec2(0,height),tentSegLen,tentNumSeg));
  tentacles.push(new Tentacle(vec2(width,0),tentSegLen,tentNumSeg));  
  tentacles.push(new Tentacle(vec2(width,height),tentSegLen,tentNumSeg));

  mySegSnake = new SegSnake(vec2(300,200),tentSegLen,tentNumSeg,2);

}

function draw(){
  //>>> LOGIC/BEH CALLS
  moverObjs.forEach(m => m.update());
  tentacles.forEach(t => t.update(moverObjs[0].pos));
  mySegSnake.update(moverObjs[0].pos);
  
  //>>> RENDER CALLS
  background(60);
  moverObjs.forEach(m => m.render());  
  tentacles.forEach(t => t.render());
  mySegSnake.render();
}

function vec2(x,y){
  return createVector(x,y);
}