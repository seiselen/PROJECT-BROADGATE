

/*======================================================================
|>>> Class PolySurfaceTerrain
+-----------------------------------------------------------------------
| Description: <TBD>
+=====================================================================*/
class PolySurfaceTerrain{
  constructor(cT,cW){
    this.cellsTall  = cT;    
    this.cellsWide  = cW;

    //> Component GridTile dims (MUST call <setGTVals> for 'diameterGT' synch)
    this.numVertsGT = -1;
    this.dimVertsGT = -1;
    this.diameterGT = -1;

    this.parmValDB  = [];
    this.terrainMap = [];
    this.powDP      = null;

    this.setGTVals(9,16);
    this.initPowDP();
    this.initParmValDB();
    this.initTerrainMap();
  } // Ends Constructor


  setGTVals(nV,dV){
    this.numVertsGT = nV;
    this.dimVertsGT = dV;
    this.diameterGT = (this.numVertsGT-1)*this.dimVertsGT;    
  }


  // Another very cool use of Dynamic Programming, did not expect this!
  // different from one implemented for 'GridTile_NaivePoly' instances
  // due to additional handling for 'fact', but especially because ALL 
  // 'GridTile_TerrPoly' instances composing this 'PolySurfaceTerrain'
  // instance will SHARE this for further dynamic programming benefit.
  initPowDP(){
    this.powDP = {
      sansFactor : [{/*(b^2)*/},{/*(b^3)*/},],
      withFactor : [{/*(2b^3)*/},{/*(3b^2)*/},],
      /* Algorithm:
        > query 'this.withFactor' indexed on [powr], then keyed on [base]
        > if not there:
          > query 'this.sansFactor' indexed on [powr], then keyed on [base]
            > if not there: compute-and-store it
          > compute-and-store product of it with [fact]
        > retreive and return, 'Nuff Said
      */
      get : function(fact,base,powr){
        let idx = powr-2;
        if(this.withFactor[idx][base]==undefined){
          if(this.sansFactor[idx][base]==undefined){this.sansFactor[idx][base]=pow(base,powr);}
          this.withFactor[idx][base] = fact * this.sansFactor[idx][base];
        }
        return this.withFactor[idx][base];
      }
    };
  } // Ends Function initPowDP


  initParmValDB(){
    for (let r=0; r<=this.cellsTall; r++) {
      this.parmValDB[r]=[];
      for (let c=0; c<=this.cellsWide; c++) {
        this.parmValDB[r][c] = this.computeParmVal(r,c);
    }}
  } // Ends Function initParmValDB


  // via formula shown/discussed at ~[02:30] in video
  // could use any good noise/shuffle formula (even perlin - though would defeat the point lol)
  computeParmVal(i,j){
    let u = this.computeFactPart(i/PI)*50;
    let v = this.computeFactPart(j/PI)*50;
    return 2*this.computeFactPart(u*v*(u+v))-1;
  } // Ends Function computeParmVal


  computeFactPart(v){
    return v-int(v);
  } // Ends Function computeFactPart


  initTerrainMap(){
    for (let r=0; r<this.cellsTall; r++) {
      this.terrainMap[r]=[];
      for (let c=0; c<this.cellsWide; c++) {
        this.terrainMap[r][c] = this.createGridTile(r,c);
    }}    
  } // Ends Function initTerrainMap


  createGridTile(i,j){
    let a = this.parmValDB[i][j];
    let b = this.parmValDB[i][j+1];
    let c = this.parmValDB[i+1][j];
    let d = this.parmValDB[i+1][j+1];
    return new GridTile_TerrPoly(i,j,this.numVertsGT,this.numVertsGT,this.dimVertsGT,[a,b,c,d],this.powDP);
  } // Ends Function createGridTile


  render(){
    for (let r=0; r<this.cellsTall; r++) {
      for (let c=0; c<this.cellsWide; c++) {
        push();
        translate(this.diameterGT*c,0,this.diameterGT*r);
        this.terrainMap[r][c].renderGridPlanes();
        pop();
    }}      
  } // Ends Function render


} // Ends Class PolySurfaceTerrain



