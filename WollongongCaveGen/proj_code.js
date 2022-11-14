
class ShaderImage{
  constructor(posX,posY){
    this.setPosition(posX,posY);
    this.setSize(imageDim.dim);
    this.initColorMap();
    this.initImage();
  }
  
  setPosition(x,y){
    this.pos  = vec2(x,y);
    this.posH = p5.Vector.mult(this.pos,0.5);
    return this;
  }

  setSize(dim){
    this.dim  = dim;
    this.dimH = this.dim/2;
  }

  initColorMap(){
    this.colormap = {
      PURPLE: color(255,0,255),
    }
  }

  initImage(){
    this.img = createImage(this.dim,this.dim);
    this.img.loadPixels();  
    for (let r=0;r<this.dim;r++){for(let c=0;c<this.dim;c++){this.img.set(c,r,this.colormap.PURPLE);}}
    this.img.updatePixels();
  }

  generate(ruleF){
    this.img.loadPixels(); console.clear();
    for (let r=0;r<this.dim;r++){for(let c=0;c<this.dim;c++){this.img.set(c,r,ruleF(r,c,this));}}
    this.img.updatePixels();
    return this;
  }

  pixelCoordToImagePos(r,c){
    return [(this.pos.x-this.dimH)+c,(this.pos.y-this.dimH)+r];
  }

  pixelDistFromMidPt(r,c){
    let [x,y] = this.pixelCoordToImagePos(r,c);
    return dist(x,y,this.pos.x,this.pos.y);
  }

  pixelPctFromMidPt(r,c){
    return this.pixelDistFromMidPt(r,c)/this.dimH;
  }

  mousePosToPixelCoord(){
    return [mouseY-this.pos.y+this.dimH,mouseX-this.pos.x+this.dimH];
  }
  
  render(){
    image(this.img,this.pos.x,this.pos.y);
  }

}


//======================================================================
//>>> WOLLONGONG BIAS DEFNITION
//======================================================================

// Wollongong Bias Function: {f(x)=x^(ln(b)/ln(0.5)) | x∋[0≤x≤1] ∧ b∋[0≤b=.05≤0.5]}
// ↑ Desmos [Ctrl]+[V] Expr: y=x^{\frac{\ln\left(0.05\right)}{\ln\left(0.5\right)}}
var WBias = {
  refBiasVal : .05,
  curBiasVal : 0,
  biasIntrvl : [0,0.5],
  lnHalfEval : -1,
  curExpoVal : -1,
  init       : (b)=>{WBias.lnHalfEval=log(0.5);if(b===undefined){b=WBias.refBiasVal;}WBias.setBiasVal(b);},
  setBiasVal : (b)=>{WBias.curBiasVal=constrain(b,...WBias.biasIntrvl);WBias.setExpoVal();},
  setExpoVal : ()=>{WBias.curExpoVal=log(WBias.curBiasVal)/WBias.lnHalfEval;},
  getBiasVal : (x)=>{return pow(constrain(x,0,1),WBias.curExpoVal);}
}

//======================================================================
//>>> RULE DEFINITIONS
//======================================================================
function rule_diagCross(r,c){
  return color((1-(max(abs(imageDim.dimH-c),abs(imageDim.dimH-r))/imageDim.dimH))*255);
}

function rule_circle_linear(row,col,img){
  return rule_circle(row,col,img,(pct)=>{return lerp(255,0,pct);})
}

function rule_circle_perlin(row,col,img){
  return rule_circle(row,col,img,(pct)=>{return(lerp(255,0,WBias.getBiasVal(pct)));});
}

function rule_circle(r,c,i,h){
  let ptsNormDist = i.pixelPctFromMidPt(r,c);
  if(ptsNormDist>1){return color(0);}
  return color(h(ptsNormDist));
}


function rule_perlin_field(row,col,img){
  let noiseVal = PNoise.getVal(row,col);
  return color(lerp(255,0,noiseVal));
}
