
class ShaderImage{

  constructor(posX,posY){
    this.setSize(imageDim.dim);
    this.setPosition(posX,posY);
    this.initImage();
  }
  
  setSize(dim){
    this.dim  = dim;
    this.dimH = this.dim/2;
  }
  
  setPosition(x,y){
    this.pos  = vec2(x,y);
    this.posH = p5.Vector.mult(this.pos,0.5);
    this.extL = this.pos.x-this.dimH;
    this.extR = this.pos.x+this.dimH;
    this.extT = this.pos.y-this.dimH;
    this.extB = this.pos.y+this.dimH;
    return this;
  }

  initImage(){
    this.img = createImage(this.dim,this.dim);
    this.img.loadPixels();  
    for (let r=0;r<this.dim;r++){for(let c=0;c<this.dim;c++){this.img.set(c,r,ColorMap.PURPLE);}}
    this.img.updatePixels();
  }

  generate(ruleF){
    this.img.loadPixels(); console.clear();
    for (let r=0;r<this.dim;r++){for(let c=0;c<this.dim;c++){this.img.set(c,r,ruleF(r,c,this));}}
    this.img.updatePixels();
    return this;
  }

  mouseOverMe(){
    return (mouseX>this.extL)&&(mouseX<this.extR)&&(mouseY>this.extT)&&(mouseY<this.extB);
  }

  getPixel(r,c){
    return this.img.get(c,r)[0];
  }


  pixelCoordToImagePos(r,c){
    return vec2((this.pos.x-this.dimH)+c,(this.pos.y-this.dimH)+r);
  }

  euclidPixelMidptDist(r,c){return p5.Vector.dist(this.pos,this.pixelCoordToImagePos(r,c));}

  manhatPixelMidptDist(r,c){
    let [x,y] = this.pixelCoordToImagePos(r,c);
    return distManh(x,y,this.pos.x,this.pos.y);
  }


  pixelMidPtDistNorm(dist){
    return this.pixelDistFromMidPt(r,c)/this.dimH;
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

function rule_circle_biased(row,col,img){
  return rule_circle(row,col,img,(pct)=>{return(lerp(255,0,WBias.getBiasVal(pct)));});
}

function rule_circle(r,c,i,h){
  let ptsNormDist = i.pixelPctFromMidPt(r,c);
  if(ptsNormDist>1){return color(0);}
  return color(h(ptsNormDist));
}


function rule_square(r,c,i,h){
  let ptsNormDist = i.pixelPctFromMidPt(r,c);
  if(ptsNormDist>1){return color(0);}
  return color(h(ptsNormDist));
}


function rule_perlin_field(row,col,img){
  let noiseVal = PNoise.getVal(row,col);
  return color(lerp(255,0,noiseVal));
}

// (perlin_field(r,c) < circle_biased(r,c)) ? BLACK : WHITE
// i.e. filled if perlin value less than biased <XOR> voidous otherwise
// and yeah I'll be globally addressing them, oh well... KISS after all!
function rule_wollon_blend(r,c){
  return imgPerlinNoise.getPixel(r,c)<imgWollongBias.getPixel(r,c)
    ? ColorMap.WHITE 
    : ColorMap.BLACK;
}