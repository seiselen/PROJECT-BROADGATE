/*
ALGORITHM FOR PERLIN SAMPLING OF ELEV VALS WITHIN VORONOI CELLS:
  > Query-Get all the verts of the poly; which you already (know how to) do.
  > Compute {minX, minY, maxX, maxY} AABB via the verts; which you know how to do.
  > Write randomPtInBoundBox(pX,pY,qX,qY){return vec2(int(random(pX,qX)), int(random(pY,qY)))}
  > Pass values returned therefrom into your "isInPolygon" function xor that of the Voronoi lib.
  > Set a sentinel threshold on `numTries` to get a point within the polygon (512 should do it?)
  > Run it as many times as needed per the LOD and/or scale of the Perlin field
  > Speaking of Perlin-based elevations: mapping options of its [0,1] output:
    o Linear with [elevMIN,elevMAX] s.t. absdist(elevMIN) much less than absdist(elevMAX)
      * this should effect "have some shallow underwater areas but overall bias above water level"
      * ideas for [elevMIN,elevMAX] in feet: [0,1] => {[-60,320], [-12,240], [-12,96], etc.}
    o Logarithmic/Easing: meh... KISS for now
*/

import { falsy } from "../utils.mjs";
import EisBBox from "./EisBBox.mjs";

const CONSTRAIN_NOISE_SCALE = false;

class PerlinNoiseField {

  /** @type {EisBBox} */
  bbox;

  /**
   * 
   * @param {EisBBox} bbox
   * @param {number}  inNoiseScale input noise scale
   * @param {boolean} genImgOnStart create image at initialization? (default=`true`)
   */
  constructor(in_bbox,inNoiseScale,genImgOnStart=true){
    this.bbox       = in_bbox;
    this.noiseBound = {min:0.005,max:0.03,step:0.001};
    this.noiseScale = this.constrainNoiseScale(inNoiseScale??0.02);
    this.posOffsetX = 516;
    this.posOffsetY = 516;
    this.curImage   = null;
    if(genImgOnStart){this.generateImage()}
  }

  setPosOffset(newX,newY){
    this.posOffsetX = newX;
    this.posOffsetY = newY;
    console.log(`> New Position Offsets: (${this.posOffsetX},${this.posOffsetY})`);
  }

  setNoiseScale(newScale){
    this.noiseScale = this.constrainNoiseScale(newScale);
  }

  constrainNoiseScale(in_nscale){
    if(!CONSTRAIN_NOISE_SCALE){return in_nscale;}    
    return constrain(in_nscale,this.noiseBound.min,this.noiseBound.max)
  }

  scrambleOffsets(){
    let nowSeed = parseInt(`${Date.now()}`.slice(-5));
    let zipSeed = int(random(51631));
    this.setPosOffset(int(random(nowSeed,zipSeed)), int(random(nowSeed+zipSeed)));
    return this; // for function chaining (namely 'prime pump' call {AtInit})
  }

  getValueAtCoord(r,c){
    return noise((c+this.posOffsetX)*this.noiseScale,(r+this.posOffsetY)*this.noiseScale)
  }

  getColorAtCoord(r,c){
    return color(constrain(this.getValueAtCoord(r,c)*255,0,255));
  }

  getRandomColor(){
    return color(int(random(255)),int(random(255)),int(random(255)))
  }

  /** Syntactic sugar for calling {@link scrambleOffsets} followed by {@link generateImage} */
  generateNewImage(){
    this.scrambleOffsets();
    this.generateImage();
  }

  generateImage(){
    let [wide,tall] = this.bbox.getDimAsArray2();
    this.curImage = createImage(wide,tall);
    this.curImage.loadPixels();
    for (let r=0;r<tall;r++){for (let c=0;c<wide;c++){
      this.curImage.set(c,r, this.getColorAtCoord(r,c))
      //this.curImage.set(c,r, this.getRandomColor())      
    }}
    this.curImage.updatePixels();    
  }

  render(){
    this.renderImage()
  }

  renderImage(){
    if(falsy(this.curImage)){return;}
    image(this.curImage, this.bbox.pos.x, this.bbox.pos.y);
  }

}

export default PerlinNoiseField;