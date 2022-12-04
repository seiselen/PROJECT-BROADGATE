
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

  setRule(r){
    this.curRule = r;
    this.ruleFunc = this.rule[r];
    return this; // for constructor/method chaining
  }

  //     this.curHeur = (typeof(h)==='string'||h===undefined) ? this.heur[h] : [this.rule[h[0]],this.heur[h[1]]];
  setHeur(h){
    this.curHeur = h;
    this.heurFunc = (typeof(h)==='string'||h===undefined) ? this.heur[h] : [this.rule[h[0]],this.heur[h[1]]];
    return this; // for constructor/method chaining   
  }

  setRuleAndHeur(r,h){
    this.setRule(r).setHeur(h);
    return this; // for constructor/method chaining   
  }

  initImage(){
    this.img = createImage(this.dim,this.dim);
    this.img.loadPixels();  
    for (let r=0;r<this.dim;r++){
      for(let c=0;c<this.dim;c++){
        this.img.set(c,r,ColorMap.PURPLE);
      }
    }
    this.img.updatePixels();
  }

  initRulesAndHeurs(){
    this.initRules();
    this.initHeurs()
  }

  initRules(){
    this.rule = {
      diag_cross : (r,c,h)=>{
        return color((1-(max(abs(this.dimH-c),abs(this.dimH-r))/this.dimH))*255);
      },
      perlin : (r,c,h)=>{
        return color(lerp(255,0,PerlinNoiseField.getValueAtCoord(r,c)));
      },
      // AKA [L2] NORM
      circle : (r,c,h)=>{
        let nDist = this.getNormPixelMidptDist(this.euclidPixelMidptDist(r,c));
        if(nDist>1){return ColorMap.BLACK;}
        return (h===undefined) ? ColorMap.WHITE : color(h(nDist));
      },
      // AKA [L1] NORM
      diamond : (r,c,h)=>{
        let nDist = this.getNormPixelMidptDist(this.manhatPixelMidptDist(r,c));
        if(nDist>1){return ColorMap.BLACK;}
        return (h===undefined) ? ColorMap.WHITE : color(h(nDist));
      },
      // AKA [L∞] NORM
      square : (r,c,h)=>{
        let nDist = this.getNormPixelMidptDist(this.maxvalPixelMidptDist(r,c));
        if(nDist>1){return ColorMap.BLACK;}
        return (h===undefined) ? ColorMap.WHITE : color(h(nDist));
      },
      wollongong : (r,c,h)=>{
        return this.rule.perlin(r,c)._array[0]<h[0](r,c,h[1])._array[0]
          ? ColorMap.WHITE 
          : ColorMap.BLACK;
      }
    }
  }

  initHeurs(){
    this.heur = {
      linear : (normDist)=>{return lerp(255,0,normDist);},
      biased : (normDist)=>{return lerp(255,0,WollongongBias.getBiasVal(normDist))}
    }
  }

  generate(){
    this.img.loadPixels(); 
    for (let r=0;r<this.dim;r++){
      for(let c=0;c<this.dim;c++){
        this.img.set(c,r,this.ruleFunc(r,c,this.heurFunc));
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

  euclidPixelMidptDist(r,c){
    return vectorEuclideanDist(this.pos,this.pixelCoordToImagePos(r,c));
  }

  manhatPixelMidptDist(r,c){
    return vectorManhattanDist(this.pos,this.pixelCoordToImagePos(r,c));
  }

  maxvalPixelMidptDist(r,c){
    return vectorMaxDimValDist(this.pos,this.pixelCoordToImagePos(r,c));
  }

  getNormPixelMidptDist(dist){
    return dist/this.dimH;
  }

  render(){
    noFill(); stroke(255); strokeWeight(4); rect(this.pos.x,this.pos.y,this.dim,this.dim);
    image(this.img,this.pos.x,this.pos.y);
  }

}