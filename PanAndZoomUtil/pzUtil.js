/*----------------------------------------------------------------------
|>>> Class PZUtil ([P]an and [Z]oom [Util]ity)
+-----------------------------------------------------------------------
| Description:  (QAD) Implements the Pan-And-Zoom Utility
| Dependencies: Requires two functions from Steven Eiselen's 'util.js'
|               P5JS support code library: 'mouseInCanvas' and 'vec2'.
|               As of 9/23/21, it is located at the following link:              
|                >>> seiselen.github.io/PROJECT-BROADGATE/utils.js <<<
|
|               Anyone using this could either link directly thereto via
|               their index.html file, or simply copy-paste the needed
|               functions' code directly into their (main) JS file.
+---------------------------------------------------------------------*/
class PZUtil{
  constructor(cDims){
    this.canvDims = {WIDE:cDims[0], TALL:cDims[1], H_WIDE:cDims[0]/2 , H_TALL:cDims[1]/2};
    this.pan      = {x:0, y:0, delta:4};
    this.zoom     = {factor:1, min:0.05, max:16, delta:0.05};
    this.pButtons = [];
    this.zButtons = [];
    this.uiLabels = [];
    this.initPZUIObjects();
  }

  /*--------------------------------------------------------------------
  |### INIT/LOADER FUNCTION ############################################
  +-------------------------------------------------------------------*/
  initPZUIObjects(){
    let len  = 64; let lenH = len/2;
    let vals = {
      pan_N:    {type:"c",  act:"N",  char:String.fromCharCode(0x2B06), dim:vec2(len,len),       loc:vec2((width/2)-lenH,0)},
      pan_S:    {type:"c",  act:"S",  char:String.fromCharCode(0x2B07), dim:vec2(len,len),       loc:vec2((width/2)-lenH,height-len)},
      pan_E:    {type:"c",  act:"E",  char:String.fromCharCode(0x2B95), dim:vec2(len,len),       loc:vec2(width-len,(height/2)-lenH)},
      pan_W:    {type:"c",  act:"W",  char:String.fromCharCode(0x2B05), dim:vec2(len,len),       loc:vec2(0,(height/2)-lenH)},
      pan_NE:   {type:"c",  act:"NE", char:String.fromCharCode(0x2B08), dim:vec2(len,len),       loc:vec2(width-len,0)},
      pan_SE:   {type:"c",  act:"SE", char:String.fromCharCode(0x2B0A), dim:vec2(len,len),       loc:vec2(width-len,height-len)},
      pan_NW:   {type:"c",  act:"NW", char:String.fromCharCode(0x2B09), dim:vec2(len,len),       loc:vec2(0,0)},
      pan_SW:   {type:"c",  act:"SW", char:String.fromCharCode(0x2B0B), dim:vec2(len,len),       loc:vec2(0,height-len)},
      pan_RES:  {type:"cl", act:"RP", char:String.fromCharCode(0x29C8), dim:vec2(len*2,len*2),   loc:vec2((width/2)-len,(height/2)-len), lab:"RESET PAN\nTO  ORIGIN"},
      zoom_in:  {type:"cl", act:"+",  char:String.fromCharCode(0x2A01), dim:vec2(len*2,len*1.5), loc:vec2(width-(len*2),(len)), lab:"INC. ZOOM"},
      zoom_1x:  {type:"cl", act:"RZ", char:String.fromCharCode(0x2A00), dim:vec2(len*2,len*1.5), loc:vec2(width-(len*2),(len*2.5)), lab:"RESET ZOOM"},
      zoom_out: {type:"cl", act:"-",  char:String.fromCharCode(0x2296), dim:vec2(len*2,len*1.5), loc:vec2(width-(len*2),(len*4)), lab:"DEC. ZOOM"},
    };

    let tempButton;
    Object.keys(vals).forEach((k)=>{
      switch(vals[k].type){
        case "c"  : tempButton = new ButtonCharOnly(vals[k].loc, vals[k].dim, vals[k].char); break; 
        case "cl" : tempButton = new ButtonCharLabel(vals[k].loc, vals[k].dim, vals[k].char, vals[k].lab); 
        break; default : console.log("ERROR!"); return;}
      tempButton.bindAction(()=>this.action(vals[k].act));
      switch(k[0]){case "z": this.zButtons.push(tempButton); break; case "p": this.pButtons.push(tempButton); break;}
    });

    this.uiLabels.push(new UILabel(vec2((width/2)-32-(len*4), 0), vec2((len*4), lenH), "PAN OFFSET: (123,456)").bindCallback(()=>this.panValToString()));
    this.uiLabels.push(new UILabel(vec2((width/2)+32, 0), vec2((len*4), lenH), "SCALE FACTOR: [2]").bindCallback(()=>this.zoomValToString())); 
  } // Ends Function initPZUIObjects

