/*----------------------------------------------------------------------
|>>> Util Object InstructionsPopUp
+---------------------------------------------------------------------*/
var InstructionsPopUp = {
  blurb : [
    "⯈ <strong>VD: [V]oronoi [D]iagram</strong>, duh... ;-)",
    "⯈ <strong>Bounding Rect</strong>: Rectangle border 'containing' VD. Should appear as having transparent blue background.",
    "",
    "⯈ <strong>[Mouse Down]</strong> If mouse is over an existing vertex: 'implicitly' selects it.",
    "⯈ <strong>[Mouse Drag]</strong> If vertex is currently selected: moves it WRT mouse position and Bounding Rect.",    
    "⯈ <strong>[Mouse Release]</strong> If vertex currently selected: immediately de-selects it i.e. 'drops it in place'.",
    "⯈ <strong>[Mouse Click]</strong> If within Bounding Rect and NOT too close to existing vertices: creates new vertex.",
    "⯈ <strong>[Mouse Release]</strong> If vertex is moved OUTSIDE Bounding Rect: removes it (note: CANNOT be undone!)",
    "⯈ <strong>[Keypress 'm']</strong> Does one round of 'Min. Bound. Rect. Smoothing' (makes VD cells more uniform).",
    "⯈ <strong>[Keypress 'r']</strong> Resets vertices to new random positions, then regenerates a mew VD thereupon.",    
    "⯈ <strong>[Keypress 'g']</strong> Toggles a basic grid."
  ],

  blurbString(lineSep='\n'){return InstructionsPopUp.blurb.map(str=>`<p>${str}</p>`).join(lineSep);},
  injectText(){document.getElementById("instructDOM").innerHTML = InstructionsPopUp.blurbString(' ');},
}

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
      let mVec = CanvUtil.mousePtToVec();
      noFill(); stroke(0,12,24,128); strokeWeight(2); 
      ellipse(mVec.x, mVec.y,12,12);
      line(mVec.x-4,mVec.y,mVec.x-8,mVec.y); line(mVec.x+4,mVec.y,mVec.x+8,mVec.y);
      line(mVec.x,mVec.y-4,mVec.x,mVec.y-8); line(mVec.x,mVec.y+4,mVec.x,mVec.y+8);
    }
  } // Ends Function drawCursor


  drawMousePosTooltip(){
    if(CanvUtil.mouseInCanvas()){
      let mVec = CanvUtil.mousePtToVec();      
      let x1 = (mVec.x+this.ttDim.wide>width) ? mVec.x-this.ttDim.wide : mVec.x;
      let y1 = (mVec.y+this.ttDim.tall>height) ? mVec.y-this.ttDim.tall : mVec.y;
      let xOff = mVec.x;
      let yOff = mVec.y;
      switch(x1==mVec.x){case true: xOff+=6; textAlign(LEFT); break; case false: xOff-=6; textAlign(RIGHT);}
      switch(y1==mVec.y){case true: yOff+=12; break; case false: yOff-=12;}
      textSize(18); stroke(0); strokeWeight(4); fill(255);
      text("("+mVec.x+","+mVec.y+")",xOff,yOff);
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
  renderFPSSimple(blurb="FPS: "){textSize(18); textAlign(LEFT,CENTER); strokeWeight(1); stroke(this.colBD); fill(this.colBD); text(blurb+round(frameRate()), 10, height-15);}
  renderNumVerts(blurb="# Verts: "){textSize(18); textAlign(LEFT,CENTER); strokeWeight(1); stroke(this.colBD); fill(this.colBD); text(blurb+round(voronoi.vertUtil.getNumVerts()), 120, height-15);}

  static mouseInCanvas(){return (mouseX > 0) && (mouseY > 0) && (mouseX < width) && (mouseY < height);}
  static mousePtToVec(){return createVector(round(mouseX), round(mouseY));}

} // Ends Class CanvDispUtil 



/*----------------------------------------------------------------------
|>>> Class VertUtil
+---------------------------------------------------------------------*/
class VertUtil{
  constructor(bbox, nVerts, minDist){
    this.bbox     = bbox;
    this.bounds   = this.bbox.getBoundsPC();
    this.nVerts   = nVerts;
    this.minVertD = minDist;
    this.nTries   = 10;
    this.maxTries = this.nTries*this.nVerts;
    this.vertices = this.createVertSetMinDist();

    this.canAddVs = true;
    this.canRemVs = true;

    this.selVert  = null;
    this.selVtID  = -1; // to avoid O(n) search for index of selVert when removing

    this.fill_pts = color(240,128,0);
    this.diam_pts = 6;
  }

  // Creates set of random points wherein each must be min dist from neighbors. Brute Force, I know. But KISS and ABC
  createVertSetMinDist(){
    let curTries = 0;
    let verts    = []; 
    let buff     = createVector(-1,-1);
    let isValid  = false;

    verts.push(this.getRandVertInBounds()); // 'primes the pump'

    while(verts.length<this.nVerts && curTries<this.maxTries){
      isValid = true;
      buff = this.getRandVertInBounds();
      verts.forEach((v) => {isValid = (isValid&&(v.dist(buff)>=this.minVertD));});
      switch(isValid){case true: verts.push(buff); break; case false: curTries++; break;}
    }
    if(curTries>=this.maxTries){console.log(">>> Warning: maxTries ["+this.maxTries+"] encountered! Returning set size of ["+verts.length+"]");}
    //else{console.log(">>> FYI: Number of tries needed was ["+curTries+"/"+maxTries+"]")}
    return verts;
  } // Ends Function createVertSetMinDist

  resetVertSet(){
    this.clearVertList();
    this.vertices = this.createVertSetMinDist();
  }

  getRandVertInBounds(){
    return createVector(round(random(this.bounds.minX,this.bounds.maxX)),round(random(this.bounds.minY,this.bounds.maxY)));
  }

  getNumVerts(){
    return this.vertices.length;
  }

  vertListToSiteList(){
    let sites = []; 
    this.vertices.forEach((v)=> sites.push({x: v.x, y: v.y})); 
    return sites;
  }

  setVertListFromVDSiteList(sites){
    if(this.vertices.length != sites.length){console.log(">>> Error: vertices.length != sites.length, cancelling operation!"); return;}
    sites.forEach((site, i)=>this.vertices[i].set(site.x,site.y)); 
  }

  distLessThan(va,vb,dist){
    return ((vb.x-va.x) * (vb.x-va.x)) + ((vb.y-va.y) * (vb.y-va.y)) <= (dist*dist);
  }

  // being more strict for memory purposes JIC (too OCD???)
  clearVertList(){
    while(this.vertices.length > 0){this.vertices.pop();}
  }

  onMousePressed(){
    this.selVert = null; // clear selected point on mouse press in any case
    let mVec = CanvUtil.mousePtToVec();

    // If mouse in diam of any vert - that vert is now selected
    for(let i=0; i<this.vertices.length; i++){if(this.distLessThan(this.vertices[i],mVec,this.diam_pts)){
      this.selVert = this.vertices[i]; this.selVtID = i; return;
    }}

    // XOR If mouse vec in bbox bounds and not in min vert distance of any other vert - add mouse vec as new vert 
    if (this.canAddVs && this.bbox.inBounds(mVec.x,mVec.y)){
      let isValidLoc = true;
      for(let i=0; i<this.vertices.length; i++){if(this.distLessThan(this.vertices[i],mVec,this.minVertD)){isValidLoc=false; break;}}
      if(isValidLoc){this.vertices.push(mVec);}
    }
  }

  onMouseDragged(){
    if(this.selVert){this.selVert.set(mouseX,mouseY);}
  }

  onMouseReleased(){
    if(this.selVert){
      if(this.canRemVs && !this.bbox.inBounds(this.selVert.x,this.selVert.y)){this.vertices.splice(this.selVtID, 1);}
      this.selVert = null;
    }
  }

  renderVerts(){
    fill(this.fill_pts); stroke(0,128); strokeWeight(1); 
    this.vertices.forEach((v) => ellipse(v.x,v.y,this.diam_pts,this.diam_pts));
    if(this.selVert){fill(255,120,0);stroke(0);strokeWeight(1);ellipse(this.selVert.x,this.selVert.y,this.diam_pts,this.diam_pts)}
  }

} // Ends Class VertUtil



/*----------------------------------------------------------------------
|>>> Class BBox
+---------------------------------------------------------------------*/
class BBox{
  constructor(x1,y1,x2,y2){
    // t-form state
    this.pos = createVector(x1,y1);
    this.ept = createVector(x2,y2);
    this.dim = createVector(x2-x1,y2-y1);
    this.mpt = createVector(this.pos.x+(this.dim.x/2),this.pos.y+(this.dim.y/2));
    // vfx state
    this.strkCol = color(0,60,240,32);
    this.fillCol = color(0,60,240,32);
    this.strkWgt = 8;
    this.CHLenHf = min(this.dim.x,this.dim.y)/8;
  } // Ends Constructor

  getBoundsPC(){return {minX: this.pos.x, maxX: this.ept.x, minY: this.pos.y, maxY: this.ept.y};} // bounds encoding for Vert generator
  getBoundsVD(){return {xl: this.pos.x, xr: this.ept.x, yt: this.pos.y, yb: this.ept.y};} // bounds encoding for Voronoi generator
  inBounds(x,y){return (x>=this.pos.x && x<=this.ept.x && y>=this.pos.y && y<=this.ept.y);}

  renderBorderAndBG(){strokeWeight(this.strkWgt); stroke(this.strkCol); fill(this.fillCol); rect(this.pos.x,this.pos.y,this.dim.x, this.dim.y);}
  renderBorder(){strokeWeight(this.strkWgt); stroke(this.strkCol); noFill(); rect(this.pos.x,this.pos.y,this.dim.x, this.dim.y);}
  renderCrosshair(){line(this.mpt.x,this.mpt.y-this.CHLenHf,this.mpt.x,this.mpt.y+this.CHLenHf); line(this.mpt.x-this.CHLenHf,this.mpt.y,this.mpt.x+this.CHLenHf,this.mpt.y);}
} // Ends Class BBox