// Mostly case I get confused, but likely some future utility too
var Axis = {"X":"Right", "Y":"Up", "Z":"Forward", "Right":"X", "Up":"Y", "Forward":"Z", "FORE":"X", "ELEV":"Y", "SIDE":"Z"};

var labl_fps;

var showAxesGizmo = false;

//>>> NOTE/TODO: Create and move within 'GridPlane' object class or equivalent alongside
//               applicable function defs below ASAP (likely after build/R&D session 1).
var gridVerts = [];
var vertsX    = 32; // # of verts on X (aka SIDE aka RIGHT) axis
var vertsZ    = 32; // # of verts on Z (aka FORE aka FORWARD) axis
var vertDim   = 16; // px distance between verts (WRT projection onto {X,Z} plane)
var polyDeg   = 5;

function setup() {
  createCanvas(1280,832,WEBGL).parent('viz');
  labl_fps = select("#labl_fps");

  generateGridVerts();
  setVertElevations(polyDeg);

} // Ends P5JS Function setup


function draw() {
  //>>> UI/UX CALLS
  orbitControl();
  keyDown();

  //>>> ADVANCE CALLS


  //>>> RENDER CALLS
  background(216);
  scale(1,-1,1); // ASSERTS [+Y]=>[UP]

  renderGridVerts(2,true);
  renderGridPlanes();

  if(showAxesGizmo){drawGizmo_3DAxes();}
  updateDOMUI();
} // Ends P5JS Function draw

function keyDown(){
  if(keyIsPressed && (key=="r" || key=="R")){setVertElevations(polyDeg);}
}


function keyPressed(){
  if(key=="g" || key=="G"){showAxesGizmo = !showAxesGizmo;}
  //if(key=="r" || key=="R"){setVertElevations(polyDeg);}
}


//======================================================================
//>>> POLYNOMIAL-BASED ELEVATION GENERATION FUNCTIONS
//----------------------------------------------------------------------
//  > NOTE/TODO 1: Via following along with video 'Painting a Landscape
//                 with Maths' video (youtube.com/watch?v=BFld4EBO2RE); 
//                 alongside the usual derivations/extensions thereto.
//======================================================================

function setVertElevations(degree, minElev, maxElev){
  let curVert  = null;
  let curEval  = undefined;
  let parmVals = getRandomParmVals(degree);

  let getElev  = null;
  switch(degree){
    case 1:  getElev = getElevPolyDeg1; break;
    case 2:  getElev = getElevPolyDeg2; break;
    case 3:  getElev = getElevPolyDeg3; break;
    case 4:  getElev = getElevPolyDeg4; break;
    case 5:  getElev = getElevPolyDeg5; break;
    default: getElev = getElevPolyDeg1; console.log("WARNING: invalid input? (degree)=>["+degree+"] ?");
  }

  let maxVal = -1;
  let minVal = 1;
  for (let x=0; x<vertsX; x++) {
    for (let z=0; z<vertsZ; z++) {
      curVert = gridVerts[x][z];
      curEval = getElev(x, z, parmVals);
      maxVal  = max(maxVal,curEval);
      minVal  = min(minVal,curEval);
      curVert.set(curVert.x, curEval, curVert.z);
  }}

  for (let x=0; x<vertsX; x++) {
    for (let z=0; z<vertsZ; z++) {
      curVert = gridVerts[x][z];
      curEval = map(curVert.y, minVal, maxVal, -100, 100);
      curVert.set(curVert.x, curEval, curVert.z);
  }}

} // Ends Function setVertElevations


function getRandomParmVals(degree){
  let ret = {};
  switch(degree){
    case 5:
      ret["ax5"]   = getRandomElev();
      ret["az5"]   = getRandomElev();
      ret["ax1z4"] = getRandomElev();
      ret["ax4z1"] = getRandomElev();
      ret["ax2z3"] = getRandomElev();
      ret["ax3z2"] = getRandomElev();
    case 4:
      ret["ax4"]   = getRandomElev();
      ret["az4"]   = getRandomElev();
      ret["ax1z3"] = getRandomElev();
      ret["ax3z1"] = getRandomElev();
      ret["ax2z2"] = getRandomElev();
    case 3:
      ret["ax3"]   = getRandomElev();
      ret["az3"]   = getRandomElev();
      ret["ax1z2"] = getRandomElev();
      ret["ax2z1"] = getRandomElev();
    case 2:
      ret["ax2"]   = getRandomElev();
      ret["az2"]   = getRandomElev();
      ret["ax1z1"] = getRandomElev();
    case 1:
      ret["ax1"]   = getRandomElev();
      ret["az1"]   = getRandomElev();
      ret["ac"]    = getRandomElev();
  }
  return ret;
} // Ends Function getRandomParmVals


function getElevPolyDeg1(x, z, parmVals){
  return parmVals["ac"]
  + (parmVals["ax1"]    *  x)
  + (parmVals["az1"]    *  z);
} // Ends Function getElevPolyDeg1


function getElevPolyDeg2(x, z, parmVals){
  return getElevPolyDeg1(x, z, parmVals)
  + (parmVals["ax2"]    *  powDP.get(x,2))
  + (parmVals["az2"]    *  powDP.get(z,2))
  + (parmVals["ax1z1"]  *  x * z);
} // Ends Function getElevPolyDeg2


