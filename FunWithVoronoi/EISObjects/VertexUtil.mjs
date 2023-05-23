//> Constraint bounds for vert dist. MIN is basically essential; MAX is more arbitrary but don't be stupid...
const MIN_VERT_DIST = 4;
const MAX_VERT_DIST = 32;

class VertexUtil{
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


  setNumDesiredVerts(in_nVerts){this.nVerts = in_nVerts}

  setMinDesiredDist(in_desDist){this.minVertD = constrain(in_desDist,MIN_VERT_DIST,MAX_VERT_DIST)}


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
    let mVec = mousePtToVec();

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

} // Ends Class VertexUtil

export default VertexUtil;