

var CanvConfig = {WIDE:1280, TALL:768};
CanvConfig.H_WIDE = CanvConfig.WIDE/2;
CanvConfig.H_TALL = CanvConfig.TALL/2;

var PZUtilButtons = {};
var PZUtilLabels  = {};
var PZUtilConfig = {
  trans:{x:0, y:0, delta:4}, 
  scale:{factor:1, min:0.05, max:16, delta:0.05},

  onArrowButtonPressed(dir){
    switch(dir){
      case 'N' : this.trans.y += this.trans.delta; break;
      case 'S' : this.trans.y -= this.trans.delta; break;
      case 'E' : this.trans.x -= this.trans.delta; break;
      case 'W' : this.trans.x += this.trans.delta; break;
      case 'NE': this.trans.x -= this.trans.delta; this.trans.y += this.trans.delta; break;
      case 'SE': this.trans.x -= this.trans.delta; this.trans.y -= this.trans.delta; break;
      case 'NW': this.trans.x += this.trans.delta; this.trans.y += this.trans.delta; break;
      case 'SW': this.trans.x += this.trans.delta; this.trans.y -= this.trans.delta; break;
      case 'RO': this.trans.x  = 0;                this.trans.y  = 0; break;
    }
  },

  onZoomButtonPressed(dir){
     switch(dir){
      case '+' : this.scale.factor = Math.min(this.scale.max, Math.round((this.scale.factor+=this.scale.delta)*100)/100); break;
      case '-' : this.scale.factor = Math.max(this.scale.min, Math.round((this.scale.factor-=this.scale.delta)*100)/100); break;
      case '1' : this.scale.factor = 1; break;
    }
  },

  reverseControls(){this.trans.delta *= -1;},
  transValToString(){return "PAN OFFSET: ("+this.trans.x+","+this.trans.y+")";},
  scaleValToString(){return "SCALE FACTOR: ["+this.scale.factor+"x]";}
};
PZUtilConfig.onZoomButtonPressed('1');

///*>>> UNCOMMENT ONLY WHEN SERVER IS TURNED ON!
var ImageDisp = {gridEIS:null, gridUV:null, display:function(i,x,y,w=-1,t,d=null){imageMode(CENTER,CENTER);switch(w==-1){case true: image(this[i],x,y);return; case false: image(this[i],x,y,w,t);}}}
function preload(){ImageDisp.gridEIS = loadImage('testGridEIS_dark.png'); ImageDisp.gridUV = loadImage('testGridUV_dark.png');}
//*/

function setup(){
  createCanvas(CanvConfig.WIDE,CanvConfig.TALL).parent("viz");
  textFont('Arial'); textStyle(BOLD);
  initPZUtilButtons();
  initPZUtilLabels();
}



function draw(){

  //>>> Pre-Transform Update Calls for PZUtil Objects
  handleKeyDown();  
  if(mouseInCanvas()){
    handleMouseDown();
    PZUtilLabels.array.forEach((l)=>l.update())
  };

  //====================================================================
  //>>> RENDER CALLS
  //====================================================================

  // Pre-Transform Canvas Util Calls
  background("#181818FF");
  drawCanvasBorder();
  drawGrid(32,"#FFFFFF80",1);

  // On-Transform Render Calls
  push();drawViaPZTransform();pop();

  //>>> Post-Transform Render Calls for PZUtil UIObjects
  if(mouseInCanvas()){
    PZUtilButtons.panButtons.forEach((b)=>b.render());
    PZUtilButtons.zoomButtons.forEach((b)=>b.render());
    PZUtilLabels.array.forEach((l)=>l.render());
  };

}


function drawViaPZTransform(){
  //>>> EFFECT PZ TRANSFORM
  translate(PZUtilConfig.trans.x+CanvConfig.H_WIDE, PZUtilConfig.trans.y+CanvConfig.H_TALL);
  scale(PZUtilConfig.scale.factor, PZUtilConfig.scale.factor);

  //>>> RENDER CALLS (PZ-INDEPENDENT [PRE-T'FORM])
  //ImageDisp.display('gridEIS',0,0,1024,1024);
}




function handleMouseDown(){
  if(mouseInCanvas()&&mouseIsPressed){PZUtilButtons.panButtons.forEach((b)=>b.onMousePressed());}
}

function mousePressed(){
  if(mouseInCanvas()){PZUtilButtons.zoomButtons.forEach((b)=>b.onMousePressed());}
  return false;
}

function mouseWheel(evt){
  if(!mouseInCanvas()){return;}
  switch(Math.sign(evt.delta)){
    case  1: PZUtilConfig.onZoomButtonPressed('-'); return;
    case -1: PZUtilConfig.onZoomButtonPressed('+'); return;
  }
}

