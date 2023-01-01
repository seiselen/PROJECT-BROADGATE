import { UIObject } from "./ui_objects.js";


/**
 * **UIBuildButton** ⮕ Realizes *build/hold/cancel* button As-Seen-In 
 * tower defense, RTS, and many other game genres; and in the style of
 * 'classic Command & Conquer' games, specifically: Red Alert 1.
 */
export class UIBuildButton extends UIObject{
  constructor(pos, dim){
    super(pos,dim);
    //> Subtype-Specific Style Setting[s]
    this.textOff = [5,7];
    this.style.fill_bg = color(144,144,144);
    this.style.colr_01 = color(0,0,0);

    //> State Flags (ALL init'd to [false], req'ing validation at-bind/etc.)
    this.inProgress = false;
    this.isOnHold   = false; // AKA 'isPaused'
    this.isComplete = false;

    //> Animation/Progress State
    this.b_progressFrame = -1;
    this.b_completeFrame = -1;

    //> TEMP - MOVED OUTSIDE CLASS XOR NO CLUE WHAT THESE DO YET
    this.edgeInfo; // cache current edge point info
    this.cAlpha = 64; // max alpha for circle anim
    this.cAlHlf = this.cAlpha/2;
    this.cFSpeed = 60;


    this.action;
  } // Ends Constructor


  bindSoundPlayer(splayer){
    this.soundPlayer = splayer;
    return this;
  }


  bindCallbacks(g_canBuild, g_canAfford, g_itemCost, g_buildTime, n_purchased, n_cancelled, n_completed){
    this.get_canBuild  = g_canBuild;  // informs whether or not the item can be built
    this.get_canAfford = g_canAfford; // informs whether or not player can affort to build
    this.get_itemCost  = g_itemCost;  // informs on the cost of the item
    this.get_buildTime = g_buildTime; // informs on the build time of the item

    this.nfy_purchased = n_purchased; // use case: tells player stage manager to deduct item cost
    this.nfy_cancelled = n_cancelled; // use case: tells player state manager to refund item cost
    this.nfy_completed = n_completed; // use case: tells variety of things item is ready to place/spawn

    return this; // for function chaining
  }




  update(){

    if(this.inProgress && !this.isOnHold){
      this.b_progressFrame +=1;
      if(this.b_progressFrame>=this.b_completeFrame){this.onCompleteBuild();}
    }

  }





  //> Note: If this doesn't work, it's likely that MJS doesn't recognize
  //        {LEFT,RIGHT} as p5 consts. Try 'p5.instance.[LEFT/RIGHT]'?
  onMousePressed(){
    if(this.isMouseOver()){
      switch(mouseButton){
        case LEFT: this.onMousePressed_LEFT(); return;
        case RIGHT: this.onMousePressed_RIGHT(); return;
        default: console.log("SHOULD NEVER GET HERE - FOR JS LINT ONLY!");
      }
    }
  }

  onMousePressed_LEFT(){
    //> BLDG COMPLETED → DO NOTHING (COULD PLAY 'UNABLE TO COMPLY' AFTER 1ST PRESS, BUT MEH...)
    if(this.isComplete){return}

    //> IS IN PROGRESS AND NOT ON HOLD → NAG THE PLAYER FOR BEING IMPATIENT
    if(this.inProgress && !this.isOnHold){return this.onImpatientPlayer()}

    //> NOT BUILDING AND CAN'T AFFORD TO → LAUNCH ON-CANNOT-AFFORD
    if(!this.inProgress && !this.get_canAfford()){return this.onCannotAfford()}

    //> CANNOT BUILD IN ANY CASE → LAUNCH ON-CANNOT-COMPLY
    if(!this.get_canBuild()){return this.onCannotComply()}  

    //> NOT BUILDING AND NOT ON HOLD → LAUNCH ON-START-BUILD
    if(!this.inProgress && !this.isOnHold){return this.onStartBuild()}    

    //> CURRENTLY ON HOLD → LAUNCH ON-RESUME-BUILD
    if(this.isOnHold){return this.onResumeBuild()}
  }

  onMousePressed_RIGHT(){    
    //> BLDG COMPLETED || BLDG IS ON HOLD → CANCEL AND REFUND
    if(this.isComplete || this.isOnHold){return this.onCancelBuild()}

    //> BLDG IS IN PROGRESS AND NOT ON HOLD → PUT IT ON HOLD
    if(this.inProgress && !this.isOnHold){return this.onPutOnHold()}

    //> BLDG NOT IN PROGRESS AND ALL OTHER CASES → LAUNCH ON-CANNOT-COMPLY
    return this.onCannotComply();
  }



  onCannotAfford(){
    this.soundPlayer.play('cant_afford');
  }

  onImpatientPlayer(){
    this.soundPlayer.play('in_progress');
  }

  onCannotComply(){
    this.soundPlayer.play('cant_comply');
  }

  // yeah, weird name, but coincidental... What, Me Worry?!?
  onPutOnHold(){
    this.isOnHold = true;
    this.soundPlayer.play('on_hold');
  }

  onResumeBuild(){
    this.isOnHold = false;
    this.soundPlayer.play('building');
  }

  onStartBuild(){
    this.inProgress   = true;
    this.isOnHold     = false;
    this.isComplete   = false;
    this.b_progressFrame = 0;
    this.b_completeFrame = this.get_buildTime();
    this.nfy_purchased();
    this.soundPlayer.play('building');
  }