  /*--------------------------------------------------------------------
  |### GETTER/TOSTRING FUNCTIONS #######################################
  +-------------------------------------------------------------------*/
  panValToString(){return "PAN OFFSET: ("+this.pan.x+","+this.pan.y+")";}
  zoomValToString(){return "ZOOM FACTOR: ["+this.zoom.factor+"x]";}

  /*--------------------------------------------------------------------
  |### UI UPDATE/HANDLER FUNCTIONS #####################################
  +-------------------------------------------------------------------*/
  update(){
    this.handleKeyDown();  
    if(mouseInCanvas()){
      this.handleMouseDown();
      this.uiLabels.forEach((l)=>l.update());
    }
  } // Ends Function update

  handleMouseDown(){if(mouseIsPressed){this.pButtons.forEach((b)=>b.onMousePressed());}}

  //>>> CALL THIS IN P5JS FUNCTION: 'mousePressed'
  handleMousePressed(){if(mouseInCanvas()){this.zButtons.forEach((b)=>b.onMousePressed());}}

  //>>> CALL THIS IN P5JS FUNCTION: 'mouseWheel'
  handleMouseWheel(evt){if(mouseInCanvas()){
    switch(Math.sign(evt.delta)){
      case 1: this.action('-'); return; 
      case -1: this.action('+'); return;}
    }
  }

  //>>> CALL THIS IN P5JS FUNCTION: 'keyPressed'
  handleKeyPressed(key){
    switch(key){
      case 'z': this.action('+'); return;
      case 'x': this.action('-'); return;
      case 'c': this.action('RZ'); return;
      case '0': this.action('RP'); return;
      case 'q': this.action('RA'); return;
      case '`': this.action('-P'); return;
    }
  }

  handleKeyDown(){
    if(keyIsDown(UP_ARROW))   {this.action('N');}
    if(keyIsDown(DOWN_ARROW)) {this.action('S');}
    if(keyIsDown(LEFT_ARROW)) {this.action('W');}
    if(keyIsDown(RIGHT_ARROW)){this.action('E');}
  }

  /*--------------------------------------------------------------------
  |### UI ACTION FUNCTION ##############################################
  +-------------------------------------------------------------------*/
  action(key){
    switch(key){
      /*>>> PAN-RELATED ACTIONS */
      case 'N'  : this.pan.y += this.pan.delta; return;
      case 'S'  : this.pan.y -= this.pan.delta; return;
      case 'E'  : this.pan.x -= this.pan.delta; return;
      case 'W'  : this.pan.x += this.pan.delta; return;
      case 'NE' : this.pan.x -= this.pan.delta; this.pan.y += this.pan.delta; return;
      case 'SE' : this.pan.x -= this.pan.delta; this.pan.y -= this.pan.delta; return;
      case 'NW' : this.pan.x += this.pan.delta; this.pan.y += this.pan.delta; return;
      case 'SW' : this.pan.x += this.pan.delta; this.pan.y -= this.pan.delta; return;
      case 'RP' : this.pan.x  = 0;              this.pan.y  = 0; return;
      /*>>> ZOOM-RELATED ACTIONS */
      case '+'  : this.zoom.factor = Math.min(this.zoom.max, Math.round((this.zoom.factor+this.zoom.delta)*100)/100); return;
      case '-'  : this.zoom.factor = Math.max(this.zoom.min, Math.round((this.zoom.factor-this.zoom.delta)*100)/100); return;
      case 'RZ' : this.zoom.factor = 1; return;
      /*>>> MISC PAN AND ZOOM ACTIONS */
      case 'RA' : this.pan.x = 0; this.pan.y = 0; this.zoom.factor = 1; return; /*<= RESET PAN AND ZOOM */
      case '-P' : this.pan.delta *= -1; return; /*<= REVERSE CONTROLS (APPLIES TO CANVAS AND KEYBOARD UI) */
    }
  }

  /*--------------------------------------------------------------------
  |### APPLY/UNDO TRANSFORM FUNCTIONS ##################################
  +-------------------------------------------------------------------*/
  pushTF(){push(); translate(this.pan.x+this.canvDims.H_WIDE, this.pan.y+this.canvDims.H_TALL); scale(this.zoom.factor, this.zoom.factor);}
  popTF(){pop();}

  /*--------------------------------------------------------------------
  |### RENDER FUNCTIONS ################################################
  +-------------------------------------------------------------------*/
  render(){
    if(mouseInCanvas()){
      this.pButtons.forEach((b)=>b.render());
      this.zButtons.forEach((b)=>b.render());
      this.uiLabels.forEach((l)=>l.render());
    }
  } // Ends Function render
} // Ends Class PZUtil


/*######################################################################
|>>> Pan/Zoom Util UIObject Family Of Classes
+#####################################################################*/


