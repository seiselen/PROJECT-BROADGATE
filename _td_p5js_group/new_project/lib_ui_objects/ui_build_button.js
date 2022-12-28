
// class BuildButton{
//   constructor(pos,dim){
//     this.pos = pos;
//     this.dim = dim;
//     this.ePt = createVector(this.pos.x+this.dim.x,this.pos.y+this.dim.y);
//     this.mid = p5.Vector.mult(this.dim,0.5);
//     this.edgeInfo; // cache current edge point info
//     this.cAlpha = 64; // max alpha for circle anim
//     this.cAlHlf = this.cAlpha/2;
//     this.cFSpeed = 60;

//     //>>> Variables for building anim state/sim
//     this.bldgStartFrame;
//     this.bldgDoneFrame; 
//     this.bldgTimePeriod = 300;
//     this.bldgProgress   = 0;
//     this.isBuilding     = false;
//     this.isPaused       = false;
//   }



//   update(){
//     this.simulateBuilding();
//   }



// //######################################################################
// //>>> LOGIC METHODS
// //######################################################################
// function onStartBuilding(){
//   isBuilding = true;
//   bldgStartFrame = frameCount;
//   bldgProgress = 0;
//   resetBldgStartPopup();
// }

// function onDoneBuilding(){
//   bldgProgress = 1;
//   isBuilding = false;
//   bldgDoneFrame = frameCount;
// }

// function simulateBuilding(){
//   if(isBuilding){
//     bldgProgress = (frameCount-bldgStartFrame)/bldgTimePeriod;
//     if(bldgProgress >= 1){onDoneBuilding();}
//   }
// }

// function onCancelBuilding(){
//   bldgProgress = 0;
//   isBuilding = false;
//   bldgDoneFrame = frameCount;
//   resetBldgCancelPopup();
// }



// //######################################################################
// //>>> RENDER METHODS
// //######################################################################
// function QADShowBldgProgress(){
//   noStroke();fill(255);
//   textAlign(CENTER,TOP); textSize(32);
//   text(bldgProgress,width/2,32);
// }


// //>>> QAD Popup System (for indicating construction was started/cancelled in lieu of RA-1 Narrator audio clips)
// var cPopupFrameStart = -1; var cShowPopup = false;
// var sPopupFrameStart = -1; var sShowPopup = false;
// var popupNumFrames   = 60;
// function resetBldgCancelPopup(){cShowPopup = true; cPopupFrameStart = frameCount;}
// function resetBldgStartPopup(){sShowPopup = true; sPopupFrameStart = frameCount;}
// function showBothPopups(){showBldgStartPopup();showBldgCancelPopup();}
// function showBldgCancelPopup(){if(cShowPopup && frameCount <= cPopupFrameStart+popupNumFrames){strokeWeight(2);stroke(64,64);fill(255,60,0,128);textAlign(RIGHT,CENTER);textSize(48);text("CANCELLED",height-30,height-30);}else{cShowPopup = false;}}
// function showBldgStartPopup(){if(sShowPopup && frameCount <= sPopupFrameStart+popupNumFrames){strokeWeight(2);stroke(64,64);fill(0,120,255,128);textAlign(LEFT,CENTER);textSize(48);text("BUILDING",30,height-30);}else{sShowPopup = false;}}



//   onMousePressed(){

//     if(mouseInCanvas()){ 
//       if(mouseButton == LEFT && !isBuilding){onStartBuilding();}
//       if(mouseButton == RIGHT && bldgProgress>0){onCancelBuilding();}
//     }

//   }






//   render(){

//     noStroke();fill(0,0,84);rect(0,0,this.dim.x,this.dim.y);

//     push();
//     translate(100,100);

//     this.edgeInfo = this.ptOnRectViaDeg();

