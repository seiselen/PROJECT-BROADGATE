/*----------------------------------------------------------------------
|>>> Class CanvDispUtil
+---------------------------------------------------------------------*/
class CanvUtil{
  constructor(cWide,cTall){
    this.tform = {tall:cTall, tallHf:cTall/2, wide:cWide, wideHf:cWide/2};

    this.ttDim = {tall:24, wide:108};

    this.colBD  = color(60);
    this.colCH  = color(255,60,0,64);
    this.colGD  = color(64,32);
    this.dimGD  = 10;



    this.displ  = {BD:true, CH:false, GR:false};
  } // Ends Constructor

  toggle_dispBorder(){this.displ.BD = !this.displ.BD;}
  toggle_dispCrossH(){this.displ.CH = !this.displ.CH;}
  toggle_dispGrid()  {this.displ.GR = !this.displ.GR;}


  drawCursor(){
    if(CanvUtil.mouseInCanvas()){
      noFill(); stroke(0,12,24,128); strokeWeight(2); 
      ellipse(mouseX, mouseY,12,12);
      line(mouseX-4,mouseY,mouseX-8,mouseY); line(mouseX+4,mouseY,mouseX+8,mouseY);
      line(mouseX,mouseY-4,mouseX,mouseY-8); line(mouseX,mouseY+4,mouseX,mouseY+8);
    }
  } // Ends Function drawCursor


  drawMousePosTooltip(){
    if(CanvUtil.mouseInCanvas()){
      let x1 = (mouseX+this.ttDim.wide>width) ? mouseX-this.ttDim.wide : mouseX;
      let y1 = (mouseY+this.ttDim.tall>height) ? mouseY-this.ttDim.tall : mouseY;
      let xOff = mouseX;
      let yOff = mouseY;
      switch(x1==mouseX){case true: xOff+=6; textAlign(LEFT); break; case false: xOff-=6; textAlign(RIGHT);}
      switch(y1==mouseY){case true: yOff+=12; break; case false: yOff-=12;}
      textSize(18); stroke(0); strokeWeight(4); fill(255);
      text("("+mouseX+","+mouseY+")",xOff,yOff);
    }
  } // Ends Function drawMousePosTooltip




  render(){
    (this.displ.BD) ? this.renderBorder(this.tform) : false;
    (this.displ.GR) ? this.renderGrid(this.tform) : false;
    (this.displ.CH) ? this.renderCHair(this.tform) : false;   
  }

  renderBorder(tf){stroke(this.colBD); strokeWeight(4); noFill(); rect(0,0,tf.wide,tf.tall);}
  renderCHair(tf){stroke(this.colCH); strokeWeight(2); line(0,tf.tallHf,tf.wide,tf.tallHf); line(tf.wideHf,0,tf.wideHf,tf.tall);}
  renderGrid(tf){stroke(this.colGD); strokeWeight(1); let i=0; for(i=0; i<tf.tall/this.dimGD; i++){line(0,this.dimGD*i,tf.wide,this.dimGD*i);} for(i=0; i<tf.wide/this.dimGD; i++){line(this.dimGD*i,0,this.dimGD*i,tf.tall);}}

  static drawFPSSimple(blurb="FPS: "){textSize(18); textAlign(LEFT,CENTER); strokeWeight(1); stroke(60); fill(60);text(blurb+round(frameRate()), 10, height-15);}
  static mouseInCanvas(){return (mouseX > 0) && (mouseY > 0) && (mouseX < width) && (mouseY < height);}
  static mousePtToVec(){return createVector(mouseX, mouseY);}

} // Ends Class CanvDispUtil 



/*----------------------------------------------------------------------
|>>> Class VertDispUtil
+---------------------------------------------------------------------*/
class VertUtil{
  // Creates set of random points wherein each must be min dist from neighbors. Brute Force, I know. But KISS and ABC
  static createVertSetMinDist(bounds, nVerts, minDist){
    let nTries   = 10;
    let maxTries = nTries*nVerts; 
    let curTries = 0;
    let verts    = []; 
    let buff     = createVector(-1,-1);
    let isValid  = false;

    verts.push(VertUtil.randPtInBounds(bounds)); // 'primes the pump'

    while(verts.length<nVerts && curTries<maxTries){
      isValid = true;
      buff = VertUtil.randPtInBounds(bounds);
      verts.forEach((v) => {isValid = (isValid&&(v.dist(buff)>=minDist));});
      switch(isValid){case true: verts.push(buff); break; case false: curTries++; break;}
    }
    if(curTries>=maxTries){console.log(">>> Warning: maxTries ["+maxTries+"] encountered! Returning set size of ["+verts.length+"]");}
    else{console.log(">>> FYI: Number of tries needed was ["+curTries+"/"+maxTries+"]")}

    return verts;
  } // Ends Function createVertSetMinDist

  static randPtInBounds(bounds){return createVector(round(random(bounds.minX,bounds.maxX)),round(random(bounds.minY,bounds.maxY)));}
  static vertListToSitesList(vertList){var ret = []; vertList.forEach((v)=> ret.push({x: v.x, y: v.y})); return ret;}

  static createVertListFromSiteList(sites){
    let list = [];
    sites.forEach((site)=>list.push(createVector(site.x,site.y)));
    return list;
  }


  static renderVerts(verts,diam=8){fill(60); noStroke(); verts.forEach((v) => ellipse(v.x,v.y,diam,diam));}
} // Ends Class VertUtil



/*----------------------------------------------------------------------
|>>> Class BBox
+---------------------------------------------------------------------*/
class BBox{
  constructor(x1,y1,x2,y2){
    this.pos = createVector(x1,y1);
    this.ept = createVector(x2,y2);
    this.dim = createVector(x2-x1,y2-y1);
    this.mpt = createVector(this.pos.x+(this.dim.x/2),this.pos.y+(this.dim.y/2));
    this.initVFXSettings();
  } // Ends Constructor

  initVFXSettings(){
    this.strkCol = color(0,60,240,128);
    this.fillCol = color(0,60,240,64);
    this.strkWgt = 2;
    this.CHLenHf = min(this.dim.x,this.dim.y)/8;
  } // Ends Function initVFXSettings

  // Key Encoding needed for VertUtil and Voronoi code, respectively.
  getBoundsPC(){return {minX: this.pos.x, maxX: this.ept.x, minY: this.pos.y, maxY: this.ept.y};}
  getBoundsVD(){return {xl: this.pos.x, xr: this.ept.x, yt: this.pos.y, yb: this.ept.y};}

  inBounds(x,y){return (x>=this.pos.x && x<=this.ept.x && y>=this.pos.y && y<=this.ept.y);}

  render(){
    //this.renderBorderAndBG();
    this.renderBorderOnly();
    //this.renderCrosshair();
  } // Ends Function render

  renderBorderAndBG(){strokeWeight(this.strkWgt); stroke(this.strkCol); fill(this.fillCol); rect(this.pos.x,this.pos.y,this.dim.x, this.dim.y);}
  renderBorderOnly(){strokeWeight(this.strkWgt); stroke(this.strkCol); noFill(); rect(this.pos.x,this.pos.y,this.dim.x, this.dim.y);}
  renderCrosshair(){line(this.mpt.x,this.mpt.y-this.CHLenHf,this.mpt.x,this.mpt.y+this.CHLenHf); line(this.mpt.x-this.CHLenHf,this.mpt.y,this.mpt.x+this.CHLenHf,this.mpt.y);}
} // Ends Class BBox