function getElevPolyDeg3(x, z, parmVals){
  return getElevPolyDeg2(x, z, parmVals)
  + (parmVals["ax3"]    *  powDP.get(x,3))
  + (parmVals["az3"]    *  powDP.get(z,3))
  + (parmVals["ax1z2"]  *  x * powDP.get(z,2))
  + (parmVals["ax2z1"]  *  powDP.get(x,2) * z);
} // Ends Function getElevPolyDeg3


function getElevPolyDeg4(x, z, parmVals){
  return getElevPolyDeg3(x, z, parmVals)
  + (parmVals["ax4"]    *  powDP.get(x,4))
  + (parmVals["az4"]    *  powDP.get(z,4))
  + (parmVals["ax1z3"]  *  x * powDP.get(z,3))
  + (parmVals["ax3z1"]  *  powDP.get(x,3) * z)
  + (parmVals["ax2z2"]  *  powDP.get(x,2) * powDP.get(z,2));
} // Ends Function getElevPolyDeg4


function getElevPolyDeg5(x, z, parmVals){
  return getElevPolyDeg4(x, z, parmVals)
  + (parmVals["ax5"]    *  powDP.get(x,5))
  + (parmVals["az5"]    *  powDP.get(z,5))
  + (parmVals["ax1z4"]  *  x * powDP.get(z,4))
  + (parmVals["ax4z1"]  *  powDP.get(x,4) * z)
  + (parmVals["ax2z3"]  *  powDP.get(x,2) * powDP.get(z,3))
  + (parmVals["ax3z2"]  *  powDP.get(x,3) * powDP.get(z,2));
} // Ends Function getElevPolyDeg5


function getRandomElev(){
  return random(-1,1);
}

var powDP = {
  exp : [{/*^2*/},{/*^3*/},{/*^4*/},{/*^5*/}],
  get : function(base,powr){
    // bound input then convert to zero indexing
    let idx = constrain(powr,2,5)-2;
    // if currently undefined, define it
    if(this.exp[idx][base]==undefined){
      let val = 1;
      for (let i=0; i<powr; i++) {val *= base;}
      this.exp[idx][base] = val;
    }
    // was or is now defined: return it
    return this.exp[idx][base];
  }
}; // Ends 'Chunk' powDP


//======================================================================
//>>> INIT AND UTIL FUNCTIONS SPECIFIC TO THIS PROJECT
//----------------------------------------------------------------------
//> NOTE/TODO: Should eventually be within 'GridPlane' object class or 
//             equivalent ASAP (likely after build/R&D session 1).
//======================================================================

function generateGridVerts(){
  for (let x=0; x<vertsX; x++) {
    gridVerts[x] = [];
    for (let z=0; z<vertsZ; z++) {
      gridVerts[x][z] = vec3(x*vertDim, 0, z*vertDim);
  }}
} // Ends Function generateGridVerts


function renderGridVerts(ptDiam=8, drawBlack=false){
  noStroke();
  for (let x=0; x<vertsX; x++) {
    for (let z=0; z<vertsZ; z++) {
      switch(drawBlack){
        case true: fill(0,192); break;
        case false: setGridFill(x,z); break;
      }
      drawCube(gridVerts[x][z].x, gridVerts[x][z].y, gridVerts[x][z].z, ptDiam);
  }}
} // Ends Function renderGridVerts


function renderGridPlanes(){
  noStroke();
  let xDist, yDist, zDist;
  let TL, TR, BL, BR;
  for (let x=1; x<vertsX; x++) {
    for (let z=1; z<vertsZ; z++) {
      setGridFill(x,z);
      drawQuad(gridVerts[x-1][z-1], gridVerts[x][z-1], gridVerts[x-1][z], gridVerts[x][z]);
  }}
} // Ends Function renderGridVerts


function setGridFill(x,z){
  let xDist = x/vertsX;
  let zDist = z/vertsZ;
  let yDist = 1.0 - xDist - zDist;
  fill(lerp(0,255,xDist),lerp(0,255,yDist),lerp(0,255,zDist));
}



function drawQuad(TL, TR, BL, BR, LOD=2){
  quad(TL.x, TL.y, TL.z, TR.x, TR.y, TR.z, BR.x, BR.y, BR.z, BL.x, BL.y, BL.z, LOD, LOD);
}


function drawCube(xPos,yPos,zPos,dim){
  push();
  translate(xPos,yPos,zPos);
  box(dim,dim,dim);
  pop();
} // Ends Function drawCube

//======================================================================
//>>> DEBUG AND DOM-UI FUNCTIONS SPECIFIC TO THIS PROJECT
//======================================================================

//>> Draws Axis Lines and Ref Squares Unity3D-style (in resp. order {SIDE, FORE, ELEV})
function drawGizmo_3DAxes(lineDist=128, planeDim=16){ 
  strokeWeight(max(1,int(planeDim/16)));
  stroke(255,0,0); line(0,0,0,512,0,0);
  stroke(0,0,255); line(0,0,0,0,0,512);
  stroke(0,255,0); line(0,0,0,0,512,0);
  noStroke();
  let pDimHalf = planeDim/2;
  fill(255,0,0,127); push(); translate(pDimHalf,pDimHalf,0); plane(planeDim,planeDim); pop();
  fill(0,255,0,127); push(); translate(pDimHalf,0,pDimHalf); rotateX(HALF_PI); plane(planeDim,planeDim); pop();
  fill(0,0,255,127); push(); translate(0,pDimHalf,pDimHalf); rotateY(HALF_PI); plane(planeDim,planeDim); pop();
} // Ends Function drawGizmo_3DAxes


function updateDOMUI() {
  labl_fps.html("FPS: "+round(frameRate()));
}