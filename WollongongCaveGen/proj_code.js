
class ShaderImage{

  constructor(posX,posY){
    this.setSize(imageDim.dim);
    this.setPosition(posX,posY);
    this.initRulesAndHeurs();
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

  setRule(r,h){
    this.curRule = this.rule[r];
    this.curHeur = this.heur[h];
    return this; // for constructor/method chaining
  }

  initImage(){
    this.img = createImage(this.dim,this.dim);
    this.img.loadPixels();  
    for (let r=0;r<this.dim;r++){for(let c=0;c<this.dim;c++){this.img.set(c,r,ColorMap.PURPLE);}}
    this.img.updatePixels();
  }

  initRulesAndHeurs(){
    this.initRules();this.initHeurs()
  }

  initRules(){
    this.rule = {
      diag_cross : (r,c,h)=>{
        return color((1-(max(abs(this.dimH-c),abs(this.dimH-r))/this.dimH))*255);
      },

      perlin : (r,c,h)=>{
        return color(lerp(255,0,PNoise.getVal(r,c)));
      },

      circle : (r,c,h)=>{
        let nDist = this.getNormPixelMidptDist(this.euclidPixelMidptDist(r,c));
        if(nDist>1){return ColorMap.BLACK;}
        return (h===undefined) ? ColorMap.WHITE : color(h(nDist));
      },

      square : (r,c,h)=>{
        let nDist = this.getNormPixelMidptDist(this.manhatPixelMidptDist(r,c));
        if(nDist>1){return ColorMap.BLACK;}
        return (h===undefined) ? ColorMap.WHITE : color(h(nDist));
      },

      wollongong : (r,c,h)=>{
        return this.rule.perlin(r,c)<this.rule.circle(r,c,this.heur.biased)
          ? ColorMap.WHITE 
          : ColorMap.BLACK;
      }
    }
  }

  initHeurs(){
    this.heur = {
      linear : (normDist)=>{return lerp(255,0,normDist);},
      biased : (normDist)=>{return lerp(255,0,WBias.getBiasVal(normDist))}
    }
  }

  generate(){
    this.img.loadPixels(); 
    console.clear();
    for (let r=0;r<this.dim;r++){
      for(let c=0;c<this.dim;c++){
        this.img.set(c,r,this.curRule(r,c,this.curHeur));
      }
    }
    this.img.updatePixels();
    return this; // for constructor/method chaining
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

  euclidPixelMidptDist(r,c){return vectorEuclideanDist(this.pos,this.pixelCoordToImagePos(r,c));}
  manhatPixelMidptDist(r,c){return vectorManhattanDist(this.pos,this.pixelCoordToImagePos(r,c));}

  getNormPixelMidptDist(dist){return dist/this.dimH;}


  
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

