/*======================================================================
|>>> Operation : BROADGATE (Sharing/Demoing My Various Code Projects)
+-----------------------------------------------------------------------
| Project: Visualization of Graham's Scan (2D Convex Hull Generation)
| Author:  Steven Eiselen, Eiselen Laboratories
| Source:  Ported/Refactored from my original Processing3 version
| Assets:  P5JS Library (as imported in the HTML launcher or otherwise)
+-----------------------------------------------------------------------
| Description: Visualization of Graham's Scan Algorithm for 2D Convex
|              Hull generation. Ported into p5js from original version
|              in Processing3, while refactored with some additional
|              features/improvements. Namely: support for greater parm
|              interactivity and minor code cleanup / GFX improvements.
| Future Work: Further clean up code and implement ability to visualize
|              stepwise computation of hull. TLDR on the latter is that
|              it's possible, but I don't want to expend the time to
|              implement right now as there's no [pressing] need outside
|              of my usual OCD and ADHD 'Feature Hell'. IOW: K.I.S.S.!
|              Also IOW: Recall the "Get code up - can improve later"
|              mantra that I've been using to get things up on GitHub!
*=====================================================================*/

// Input State
var numPts = 50;
var valPtsRange = [-400,400];
var ptSpanWide;
var ptSpanRad;
var ptMinDistFac = 0.5;
var ptMaxDistFac = 0.75;
var canvDimHalf;

// Data Structures
var inputSet = {pts: [], iter:1};
var upperCH = {id: 'u', pts: [], iter:1};
var lowerCH = {id: 'l', pts: [], iter:1};

// VFX and Animation State
var animState = 1; // i.e. as per 'implicit FSM'
var fRates    = {points:24, edges:6, hold:3};
var ptPxRad   = 10; // radius of viz circles (ellipses)
var ptPrev, ptCur;

// While Loop Sentinel State
var originPt;
var sentI = 12000; // should be some 'decent' small const factor of numPts
var entrI;

//######################################################################
function setup(){
  createCanvas(800,800).parent("viz");
  ellipseMode(CENTER,CENTER);
  ptSpanWide  = (valPtsRange[1]-valPtsRange[0]);
  ptSpanRad   = ptSpanWide/2;
  canvDimHalf = createVector(width/2,height/2);
  originPt    = createVector(0,0);
}

function draw(){
  switch(animState){
    case 1: TASK_PrepPoints(); break;
    case 2: ANIM_DrawPoints(); break;
    case 3: TASK_PrepCH(); break;
    case 4: ANIM_DrawHalfCH(upperCH); break;
    case 5: ANIM_DrawHalfCH(lowerCH); break;
    case 6: TASK_PauseAndResetLists(6,2); break; 
    //   ^- make sure parms match! -^
  }
}

//######################################################################
function TASK_PrepPoints(){
  // VFX Resets - Prepare for Points Draw
  frameRate(fRates.points); background(36); stroke(180,128); fill(180,64);

  // Draw a nice crosshair with center circle of radius of value span
  line(canvDimHalf.x,0,canvDimHalf.x,height);
  line(0,canvDimHalf.y,width,canvDimHalf.y);
  ellipse(canvDimHalf.x,canvDimHalf.y,ptSpanWide,ptSpanWide);
  stroke(0); fill(255);

  inputSet.iter = 0;
  upperCH.iter = 1;
  lowerCH.iter = 1;
  inputSet.pts = createRandPts();
  animState++;
} // Ends Function EVENT_PrepPoints

function createRandPts(){
  var ptsList = [];
  let candPt = createVector(0,0); // *cand*idate point
  let candPtValid;
  let dist;
  for(let i=0; i<numPts; i++){
    candPtValid = false;
    entrI = 0;
    while(entrI<sentI && !candPtValid){
      candPt.set(
        int(random(valPtsRange[0],valPtsRange[1]+1)),
        int(random(valPtsRange[0],valPtsRange[1]+1))
      )

      dist = candPt.dist(originPt);
      if(dist <= ptSpanRad && abs(candPt.y/ptSpanRad)<=ptMaxDistFac && dist >= (ptSpanRad*ptMinDistFac)){
        ptsList.push(candPt.copy());
        candPtValid = true;
      }
      entrI++;
    }
    if(entrI>=sentI){console.log("WARNING: While Loop Sentinel Value Was Hit!")}
  }
  return ptsList;
} // Ends Function createRandList


//######################################################################
function ANIM_DrawPoints(){
  // When done, prepare for next sequence
  if (inputSet.iter == inputSet.pts.length){animState++; return;}  
  // Else - Draw next point
  let pt = inputSet.pts[inputSet.iter];
  ellipse(pt.x+canvDimHalf.x, pt.y+canvDimHalf.y, ptPxRad, ptPxRad);
  inputSet.iter++; // Advance iterator
} // Ends ANIM_DrawPoints


//######################################################################
function TASK_PrepCH(){
  frameRate(fRates.edges); strokeWeight(2);

  inputSet.pts.sort((a,b) => (a.x - b.x));
  drawCH('u'); // Create Upper CH
  drawCH('l'); // Create Lower CH 
  animState++;
}


function drawCH(op){ 
  let val = -1;
  let hHull;
  
  if(op == 'u'){hHull = upperCH; val=2;} 
  else if(op == 'l'){ hHull = lowerCH; val=1;}

  let pts = hHull.pts;
  
  pts.push(inputSet.pts[0].copy());
  pts.push(inputSet.pts[1].copy());
  
  for(let i = 2; i<inputSet.pts.length; i++){
    pts.push(inputSet.pts[i].copy());  
    while(pts.length>2 && getOrient(pts[pts.length-3],pts[pts.length-2],pts[pts.length-1]) != val){
      pts.splice(pts.length-2,1);
    } // Ends While Loop
  } // Ends For Loop
}

function getOrient(p1, p2, p3){
  // Determinant function
  let det = (p2.x - p1.x)*(p3.y - p1.y) - (p2.y - p1.y)*(p3.x - p1.x); 
  if      (det == 0){return 0;} // Colinear Case = 0
  else if (det <  0){return 1;} // Clockwise Case = 1
  else              {return 2;} // Counterclockwise Case = 2
} // Ends Function Orient


//########################################################################
function ANIM_DrawHalfCH(hHull){
  // When done - prepare for and launch Lower CH draw sequence
  if(hHull.iter == hHull.pts.length){animState++;return;} 

  ptPrev = hHull.pts[hHull.iter-1];
  ptCur  = hHull.pts[hHull.iter];

  switch(hHull.id){
    case 'u': stroke(255,120,0); break;
    case 'l': stroke(0,255,0); break;
  }

  line(ptPrev.x+canvDimHalf.x, ptPrev.y+canvDimHalf.y, ptCur.x+canvDimHalf.x, ptCur.y+canvDimHalf.y);

  hHull.iter++;
} // Ends ANIM_DrawUpperCH


//########################################################################
function TASK_PauseAndResetLists(nPhases,delay=0){
  // Set Conditional's value to final phase # plus whatever second delay you want
  if (animState<=(nPhases+delay)){
    animState=1;
    inputSet.pts = [];
    upperCH.pts = [];
    lowerCH.pts = [];
    console.log("Anim Sequence Complete...Restarting")
  }
} // Ends EVENT_PauseAndResetLists