  onCompleteBuild(){
    this.isComplete = true;
    this.inProgress = false;
    this.b_progressFrame = this.b_completeFrame; // just-in-case
    this.nfy_completed();
    this.soundPlayer.play('complete'); // XOR "unit ready" down the line    
  }

  onCancelBuild(){
    this.inProgress = false;
    this.isComplete = false;
    this.isOnHold   = false;
    this.b_progressFrame = 0;
    this.b_completeFrame = -1;
    this.nfy_cancelled();
    this.soundPlayer.play('cancelled');
  }



  render(){
    this.renderBackground();
    switch(this.isComplete){
      case true: this.renderText('COMPLETE'); return;
      case false: this.renderAnimRect(); if(this.isOnHold){this.renderText('ON HOLD');} return;
    }
  }
  
  renderBackground(){
    noStroke();
    fill(0,0,84);
    rect(this.pos.x,this.pos.y,this.dim.x,this.dim.y);    
  }

  renderAnimRect(){
    this.edgeInfo = this.ptOnRectViaDeg();
    push();  
    translate(this.pos.x,this.pos.y);
    fill(255,this.cAlpha);
    beginShape();
    vertex(this.edgeInfo[1].x,this.edgeInfo[1].y);
    if(this.edgeInfo[0]==1||this.edgeInfo[0]==2&&this.edgeInfo[1].x>this.dim.x*.5){vertex(this.dim.x,0);vertex(this.dim.x,this.dim.y);vertex(0,this.dim.y);} 
    else if(this.edgeInfo[0]==4){vertex(0,this.dim.y);}
    vertex(0,0);vertex(this.dim.x*.5,0);vertex(this.dim.x*.5,this.dim.y*.5);
    endShape();
    pop();
  }


  renderText(txt){
    fill(255,lerp(this.cAlpha,this.cAlHlf,(frameCount%this.cFSpeed)/this.cFSpeed));
    rect(this.pos.x,this.pos.y,this.dim.x,this.dim.y);
    strokeWeight(1);stroke(255,180);
    textAlign(CENTER,CENTER); textSize(18);
    text(txt,this.mPt.x,this.mPt.y);
  }



  /*--------------------------------------------------------------------
  |>>> Function ptOnRectViaDeg 
  +---------------------------------------------------------------------
  | Source: stackoverflow.com/questions/4061576/       (original source)
  | Author: Steven Eiselen
  +---------------------------------------------------------------------
  | Description: Computes the intersection point of a rectangle (defined 
  |              by this object) with a ray (defined by some degree of a
  |              circle cast at the rectangle's midpoint); returning the
  |              point as well as region where the intersection occured.
  | Input Vars:  > this.dim:     p5.Vector where {x,y}->{width,height}
  |                [State Var]   of rectangle encompassing a BuildButton
  |              > b_progress: value in range [0.0,1.0] of something
  |                [Global Var]  currently 'under construction'
  | Local Vars:  > angT = angle of theta (WRT b_progress %)
  |              > angR = angle of ray   (WRT bounding rect)
  | Output:      > 2D Array composed of:
  |                  [0] - intersection region (xor of set {1/2/3/4})
  |                  [1] - intersection point  (as p5.Vector)
  +---------------------------------------------------------------------
  | Implementation Notes:
  | > (b_progress*360) factors 360 degree range by current progress
  |   factor. [90] is subtracted from it because we want to start the
  |   effect at the "12:00 position" i.e. midpoint of top rect edge
  | > There is some code repetition in 'Phase 3': but I believe that,
  |   compared to the original source, my augmentations are more...
  |    A) Efficient: e.g. reducing a tightly coupled 4-case switch and 
  |       if/else statement into a single 4-case switch statement; plus
  |       removing several variable definitions (beyond TAU and PI).
  |    B) Logically Succinct: i.e. allowed for significant reduction and
  |       simplification of code which formerly required cofactors as
  |       pos/neg modifiers, and/or turning "x += -1*(y)" into "x -= y"
  |   ...Though note that my intention is not to improve the original
  |   source: I'm simply a (recovering) pathetic fool when it comes to 
  |   my level of OCD towards reducing computation expense - Mea Culpa!
  +-------------------------------------------------------------------*/
  ptOnRectViaDeg() {
    let reg  = -1;    
    let angR = Math.atan2(this.dim.x, this.dim.y);
    let angT = (((this.b_progressFrame/this.b_completeFrame)*360)-90) * Math.PI / 180;
    
    while (angT < -PI){angT += TAU;} 
    while (angT >  PI){angT -= TAU;}

    if      (angT >   -angR && angT <= angR   ){reg = 1;} 
    else if (angT >    angR && angT <= PI-angR){reg = 4;} 
    else if (angT > PI-angR || angT <= angR-PI){reg = 3;} 
    else                                       {reg = 2;}

    switch (reg){
      case 1: return [reg,createVector(this.dim.x,(this.dim.y/2)+(this.dim.y/2)*Math.tan(angT))];
      case 2: return [reg,createVector((this.dim.x/2)-(this.dim.x/(2*Math.tan(angT))),0)];
      case 3: return [reg,createVector(0,(this.dim.y/2)-(this.dim.y/2)*Math.tan(angT))];
      case 4: return [reg,createVector((this.dim.x/2)+(this.dim.x/(2*Math.tan(angT))),this.dim.y)];
      default: return null;
    }
  } // Ends Function ptOnRectViaDeg

} // Ends Class BuildButton
