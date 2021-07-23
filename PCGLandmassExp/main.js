/*======================================================================
| Project: Perlin Noise - based Procedural Landmass Experiment
| Author:  Steven Eiselen, University of Arizona Computer Science 
| Source:  Sebastian Lague Series on Procedural Landmass Creation, link
|          to series first video: www.youtube.com/watch?v=wbpMiKiSKm8
| Assets:  Did you import libraries, copy over code from other projects
+-----------------------------------------------------------------------
| Description: QAD - Implements Procedural Landmass creation via Perlin
|              Noise based on Sebastian Lague's videos as aforementioned
+-----------------------------------------------------------------------
| Implementation Notes:
|  > THIS IMPLEMENTS THE NEWEST VERSION OF THE UI SYSTEM!!!
|  > This is an active experiment, ergo it is not thorougly documented!
+-----------------------------------------------------------------------
| Version Info:
|  > 04/18/17 - Emergency rush refactor for Grad Project turnin
*=====================================================================*/

// Basically: 'Input Args' (and trying something new with dict-based def)
var argz = {
  // dims, 'Nuff Said
  canvWide: 960, canvTall: 720, cellSize: 8,
  rows: function(){return this.canvTall/this.cellSize},
  cols: function(){return this.canvWide/this.cellSize},
  //      rand. seed | noise scale | # octaves | persistence | lacunarity
  nVals: {seed: 21,    scale: 25,    oct: 4,     per: 0.5,     lac: 2},
  // constraints and bounds for noise parm values
  nInfo: {scaleDel:0.1, scaleMin:4, scaleMax:32, octDel:1, octMin:0, octMax:8, perDel:.05, perMin:.1, perMax:.7, lacDel:1, lacMin:0, lacMax:8}
}; // Ends Input Argzzz

var uiItems;

var landmass;

function setup(){
  createCanvas(argz.canvWide,argz.canvTall).parent("pane_viz");
  init_ui();
  landmass = new ProceduralLandmass(argz.rows(), argz.cols(), argz.cellSize, argz.nVals, argz.nInfo);
  landmass.setAllUILabels();
  landmass.generateMap();
} // Ends P5JS Function setup

function draw(){
  //>>> UPDATE CALLS
  keyDown();
  uiItems.updateDirReqs();

  //>>> RENDER CALLS
  background(60);
  landmass.render();

  drawFPS();
  drawMouseCoordCursor();
  drawMouseCoordTooltip();
  drawCanvasBorder();
} // Ends P5JS Function draw

function keyDown(){
  if(keyIsDown(UP_ARROW)){reqLandmassPan('U');}
  if(keyIsDown(DOWN_ARROW)){reqLandmassPan('D');}
  if(keyIsDown(LEFT_ARROW)){reqLandmassPan('L');}
  if(keyIsDown(RIGHT_ARROW)){reqLandmassPan('R');}
}

function reqLandmassPan(DIR){if(frameCount%2==0){landmass.setCellOffAndRegen(DIR);}}

//>>> MISC UTIL METHODS (no need for a separate file {at this time})
function drawCanvasBorder(){stroke(60); strokeWeight(4); noFill(); rect(0,0,width,height);}
function mouseInCanvas(){return (mouseX > 0) && (mouseY > 0) && (mouseX < width) && (mouseY < height);}
function mousePtToVec(){return createVector(mouseX, mouseY);}
function drawFPS(blurb="FPS: "){noStroke();fill(0,128); rect(0,height-20,80,height-20);textSize(16); textAlign(LEFT,CENTER); strokeWeight(2); stroke(0); fill(255);text(blurb+round(frameRate()), 10, height-8);}

function drawMouseCoordTooltip(ttTall=24, ttWide=108){ 
  if(!mouseInCanvas()){return;} 
  let x1 = (mouseX+ttWide>width) ? mouseX-ttWide : mouseX; let y1 = (mouseY+ttTall>height) ? mouseY-ttTall : mouseY; let xOff = mouseX; let yOff = mouseY; 
  switch(x1==mouseX){case true: xOff+=6; textAlign(LEFT); break; case false: xOff-=6; textAlign(RIGHT);} switch(y1==mouseY){case true: yOff+=12; break; case false: yOff-=12;} 
  textSize(18); stroke(0); strokeWeight(4); fill(255); text("("+(floor(mouseY/argz.cellSize)+landmass.cOff.y)+","+(floor(mouseX/argz.cellSize)+landmass.cOff.x)+")",xOff,yOff);
} // Ends Function drawMouseCoordTooltip

function drawMouseCoordCursor(){
  if(!mouseInCanvas()){return;}
  noCursor(); noFill(); stroke(240,120,0); strokeWeight(2); 
  let cDim = landmass.dim.cell; let hDim = cDim/2; let xPos = floor(mouseX/cDim)*cDim; let yPos = floor(mouseY/cDim)*cDim;
  rect(xPos,yPos,cDim,cDim);line(xPos+hDim,yPos,xPos+hDim,yPos-cDim);line(xPos+hDim,yPos+cDim,xPos+hDim,yPos+cDim+cDim);line(xPos,yPos+hDim,xPos-cDim,yPos+hDim);line(xPos+cDim,yPos+hDim,xPos+cDim+cDim,yPos+hDim);
} // Ends Function drawCursor