/*======================================================================
|>>> [Abstract] Class PZUIObject
+=====================================================================*/
class PZUIObject{
  constructor(pos, dim){
    this.pos  = pos;
    this.dim  = dim;
    this.dimH = p5.Vector.div(this.dim,2);
    this.midP = p5.Vector.add(this.pos,this.dimH);
    this.endP = p5.Vector.add(this.pos,this.dim);
    this.initVizVals();
  } // Ends Constructor

  //###[ INIT/LOADER FUNCTIONS ]########################################
  initVizVals(){
    this.fill_bbox = color(0,60,255,64);
    this.fill_text = color(255,192);
    this.fill_mAct = color(255); 
    this.strk_mAct = color(255,128);
  } // Ends Function initVizVals

  //###[ GETTER/TESTER FUNCTIONS ]######################################
  mouseOverMe(){return (mouseX>this.pos.x)&&(mouseY>this.pos.y)&&(mouseX<this.endP.x)&&(mouseY<this.endP.y);}
  mousePressedOverMe(){return mouseIsPressed && this.mouseOverMe();}
} // Ends 'Abstract' Class PZUIObject


/*======================================================================
|>>> [Abstract] Class CharButton
+=====================================================================*/
class CharButton extends PZUIObject{
  constructor(pos, dim, char){
    super(pos, dim);
    this.symb = char;
  } // Ends Constructor

  bindAction(act){this.action = act; return this;}
  onMousePressed(){if(mouseIsPressed && this.mouseOverMe() && this.action){this.action();}}

  render(){
    textAlign(CENTER,CENTER); this.renderBBox(); this.renderChar(); 
    if(this instanceof ButtonCharLabel){this.renderLabel();}
  } // Ends Function render

  renderBBox(){
    fill(this.fill_bbox); noStroke(); rect(this.pos.x,this.pos.y,this.dim.x,this.dim.y);
    if(this.mouseOverMe()){stroke(this.strk_mAct); strokeWeight(4); rect(this.pos.x+2,this.pos.y+2,this.dim.x-4,this.dim.y-4);}   
  } // Ends Function renderBBox
} // Ends 'Abstract' Class CharButton


/*======================================================================
|>>> Class ButtonCharOnly
+=====================================================================*/
class ButtonCharOnly extends CharButton{
  constructor(pos, dim, char){
    super(pos, dim, char);
    this.yOff = 4;
  } // Ends Constructor

  renderChar(){
    textAlign(CENTER,CENTER); textSize(64); noStroke(); fill(this.fill_text);
    if(this.mousePressedOverMe()){fill(this.fill_mAct); strokeWeight(4); stroke(this.strk_mAct);}  
    text(this.symb, this.midP.x, this.midP.y+this.yOff);
  } // Ends Function renderChar
} // Ends Class ButtonCharOnly


/*======================================================================
|>>> Class ButtonCharLabel
+=====================================================================*/
class ButtonCharLabel extends CharButton{
  constructor(pos, dim, char, labl){
    super(pos, dim, char);
    this.midP.y -= this.dim.y*0.15;
    this.yOff  = 48;
    this.xOff  = 0;
    this.label = labl;
  } // Ends Constructor

  renderChar(){
    textSize(64); noStroke(); fill(this.fill_text);
    if(this.mousePressedOverMe()){fill(this.fill_mAct); strokeWeight(4); stroke(this.strk_mAct);}  
    text(this.symb, this.midP.x, this.midP.y);
  } // Ends Function renderChar

  renderLabel(){
    textSize(16); stroke(this.fill_text); strokeWeight(0.5); fill(this.fill_text);
    if(this.mousePressedOverMe()){fill(this.fill_mAct); strokeWeight(2); stroke(this.strk_mAct);}  
    text(this.label, this.midP.x+this.xOff, this.midP.y+this.yOff);
  } // Ends Function renderLabel
} // Ends Class ButtonCharLabel


/*======================================================================
|>>> Class UILabel
+=====================================================================*/
class UILabel extends PZUIObject{
  constructor(pos, dim, labTxt=""){
    super(pos,dim);
    this.label = labTxt;
    this.cBack = null;
    this.yOff  = 0;
    this.fill_bbox.setAlpha(128);
  } // Ends Constructor

  bindCallback(cBack){
    this.cBack = cBack;
    this.label = this.cBack();
    return this;
  } // Ends Function bindCallback

  update(){if(this.cBack){this.label = this.cBack();}}

  render(){
    fill(this.fill_bbox); noStroke(); rect(this.pos.x,this.pos.y,this.dim.x,this.dim.y);
    if(this.mouseOverMe()){rect(this.pos.x,this.pos.y,this.dim.x,this.dim.y); fill(this.fill_mAct);} else{fill(this.fill_text);}
    textSize(16); stroke(this.fill_text); strokeWeight(0.5); text(this.label, this.midP.x, this.midP.y+this.yOff);
  }
} // Ends Class UILabel