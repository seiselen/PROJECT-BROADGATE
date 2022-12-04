


class WollongongImage{
  // Good 'Ol Error Color
  static PURPLE = "#FF00FF";


  constructor(posX,posY,size){
    this.setSize(size);
    this.setPosition(posX,posY);
    this.initRules();
    this.initImages();
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
    return this; // for constructor/method chaining
  }

  initImages(){
    this.image_TShape = this.initImage();
    this.image_PField = this.initImage();
    this.image_WBlend = this.initImage();
  }

  initImage(){
    let retImg = createImage(this.dim,this.dim);
    retImg.loadPixels();  
    for (let r=0;r<this.dim;r++){for(let c=0;c<this.dim;c++){
      retImg.set(c,r,WollongongImage.PURPLE);
    }}
    retImg.updatePixels();
    return retImg;
  }

  initRules(){
    this.rule = {
      diag_cross : (r,c)=>{
        return (1-(max(abs(this.dimH-c),abs(this.dimH-r))/this.dimH))*255;
      },
      perlin : (r,c)=>{
        return lerp(255,0,PerlinNoiseField.getValueAtCoord(r,c));
      },
      // AKA [L2] NORM
      circle : (r,c)=>{
        let nDist = this.getNormPixelMidptDist(this.euclidPixelMidptDist(r,c));
        return (nDist>1) ? 0 : WollongongBias.getBiasFromNormDist(nDist);
      },
      // AKA [L1] NORM
      diamond : (r,c)=>{
        let nDist = this.getNormPixelMidptDist(this.manhatPixelMidptDist(r,c));
        return (nDist>1) ? 0 : WollongongBias.getBiasFromNormDist(nDist);
      },
      // AKA [L∞] NORM
      square : (r,c)=>{
        let nDist = this.getNormPixelMidptDist(this.maxvalPixelMidptDist(r,c));
        return (nDist>1) ? 0 : WollongongBias.getBiasFromNormDist(nDist);
      },
      wollongong : (pxTShape,pxPField)=>{
        return (pxTShape<pxPField) ? 0 : 255;
      }
    }
  }

  generate(){
    let [tVals,pVals,wVals] = this.generateValues();
    this.generateImage('tShape',tVals);
    this.generateImage('pField',pVals);    
    this.generateImage('wBlend',wVals);
    return this; // for constructor/method chaining
  }

  generateValues(){
    let tValArr = []; let pValArr = []; let wValArr = [];
    let tValRow,pValRow,wValRow,tCurVal,pCurVal,wCurVal;
    for (let r=0;r<this.dim;r++){
      tValRow = []; pValRow = []; wValRow = [];      
      for(let c=0;c<this.dim;c++){
        tCurVal = this.rule[this.curRule](r,c);
        pCurVal = this.rule.perlin(r,c);
        wCurVal = this.rule.wollongong(tCurVal,pCurVal);
        tValRow.push(tCurVal); pValRow.push(pCurVal); wValRow.push(wCurVal);
      }
      tValArr.push(tValRow); pValArr.push(pValRow); wValArr.push(wValRow);
    }
    return [tValArr,pValArr,wValArr];
  }

  generateImage(imgID,imgVals){
    let targetImg;
    switch(imgID){
      case 'tShape': targetImg = this.image_TShape; break;
      case 'pField': targetImg = this.image_PField; break;
      case 'wBlend': targetImg = this.image_WBlend; break;
      default: console.error(`Error! Invalid Image ID = [${imgID}]`); return;
    }

    targetImg.loadPixels(); 
    for (let r=0;r<this.dim;r++){for(let c=0;c<this.dim;c++){
      targetImg.set(c,r,color(imgVals[r][c]));
    }}

    targetImg.updatePixels();
  }


  flood_fill(){


  }



  mouseOverMe(){
    return (mouseX>this.extL)&&(mouseX<this.extR)&&(mouseY>this.extT)&&(mouseY<this.extB);
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

  //> Only render Blended Image. img compare slider will render the other two.
  render(){
    noFill(); stroke(255); strokeWeight(4); rect(this.pos.x,this.pos.y,this.dim,this.dim);
    image(this.image_WBlend,this.pos.x,this.pos.y);
  }

}