/*======================================================================
|>>> [Abstract] Class GridTile
+-----------------------------------------------------------------------
| Description: A GridTile functions as an [implicit] Abstract Class for 
|              its child types, providing common functionality thereto;
|              which in turn implement a 3D 'Vertex Grid' as supported
|              by P5JS and its WebGL assets. 
+=====================================================================*/
class GridTile{
  constructor(vX,vZ,vD){
    //> State
    this.vertsX    = vX;   // # of verts on X (aka SIDE aka RIGHT) axis
    this.vertsZ    = vZ;   // # of verts on Z (aka FORE aka FORWARD) axis
    this.vertDim   = vD;   // pixels between verts (i.e. WRT {X,Z} planar projection)
    this.gridVerts = [];   // p5Vector[vertsX][vertsY] encompassing terrain state
    //> UI/UX State
    this.vertVizDiam = 2;
    this.drawBlackVerts = true;
    //> Loaders and Inits
    this.generateGridVerts();
  } // Ends Constructor

  generateGridVerts(){
    for (let x=0; x<this.vertsX; x++) {
      this.gridVerts[x] = [];
      for (let z=0; z<this.vertsZ; z++) {
        this.gridVerts[x][z] = vec3(x*this.vertDim, 0, z*this.vertDim);
    }}
  } // Ends Function generateGridVerts


  //====================================================================
  //>>> RENDER FUNCTIONS
  //====================================================================

  renderVertBoxesAndPlanes(){
    this.renderGridVerts();
    this.renderGridPlanes();
  } // Ends Function renderVertBoxesAndPlanes

  renderGridVerts(){
    noStroke();
    for (let x=0; x<this.vertsX; x++) {
      for (let z=0; z<this.vertsZ; z++) {
        switch(this.drawBlackVerts){
          case true: fill(0,192); break;
          case false: this.setGridFill(x,z); break;
        }
        this.drawCube(this.gridVerts[x][z].x, this.gridVerts[x][z].y, this.gridVerts[x][z].z, this.vertVizDiam);
    }}
  } // Ends Function renderGridVerts


  renderGridPlanes(){
    noStroke();
    let xDist, yDist, zDist;
    let TL, TR, BL, BR;
    for (let x=1; x<this.vertsX; x++) {
      for (let z=1; z<this.vertsZ; z++) {
        this.setGridFill(x,z);
        this.drawQuad(this.gridVerts[x-1][z-1], this.gridVerts[x][z-1], this.gridVerts[x-1][z], this.gridVerts[x][z]);
    }}
  } // Ends Function renderGridVerts


  setGridFill(x,z){
    let xDist = x/this.vertsX;
    let zDist = z/this.vertsZ;
    let yDist = 1.0 - xDist - zDist;
    fill(lerp(0,255,xDist),lerp(0,255,yDist),lerp(0,255,zDist));
  } // Ends Function setGridFill


  drawQuad(TL, TR, BL, BR, LOD=2){
    quad(TL.x, TL.y, TL.z, TR.x, TR.y, TR.z, BR.x, BR.y, BR.z, BL.x, BL.y, BL.z, LOD, LOD);
  } // Ends Function drawQuad


  drawCube(xPos,yPos,zPos,dim){
    push(); translate(xPos,yPos,zPos); box(dim,dim,dim); pop();
  } // Ends Function drawCube


} // Ends Class GridTile




/*======================================================================
|>>> Class GridTile_TerrPoly
+-----------------------------------------------------------------------
| Description: <TBD>
+=====================================================================*/
class GridTile_TerrPoly extends GridTile{
  constructor(cI,cJ,vX,vZ,vD,pV,pDP){
    super(vX,vZ,vD);
    this.coordI   = cI;
    this.coordJ   = cJ;
    this.parmVals = pV;   // expects Array[4] of vals in order {a,b,c,d}
    this.powDP    = pDP;  // shared among ALL instances of same terrain
    this.height   = {min:-100,max:100};
    this.setVertElevations();
  } // Ends Constructor


  setVertElevations(){
    let curVert  = null;
    let curEval  = undefined;
    let maxVal   = -1;
    let minVal   = 1;

    for (let x=0; x<this.vertsX; x++) {
      for (let z=0; z<this.vertsZ; z++) {
        curVert = this.gridVerts[x][z];
        curEval = this.getElevPoly(x,z);
        maxVal  = max(maxVal,curEval);
        minVal  = min(minVal,curEval);
        curVert.set(curVert.x, curEval, curVert.z);
    }}

    for (let x=0; x<this.vertsX; x++) {
      for (let z=0; z<this.vertsZ; z++) {
        curVert = this.gridVerts[x][z];
        curEval = map(curVert.y, minVal, maxVal, this.height.min, this.height.max);
        curVert.set(curVert.x, curEval, curVert.z);
    }}
  } // Ends Function setVertElevations


