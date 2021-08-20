

var multipCircle;

function setup() {
  createCanvas(600,600).parent('viz');

  multipCircle = new MultiplicationCircle(vec2(width/2,height/2), 150, 10, 2);

} // Ends P5JS Function setup

function draw() {
  background(0,180,255);

  multipCircle.render();

  drawCrossHair();
  drawFPS();
  drawCanvasBorder();
} // Ends P5JS Function draw

function mousePressed(){

  return false; // avoids unwanted GUI behavior
} // Ends P5JS Function mousePressed


function drawCrossHair(){stroke(255,180,0,128); strokeWeight(2); noFill(); line(0,height/2,width,height/2); line(width/2,0,width/2,height); ellipse(width/2,height/2,width/2,height/2); ellipse(width/2,height/2,width,height);}
function drawFPS(blurb="FPS: "){noStroke();fill(0,128); rect(0,height-20,80,height-20);textSize(16); textAlign(LEFT,CENTER); strokeWeight(2); stroke(0); fill(255);text(blurb+round(frameRate()), 10, height-8);}
function drawCanvasBorder(){stroke(60); strokeWeight(4); noFill(); rect(0,0,width,height);}
function vec2(x=0,y=0){return createVector(x,y);}




class MultiplicationCircle{
  constructor(pos, rad, nPts, mFac){
    this.pos    = pos;
    this.rad    = rad;
    this.ptRad  = 20;
    this.numPts = nPts;
    this.factor = mFac;

    this.cPts = [];
    this.fPts = [];

    this.calcPoints();
  } // Ends Constructor 


  calcPoints(){
    let deg = 0;
    let degPerPt = 360/this.numPts;
    
    // check/handle mem free of old contents?
    this.cPts = []; 
    this.fPts = []; 

    for(let i=0; i<this.numPts; i++){
      this.cPts.push(this.getCirclePt(deg));
      deg += degPerPt;
    }

    for(let i=1; i<this.numPts; i++){
      this.fPts.push(this.cPts[floor((this.factor*i)%this.numPts)]);
    }
  } // Ends Function 


  getCirclePt(degree, degOff=180){
    return createVector(this.rad*cos(radians(degree+degOff)), this.rad*sin(radians(degree+degOff)));
  } // Ends Function getCirclePt


  render(){
    noFill();
    strokeWeight(2);
    stroke(0,int(random(60,120)),int(random(120,255)));
    ellipseMode(CENTER);

    // draws circle encompassing rad
    ellipse(this.pos.x,this.pos.y,this.rad*2,this.rad*2);

    for(let i=0; i<this.numPts; i++){
      ellipse(this.pos.x+this.cPts[i].x, this.pos.y+this.cPts[i].y, this.ptRad, this.ptRad);
    }  

    for(let i=1; i<this.numPts; i++){
      line(this.pos.x+this.cPts[i].x, this.pos.y+this.cPts[i].y, this.pos.x+this.fPts[i-1].x, this.pos.y+this.fPts[i-1].y);
    }  

  } // Ends Function render


} // Ends Class MultiplicationCircle