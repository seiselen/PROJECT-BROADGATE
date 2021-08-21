class MultiplicationCircle{
  constructor(pos, rad, pts, fac){
    //>>> Transform State
    this.pos    = pos;
    this.rad    = rad;
    this.ptRad  = 8;

    //>>> Mult Circle State
    this.numPts = pts;
    this.ptsMin =   8;
    this.ptsMax = 256;
    this.ptsTck =   1;
    this.cPts   = [];

    this.factor = fac;
    this.facMin =   2;
    this.facMax = 256;
    this.facTck =   1;
    this.fPts   = [];

    //>>> Render Flags
    this.showRadPoints = false;
    this.showRadCircle = false;
    this.showRadLines  = true;

    //>>> Stoke Weight Settings
    this.doRandStrkWgt  = true;
    this.strkWgtBounds  = [1,6];

    //>>> For Perlin Noise
    this.usePerlNoise   = true;
    this.noiseScaleFac = 0.01; 
    this.noiseFramePer = 32768; // noise frame period
    this.noiseYOffDist = 16;

    //>>> Initialization (of config @ construction)
    this.generatePts();
  } // Ends Constructor 

  setParmAndRegen(parm, val){
    switch(parm){
      case "pts" : this.numPts = val; break;
      case "fac" : this.factor = val; break;
      default: console.log("Error: Unexpected Input ("+parm+", "+val+")"); return;
    }
    this.generatePts();
  } // Ends Function setParmAndRegen

  generatePts(){
    let deg = 0; 
    let degPerPt = 360/this.numPts;
    
    this.cPts.splice(0, this.cPts.length); 
    this.fPts.splice(0, this.fPts.length);

    for(let i=0; i<this.numPts; i++){this.cPts.push(this.getCirclePt(deg)); deg += degPerPt;}
    for(let i=1; i<this.numPts; i++){this.fPts.push(this.cPts[floor((this.factor*i)%this.numPts)]);}
  } // Ends Function generatePts

  getCirclePt(degree, degOff=180){
    return createVector(this.rad*cos(radians(degree+degOff)), this.rad*sin(radians(degree+degOff)));
  } // Ends Function getCirclePt

  getPerlNoise(i){
    return noise((frameCount%this.noiseFramePer)*this.noiseScaleFac,((frameCount+(i*this.noiseYOffDist))%this.noiseFramePer)*this.noiseScaleFac);
  } // Ends Function getPerlNoise

  setStrk(i){
    if (this.doRandStrkWgt){
      strokeWeight(lerp(this.strkWgtBounds[0], this.strkWgtBounds[1], (this.usePerlNoise) ? this.getPerlNoise(i) : random() ));
      stroke(int(lerp(120,255, (this.usePerlNoise) ? this.getPerlNoise(i) : random() )));
    }
  } // Ends Function setStrk

  render(){
    noFill(); strokeWeight(4); stroke(180); ellipseMode(CENTER);

    push();
      translate(this.pos.x,this.pos.y);
      // Draw Mult. Circle and Points (default: DONT DRAW {mostly for debug, and better viz exists for rad-circle})
      if(this.showRadCircle){ellipse(0,0,this.rad*2,this.rad*2);}
      if(this.showRadPoints){for(let i=0; i<this.numPts; i++){strokeWeight(this.ptRad*2); point(this.cPts[i].x, this.cPts[i].y);}}

      // Draw lines from CPoint to CPoint (default: DO DRAW! {is better rad-circle viz than aforementioned ellipse}) 
      if(this.showRadLines){
        this.setStrk(0); line(this.cPts[0].x, this.cPts[0].y, this.cPts[this.numPts-1].x, this.cPts[this.numPts-1].y);
        for(let i=1; i<this.numPts; i++){this.setStrk(i); line(this.cPts[i].x, this.cPts[i].y, this.cPts[i-1].x, this.cPts[i-1].y);}
      }

      // Draw lines from CPoint to corresp. FPoint (default: DO DRAW! {obviously...they're the focus of this viz!}) 
      for(let i=1; i<this.numPts; i++){
        this.setStrk(i); line(this.cPts[i].x, this.cPts[i].y, this.fPts[i-1].x, this.fPts[i-1].y);
      }
    pop();
  } // Ends Function render

} // Ends Class MultiplicationCircle