  getElevPoly(x,z){
    let [a,b,c,d] = this.parmVals;
    let sxi = this.smoothstep(x-this.coordI);
    let szj = this.smoothstep(z-this.coordJ);
    return a +((b-a)*sxi)+((c-a)*szj)+((a-b-c+d)*sxi*szj);
  } // Ends Function getElevPoly


  smoothstep(v){
    return this.powDP.get(3,v,2) - this.powDP.get(2,v,3);
  } // Ends Function smoothstep


} // Ends Class GridTile_TerrPoly



/*======================================================================
|>>> Class GridTile_NaivePoly
+-----------------------------------------------------------------------
| Description: Implements a 3D 'Vertex Grid' via evaluating a standard /
|              parametric form polynomial function in two [2] variables 
|              of up to five [5] degrees; s.t. the variables are {X,Z}
|              axes values, with which the function outputs the {Y} axis
|              (i.e. height/elevation) values corresponding thereof. 
+=====================================================================*/
class GridTile_NaivePoly extends GridTile{
  constructor(vX,vZ,vD,pD){
    super(vX,vZ,vD);
    this.polyDeg  = pD;
    this.parmVals = undefined;
    this.height   = {min:-100,max:100};
    this.powDP    = null; // evaluates exponents only once via dynamic programming
    this.initPowDP();
    this.initGridTile();
  } // Ends Constructor


  // Very cool use of Dynamic Programming, did not expect this!
  initPowDP(){
    this.powDP = {
      exp : [{/*^2*/},{/*^3*/},{/*^4*/},{/*^5*/}],
      get : function(base,powr){
        let idx = constrain(powr,2,5)-2;
        if(this.exp[idx][base]==undefined){this.exp[idx][base]=pow(base,powr);}
        return this.exp[idx][base];
      }
    };
  } // Ends Function initPowDP


  initGridTile(){
    this.setRandomParmVals();
    this.setVertElevations();
  } // Ends Function initGridTile


  setVertElevations(){
    let curVert  = null;
    let curEval  = undefined;
    let maxVal   = -1;
    let minVal   = 1;

    for (let x=0; x<this.vertsX; x++) {
      for (let z=0; z<this.vertsZ; z++) {
        curVert = this.gridVerts[x][z];
        curEval = this.getElevPoly(x,z);
        maxVal  = max(maxVal,curEval);
        minVal  = min(minVal,curEval);
        curVert.set(curVert.x, curEval, curVert.z);
    }}

    for (let x=0; x<this.vertsX; x++) {
      for (let z=0; z<this.vertsZ; z++) {
        curVert = this.gridVerts[x][z];
        curEval = map(curVert.y, minVal, maxVal, this.height.min, this.height.max);
        curVert.set(curVert.x, curEval, curVert.z);
    }}
  } // Ends Function setVertElevations


  // Cool use of switch 'overlapping' technique 
  setRandomParmVals(){
    this.parmVals = {};
    switch(this.polyDeg){
      case 5:
        this.parmVals["ax5"]   = this.getRandomNormElev();
        this.parmVals["az5"]   = this.getRandomNormElev();
        this.parmVals["ax1z4"] = this.getRandomNormElev();
        this.parmVals["ax4z1"] = this.getRandomNormElev();
        this.parmVals["ax2z3"] = this.getRandomNormElev();
        this.parmVals["ax3z2"] = this.getRandomNormElev();
      case 4:
        this.parmVals["ax4"]   = this.getRandomNormElev();
        this.parmVals["az4"]   = this.getRandomNormElev();
        this.parmVals["ax1z3"] = this.getRandomNormElev();
        this.parmVals["ax3z1"] = this.getRandomNormElev();
        this.parmVals["ax2z2"] = this.getRandomNormElev();
      case 3:
        this.parmVals["ax3"]   = this.getRandomNormElev();
        this.parmVals["az3"]   = this.getRandomNormElev();
        this.parmVals["ax1z2"] = this.getRandomNormElev();
        this.parmVals["ax2z1"] = this.getRandomNormElev();
      case 2:
        this.parmVals["ax2"]   = this.getRandomNormElev();
        this.parmVals["az2"]   = this.getRandomNormElev();
        this.parmVals["ax1z1"] = this.getRandomNormElev();
      case 1:
        this.parmVals["ax1"]   = this.getRandomNormElev();
        this.parmVals["az1"]   = this.getRandomNormElev();
        this.parmVals["ac"]    = this.getRandomNormElev();
    }
  } // Ends Function setRandomParmVals