function handleKeyDown(){
  if(keyIsDown(UP_ARROW))   {PZUtilConfig.onArrowButtonPressed('N');}
  if(keyIsDown(DOWN_ARROW)) {PZUtilConfig.onArrowButtonPressed('S');}
  if(keyIsDown(LEFT_ARROW)) {PZUtilConfig.onArrowButtonPressed('W');}
  if(keyIsDown(RIGHT_ARROW)){PZUtilConfig.onArrowButtonPressed('E');}

}

function keyPressed(){
  if(key=='z'){PZUtilConfig.onZoomButtonPressed('+');}
  if(key=='x'){PZUtilConfig.onZoomButtonPressed('-');}
  if(key=='c'){PZUtilConfig.onZoomButtonPressed('1');}
  if(key=='0'){PZUtilConfig.onArrowButtonPressed('RO');}
  if(key=='r'){PZUtilConfig.onZoomButtonPressed('1'); PZUtilConfig.onArrowButtonPressed('RO');}  
}






function initPZUtilButtons(){
  let len  = 64;
  let lenH = len/2;
  // endpoint offsets
  let epX  = width-len;
  let epY  = height-len;
  let epX2 = width-(len*2);
  // midpoint offsets
  let mpX  = (width/2)-lenH;
  let mpY  = (height/2)-lenH;
  let mpX2 = (width/2)-len;
  let mpY2 = (height/2)-len;    

  let vals = {
    arrow_N:  {char:String.fromCharCode(0x2B06), dim:vec2(len, len), loc:vec2(mpX, 0)   },
    arrow_S:  {char:String.fromCharCode(0x2B07), dim:vec2(len, len), loc:vec2(mpX, epY) },
    arrow_E:  {char:String.fromCharCode(0x2B95), dim:vec2(len, len), loc:vec2(epX, mpY) },
    arrow_W:  {char:String.fromCharCode(0x2B05), dim:vec2(len, len), loc:vec2(0,   mpY) },
    arrow_NE: {char:String.fromCharCode(0x2B08), dim:vec2(len, len), loc:vec2(epX, 0)   },
    arrow_SE: {char:String.fromCharCode(0x2B0A), dim:vec2(len, len), loc:vec2(epX, epY) },
    arrow_NW: {char:String.fromCharCode(0x2B09), dim:vec2(len, len), loc:vec2(0,   0)   },
    arrow_SW: {char:String.fromCharCode(0x2B0B), dim:vec2(len, len), loc:vec2(0,   epY) },

    pan_orig: {char:String.fromCharCode(0x29C8), dim:vec2(len*2, len*2),   loc:vec2(mpX2, mpY2),     lab:"RESET PAN\nTO  ORIGIN" },
    zoom_in:  {char:String.fromCharCode(0x2A01), dim:vec2(len*2, len*1.5), loc:vec2(epX2,(len)),     lab:"INC. ZOOM"             },
    zoom_1x:  {char:String.fromCharCode(0x2A00), dim:vec2(len*2, len*1.5), loc:vec2(epX2,(len*2.5)), lab:"RESET ZOOM"            },
    zoom_out: {char:String.fromCharCode(0x2296), dim:vec2(len*2, len*1.5), loc:vec2(epX2,(len*4)),   lab:"DEC. ZOOM"             },
   
  };

  Object.keys(vals).filter((k)=>(k[0]=='a')).forEach((k)=>{PZUtilButtons[k] = new ButtonCharOnly(vals[k].loc, vals[k].dim, vals[k].char)});
  Object.keys(vals).filter((k)=>(k[0]!='a')).forEach((k)=>{PZUtilButtons[k] = new ButtonCharLabel(vals[k].loc, vals[k].dim, vals[k].char, vals[k].lab)});

  PZUtilButtons.panButtons = [
    PZUtilButtons.arrow_N.bindAction(()=>(PZUtilConfig.onArrowButtonPressed('N'))),
    PZUtilButtons.arrow_S.bindAction(()=>(PZUtilConfig.onArrowButtonPressed('S'))),
    PZUtilButtons.arrow_E.bindAction(()=>(PZUtilConfig.onArrowButtonPressed('E'))),
    PZUtilButtons.arrow_W.bindAction(()=>(PZUtilConfig.onArrowButtonPressed('W'))),
    PZUtilButtons.arrow_NE.bindAction(()=>(PZUtilConfig.onArrowButtonPressed('NE'))),
    PZUtilButtons.arrow_SE.bindAction(()=>(PZUtilConfig.onArrowButtonPressed('SE'))),
    PZUtilButtons.arrow_NW.bindAction(()=>(PZUtilConfig.onArrowButtonPressed('NW'))),
    PZUtilButtons.arrow_SW.bindAction(()=>(PZUtilConfig.onArrowButtonPressed('SW'))),
    PZUtilButtons.pan_orig.bindAction(()=>(PZUtilConfig.onArrowButtonPressed('RO')))
  ];

  PZUtilButtons.zoomButtons = [
    PZUtilButtons.zoom_in.bindAction(()=>(PZUtilConfig.onZoomButtonPressed('+'))),
    PZUtilButtons.zoom_1x.bindAction(()=>(PZUtilConfig.onZoomButtonPressed('1'))),
    PZUtilButtons.zoom_out.bindAction(()=>(PZUtilConfig.onZoomButtonPressed('-'))),
  ];
} // Ends Function initPZUtilButtons


