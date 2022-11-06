/*======================================================================
|> Class GridSoftBody
+-----------------------------------------------------------------------
|# Object State Descriptions:
|   > vertRows → number of vertex rows composing this grid softbody
|   > vertCols → number of vertex columns composing this grid softbody
|   > edgeDist → edge Distance between vertices (i.e. links NOT diag)
|   > diagDist → (sqrt(2)*edgeDist) via 45° unit edge right triangle
|   > vertices → list of vertices, 'Nuff Said
|   > springs  → list of springs (connecting vertices), 'Nuff Said
+=====================================================================*/
class GridSoftBody{
  /**
   * @desc Creates a new Grid Softbody
   * @param {number} vR number of vertex rows
   * @param {number} vC number of vertex cols s.t. `-1` → `vR` → square
   * @param {number} vE edge dist between verts s.t. diag = `vE*sqrt(2)`
   */
  constructor(vR,vC,vE){
    this.vertRows = vR;
    this.vertCols = (vC==-1) ? this.vertRows : vC;
    this.edgeDist = vE;
    this.diagDist = this.edgeDist*sqrt(2);
    this.vertices = []; // Physics Vertices
    this.springs  = []; // Vertex Springs
    this.initStructure();
  }

  initStructure(){
    this.initVertices();
    this.initSprings();
  }

  initVertices(){
    let [i,rs,cs] = [0,this.vertRows,this.vertCols];
    for (let r=0; r<rs; r++){for (let c=0; c<cs; c++){
      this.vertices.push(
        new PhxVertex(vec2(c+1,r+1).mult(this.edgeDist))
        .setID(i++)
        .setExpAdjDist(this.edgeDist)
        .setOfficialNeighbors(this.getNeighborIDsByCoord(r,c))
      );
    }}
    
    this.vertices.forEach(v=>{
      let adjIDs = v.designAdjs;
      v.setOfficialNeighbors(adjIDs.map(coord=>this.getVertexByCoord(...coord)));
    })
    
  }

  initSprings(){
    let [rs,cs] = [this.vertRows,this.vertCols];
    for (let r=0; r<rs; r++){for (let c=0; c<cs; c++){
      if(r<rs-1){this.createSpring(r,c,r+1,c);} // edge (vertical)
      if(c<cs-1){this.createSpring(r,c,r,c+1);} // edge (horizontal)
      if(r<rs-1&&c<cs-1){this.createXSpring(r,c,true);} // diag (cross)
    }}   
  }  
  
  /**
   * @desc Creates PhxSpring (Physics Spring) between 2 vertices
   * @param {number} r1 vertex #1 row
   * @param {number} c1 vertex #1 col
   * @param {number} r2 vertex #2 row
   * @param {number} c2 vertex #2 col
   * @param {boolean} diag diagonal WRT `{pV,qV}`? (default → `false`)
   */
  createSpring(r1,c1,r2,c2,diag=false){
    this.springs.push(new PhxSpring(
      this.vertices[(r1*this.vertCols)+c1],
      this.vertices[((r2)*this.vertCols)+c2],
      this.#distViaDiagVal(diag),
      sp_stiffVal,
      sp_dampVal
    ));    
  }
  
  createXSpring(r,c,diag=false){
    this.createSpring(r,c,r+1,c+1,diag);
    this.createSpring(r+1,c,r,c+1,diag);
  }

  
  #distViaDiagVal(d){
    return (d) ? this.diagDist : this.edgeDist;
  }


  isValidCoord(row,col){
    return row>=0&&col>=0&&row<this.vertRows&&col<this.vertCols;
  }


  coordToID(row,col){
    return (row*this.vertCols)+col;
  }

  IDToCoord(id){
    let row = floor(id/this.vertCols);
    let col = id%this.vertCols;
    return [row,col];
  }


  getVertexByCoord(row,col){
    return this.vertices[(row*this.vertCols)+col];
  }

  getVertexByID(id){
    // return this.vertices.filter(v=>v.ID==id)[0]; // that's one way to do it...
    return this.getVertexByCoord(...this.IDToCoord(id)); // ...and here's another!
  }



  getNeighborIDsByCoord(row,col){
    let adjIDs = [];
    for (let r=row-1; r<=row+1; r++){for (let c=col-1; c<=col+1; c++){
      if(this.isValidCoord(r,c)&&(r!=row||c!=col)){adjIDs.push([r,c]);}
    }}
    return adjIDs;
  }



  //> NOTE: EXPECTS [<char>,<float>] input encompassing [dir,mag]
  update(extForce){
    this.vertices.forEach(v => v.applyForceViaDir(extForce.dir,extForce.mag));
    this.vertices.forEach(v => v.update());
    this.springs.forEach(s => s.update2());    
  }

  /*> NOTE: THIS IS NOW LINE #1 OF 'update' BUT KEEPING FOR NOW JIC
  function applyGravity(){
    vertices.forEach(v => v.applyForceViaDir('d',gForce));
  }
  */



  onMousePressed(){
    if(mouseInCanvas() && mouseButton === LEFT){
      this.vertices.forEach(v => v.onMousePressed(mousePtToVec()));
    }
  }
  
  onMouseReleased(){
    this.vertices.forEach(v => v.onMouseRelease());
  }
  
  onMouseDragged(){
    if(mouseInCanvas() && mouseButton === LEFT){
      this.vertices.forEach(v => v.onMouseDragged(mousePtToVec()));
    }
  } 



  render(){
    this.springs.forEach(s => s.render());    
    this.vertices.forEach(v => v.render());
  }

}