//     if(bldgProgress<1){
//       fill(255,this.cAlpha);
//       beginShape();
//         vertex(this.edgeInfo[1].x,this.edgeInfo[1].y);
//         if(this.edgeInfo[0] == 1 || this.edgeInfo[0] == 2 && this.edgeInfo[1].x > this.mid.x){
//           vertex(this.ePt.x,this.pos.y);vertex(this.ePt.x,this.ePt.y);vertex(this.pos.x,this.ePt.y);
//         } 
//         else if(this.edgeInfo[0] == 4){
//           vertex(this.pos.x,this.ePt.y);
//         }
//         vertex(this.pos.x,this.pos.y);
//         vertex(this.mid.x,this.pos.y);
//         vertex(this.mid.x,this.mid.y);
//       endShape();
//     }
//     else{
//       fill(255,lerp(this.cAlpha,this.cAlHlf,((frameCount-bldgDoneFrame)%this.cFSpeed)/this.cFSpeed));
//       rect(0,0,this.dim.x,this.dim.y);
//       strokeWeight(1);stroke(255,180);
//       textAlign(CENTER,CENTER); textSize(48);
//       text("CONSTRUCTION\nCOMPLETE",this.mid.x,this.mid.y);
//     }

//     pop();

//   } // Ends Function render


//   /*--------------------------------------------------------------------
//   |>>> Function ptOnRectViaDeg 
//   +---------------------------------------------------------------------
//   | Source: stackoverflow.com/questions/4061576/       (original source)
//   | Author: Steven Eiselen
//   +---------------------------------------------------------------------
//   | Description: Computes the intersection point of a rectangle (defined 
//   |              by this object) with a ray (defined by some degree of a
//   |              circle cast at the rectangle's midpoint); returning the
//   |              point as well as region where the intersection occured.
//   | Input Vars:  > this.dim:     p5.Vector where {x,y}->{width,height}
//   |                [State Var]   of rectangle encompassing a BuildButton
//   |              > bldgProgress: value in range [0.0,1.0] of something
//   |                [Global Var]  currently 'under construction'
//   | Local Vars:  > angT = angle of theta (WRT bldgProgress %)
//   |              > angR = angle of ray   (WRT bounding rect)
//   | Output:      > 2D Array composed of:
//   |                  [0] - intersection region (xor of set {1/2/3/4})
//   |                  [1] - intersection point  (as p5.Vector)
//   +---------------------------------------------------------------------
//   | Implementation Notes:
//   | > (bldgProgress*360) factors 360 degree range by current progress
//   |   factor. [90] is subtracted from it because we want to start the
//   |   effect at the "12:00 position" i.e. midpoint of top rect edge
//   | > There is some code repetition in 'Phase 3': but I believe that,
//   |   compared to the original source, my augmentations are more...
//   |    A) Efficient: e.g. reducing a tightly coupled 4-case switch and 
//   |       if/else statement into a single 4-case switch statement; plus
//   |       removing several variable definitions (beyond TAU and PI).
//   |    B) Logically Succinct: i.e. allowed for significant reduction and
//   |       simplification of code which formerly required cofactors as
//   |       pos/neg modifiers, and/or turning "x += -1*(y)" into "x -= y"
//   |   ...Though note that my intention is not to improve the original
//   |   source: I'm simply a (recovering) pathetic fool when it comes to 
//   |   my level of OCD towards reducing computation expense - Mea Culpa!
//   +-------------------------------------------------------------------*/
//   ptOnRectViaDeg() {
//     let reg  = -1;    
//     let angR = Math.atan2(this.dim.x, this.dim.y);
//     let angT = ((bldgProgress*360)-90) * Math.PI / 180;
    
//     while (angT < -PI){angT += TAU;} 
//     while (angT >  PI){angT -= TAU;}

//     if      (angT >   -angR && angT <= angR   ){reg = 1;} 
//     else if (angT >    angR && angT <= PI-angR){reg = 4;} 
//     else if (angT > PI-angR || angT <= angR-PI){reg = 3;} 
//     else                                       {reg = 2;}

//     switch (reg){
//       case 1: return [reg,createVector(this.dim.x,(this.dim.y/2)+(this.dim.y/2)*Math.tan(angT))];
//       case 2: return [reg,createVector((this.dim.x/2)-(this.dim.x/(2*Math.tan(angT))),0)];
//       case 3: return [reg,createVector(0,(this.dim.y/2)-(this.dim.y/2)*Math.tan(angT))];
//       case 4: return [reg,createVector((this.dim.x/2)+(this.dim.x/(2*Math.tan(angT))),this.dim.y)];
//       default: return null;
//     }
//   } // Ends Function ptOnRectViaDeg

// } // Ends Class BuildButton