function initPZUtilLabels(){
  let lenW = 256;
  let lenT = 32;
  let mptX = width/2;
  PZUtilLabels["pan"]   = new UILabel(vec2(mptX-32-lenW, 0), vec2(lenW, lenT), "PAN OFFSET: (123,456)").bindCallback(()=>PZUtilConfig.transValToString());
  PZUtilLabels["scale"] = new UILabel(vec2(mptX+32, 0), vec2(lenW, lenT), "SCALE FACTOR: [2]").bindCallback(()=>PZUtilConfig.scaleValToString());
  PZUtilLabels.array = Object.values(PZUtilLabels);
} // Ends Function initPZUtilLabels



/*======================================================================
|>>> CharUIObj Class Group
+=====================================================================*/

/*abstract*/ class UIObj{
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
} // Ends 'Abstract' Class UIObj


/*abstract*/ class CharButton extends UIObj{
  constructor(pos, dim, char){
    super(pos,dim);
    this.symb = char;
    this.initVizVals();
  } // Ends Constructor

  //###[ SETTER/BEHAVIOR FUNCTIONS ]####################################
  bindAction(act){this.action = act; return this;}
  onMousePressed(){if(mouseIsPressed && this.mouseOverMe() && this.action){this.action();}}

  //###[ RENDER FUNCTIONS ]#############################################
  render(){
    textAlign(CENTER,CENTER); this.renderBBox(); this.renderChar(); 
    if(this instanceof ButtonCharLabel){this.renderLabel();}
  } // Ends Function render

  renderBBox(){
    fill(this.fill_bbox); noStroke(); rect(this.pos.x,this.pos.y,this.dim.x,this.dim.y);
    if(this.mouseOverMe()){stroke(this.strk_mAct); strokeWeight(4); rect(this.pos.x+2,this.pos.y+2,this.dim.x-4,this.dim.y-4);}   
  } // Ends Function renderBBox
} // Ends 'Abstract' Class CharButton


class ButtonCharOnly extends CharButton{
  constructor(pos, dim, char){
    super(pos,dim,char);
    this.yOff = 4;
  } // Ends Constructor

  //###[ RENDER FUNCTIONS ]#############################################
  renderChar(){
    textAlign(CENTER,CENTER); textSize(64); noStroke(); fill(this.fill_text);
    if(this.mousePressedOverMe()){fill(this.fill_mAct); strokeWeight(4); stroke(this.strk_mAct);}  
    text(this.symb, this.midP.x, this.midP.y+this.yOff);
  } // Ends Function renderChar
} // Ends Class ButtonCharOnly


class ButtonCharLabel extends CharButton{
  constructor(pos, dim, char, labl){
    super(pos,dim,char);
    this.midP.y -= this.dim.y*0.15;
    this.yOff  = 48;
    this.xOff  = 0;
    this.label = labl;
  } // Ends Constructor

  //###[ RENDER FUNCTIONS ]#############################################
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


class UILabel extends UIObj{
  constructor(pos, dim, labTxt=""){
    super(pos,dim);
    this.label = labTxt;
    this.cBack = null;
    this.yOff  = 0;
    this.fill_bbox.setAlpha(128);
  } // Ends Constructor

  bindCallback(cBack){
    this.cBack = cBack;
    this.label  = this.cBack();
    return this;
  } // Ends Function bindCallback

  update(){
    if(this.cBack){this.label = this.cBack();}
  } // Ends Function update

  render(){
    fill(this.fill_bbox); noStroke(); rect(this.pos.x,this.pos.y,this.dim.x,this.dim.y);
    if(this.mouseOverMe()){rect(this.pos.x,this.pos.y,this.dim.x,this.dim.y); fill(this.fill_mAct);} else{fill(this.fill_text);}
    textSize(16); stroke(this.fill_text); strokeWeight(0.5); text(this.label, this.midP.x, this.midP.y+this.yOff);
  }
} // Ends Class UILabel