  getElevPoly(x,z){
    switch(this.polyDeg){
      case 1:  return this.getElevPolyDeg1(x,z);
      case 2:  return this.getElevPolyDeg2(x,z);
      case 3:  return this.getElevPolyDeg3(x,z);
      case 4:  return this.getElevPolyDeg4(x,z);
      case 5:  return this.getElevPolyDeg5(x,z);
    }
  } // Ends Function getElevPoly


  getElevPolyDeg1(x,z){
    return this.parmVals["ac"]
    + (this.parmVals["ax1"]    *  x)
    + (this.parmVals["az1"]    *  z);
  } // Ends Function getElevPolyDeg1


  getElevPolyDeg2(x,z){
    return this.getElevPolyDeg1(x,z)
    + (this.parmVals["ax2"]    *  this.powDP.get(x,2))
    + (this.parmVals["az2"]    *  this.powDP.get(z,2))
    + (this.parmVals["ax1z1"]  *  x * z);
  } // Ends Function getElevPolyDeg2


  getElevPolyDeg3(x,z){
    return this.getElevPolyDeg2(x,z)
    + (this.parmVals["ax3"]    *  this.powDP.get(x,3))
    + (this.parmVals["az3"]    *  this.powDP.get(z,3))
    + (this.parmVals["ax1z2"]  *  x * this.powDP.get(z,2))
    + (this.parmVals["ax2z1"]  *  this.powDP.get(x,2) * z);
  } // Ends Function getElevPolyDeg3


  getElevPolyDeg4(x,z){
    return this.getElevPolyDeg3(x,z)
    + (this.parmVals["ax4"]    *  this.powDP.get(x,4))
    + (this.parmVals["az4"]    *  this.powDP.get(z,4))
    + (this.parmVals["ax1z3"]  *  x * this.powDP.get(z,3))
    + (this.parmVals["ax3z1"]  *  this.powDP.get(x,3) * z)
    + (this.parmVals["ax2z2"]  *  this.powDP.get(x,2) * this.powDP.get(z,2));
  } // Ends Function getElevPolyDeg4


  getElevPolyDeg5(x,z){
    return this.getElevPolyDeg4(x,z)
    + (this.parmVals["ax5"]    *  this.powDP.get(x,5))
    + (this.parmVals["az5"]    *  this.powDP.get(z,5))
    + (this.parmVals["ax1z4"]  *  x * this.powDP.get(z,4))
    + (this.parmVals["ax4z1"]  *  this.powDP.get(x,4) * z)
    + (this.parmVals["ax2z3"]  *  this.powDP.get(x,2) * this.powDP.get(z,3))
    + (this.parmVals["ax3z2"]  *  this.powDP.get(x,3) * this.powDP.get(z,2));
  } // Ends Function getElevPolyDeg5


  getRandomNormElev(){
    return random(-1,1);
  } // Ends Function getRandomElev


} // Ends Class GridTile_NaivePoly




/*======================================================================
|>>> Class GameObject
+-----------------------------------------------------------------------
| Description: QAD class loosely based on Unity3D's "Transform" object.
|              Not really used for this project vis-a-vis PCG Terrain,
|              but should (and will) keep for any future 3D object work
|              via P5JS 3D-WebGL which needs it.
+=====================================================================*/
class GameObject{
  constructor(){
    this.position = vec3();
    this.rotation = vec3();
    this.scale    = vec3(1,1,1);
    this.action   = null;
  } // Ends Constructor

  bindAction(action){
    this.action = action;
    return this; // for function chaining
  } // Ends Function bindAction

  render(){
    push();
    translate(this.position.x, this.position.y, this.position.z);
    rotateX(radians(this.rotation.x));
    rotateY(radians(this.rotation.y));
    rotateZ(radians(this.rotation.z));
    scale(this.scale.x, this.scale.y, this.scale.z);
    this.action();
    pop();
  } // Ends Function render
} // Ends Class GameObject