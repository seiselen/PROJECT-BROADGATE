


var PZUtilButtons = {};
var PZUtilConfig = {trans:{x:0, y:0}, scale:{idx:3, fac:-1, vals:[0.125, 0.25, 0.5, 1, 2, 4, 8, 16]}};
PZUtilConfig.scale.fac = PZUtilConfig.scale.vals[PZUtilConfig.scale.idx];

///*>>> UNCOMMENT ONLY WHEN SERVER IS TURNED ON!
var ImageDisp = {gridEIS:null, gridUV:null, display:function(i,x,y,w=-1,t,d=null){switch(w==-1){case true: image(this[i],x,y);return; case false: image(this[i],x,y,w,t);}}}
function preload(){ImageDisp.gridEIS = loadImage('testGrid.png'); ImageDisp.gridUV = loadImage('testGridUV.png');}
//*/

function setup(){
  createCanvas(1280,768).parent("viz");
  textFont('Arial');
  initPZUtilButtons();


}



function draw(){

  //>>> RENDER CALLS 
  background("#181818FF");
  drawCanvasBorder();
  //drawGrid(32,"#FFFFFF80",1);
  //drawCanvasCrosshair();

  push();drawViaPZTransform();pop();


    scale(PZUtilConfig.scale.fac, PZUtilConfig.scale.fac);

    //>>> RENDER CALLS (PZ-INDEPENDENT [PRE-T'FORM])

    noFill(); stroke(255); ellipse(0,0,100,100);

    ImageDisp.display('gridUV',0,0,1280,768);

  //>>> RENDER CALLS (PZ-INDEPENDENT [POST-T'FORM])

  PZUtilButtons.array.forEach((b)=>b.render());
}


//>>> !!! PROGRESS ENDING 9/20/21 !!! <<<
function drawViaPZTransform(){
  //>>> EFFECT PZ TRANSFORM
  scale(PZUtilConfig.scale.fac, PZUtilConfig.scale.fac);

  //>>> RENDER CALLS (PZ-INDEPENDENT [PRE-T'FORM])

  noFill(); stroke(255); ellipse(0,0,100,100);

  ImageDisp.display('gridUV',0,0,1280,768);
}






function mousePressed(){
  return false;
}




function initPZUtilButtons(){
  let len   = 64;
  let lenH  = len/2;
  let mpt   = canvasMidpoint();
  let b_dim = vec2(len,len);

  let vals = {
    arrow_N:  {char:String.fromCharCode(0x2B06), dim:vec2(b_dim.x, b_dim.y), loc:vec2(mpt.x-lenH, 0)          },
    arrow_S:  {char:String.fromCharCode(0x2B07), dim:vec2(b_dim.x, b_dim.y), loc:vec2(mpt.x-lenH, height-len) },
    arrow_E:  {char:String.fromCharCode(0x2B95), dim:vec2(b_dim.x, b_dim.y), loc:vec2(width-len, mpt.y-lenH)  },
    arrow_W:  {char:String.fromCharCode(0x2B05), dim:vec2(b_dim.x, b_dim.y), loc:vec2(0, mpt.y-lenH)          },
    arrow_NE: {char:String.fromCharCode(0x2B08), dim:vec2(b_dim.x, b_dim.y), loc:vec2(width-len, 0)           },
    arrow_SE: {char:String.fromCharCode(0x2B0A), dim:vec2(b_dim.x, b_dim.y), loc:vec2(width-len, height-len)  },
    arrow_NW: {char:String.fromCharCode(0x2B09), dim:vec2(b_dim.x, b_dim.y), loc:vec2(0, 0)                   },
    arrow_SW: {char:String.fromCharCode(0x2B0B), dim:vec2(b_dim.x, b_dim.y), loc:vec2(0, height-len)          },

    pan_orig: {char:String.fromCharCode(0x29C8), dim:vec2(b_dim.x*2, b_dim.y*2),   loc:vec2(mpt.x-len, mpt.y-len),    lab:"RESET PAN\nTO  ORIGIN" },
    zoom_in:  {char:String.fromCharCode(0x2A01), dim:vec2(b_dim.x*2, b_dim.y*1.5), loc:vec2(width-(len*2),(len)),     lab:"ZOOM IN"               },
    zoom_1x: {char:String.fromCharCode(0x2A00), dim:vec2(b_dim.x*2, b_dim.y*1.5), loc:vec2(width-(len*2),(len*2.5)), lab:"ZOOM RESET"            },
    zoom_out:  {char:String.fromCharCode(0x2296), dim:vec2(b_dim.x*2, b_dim.y*1.5), loc:vec2(width-(len*2),(len*4)),   lab:"ZOOM OUT"              }
  };

  Object.keys(vals).filter((k)=>(k[0]=='a')).forEach((k)=>{PZUtilButtons[k] = new CharBBoxNoLabel(vals[k].loc, vals[k].dim, vals[k].char)});
  Object.keys(vals).filter((k)=>(k[0]!='a')).forEach((k)=>{PZUtilButtons[k] = new CharBBoxWithLabel(vals[k].loc, vals[k].dim, vals[k].char, vals[k].lab)});


  PZUtilButtons.array = Object.values(PZUtilButtons);
} // Ends Function initPZUtilButtons





/*======================================================================
|>>> CharBBox Class Group
+=====================================================================*/

/*abstract */ class CharBBox{
  constructor(pos,dim,char){
    this.pos  = pos;
    this.dim  = dim;
    this.dimH = p5.Vector.div(this.dim,2);
    this.midP = p5.Vector.add(this.pos,this.dimH);
    this.endP = p5.Vector.add(this.pos,this.dim);
    this.symb = char;
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

  //###[ SETTER/BEHAVIOR FUNCTIONS ]####################################
  bindAction(act){this.action = act; return this;}
  onMousePressed(){if(mouseIsPressed && this.mouseOverMe() && this.action){this.action();}}

  //###[ RENDER FUNCTIONS ]#############################################
  render(){
    textAlign(CENTER,CENTER); this.renderBBox(); this.renderChar(); 
    if(this instanceof CharBBoxWithLabel){this.renderLabel();}
  } // Ends Function render

  renderBBox(){
    fill(this.fill_bbox); noStroke(); rect(this.pos.x,this.pos.y,this.dim.x,this.dim.y);
    if(this.mouseOverMe()){stroke(this.strk_mAct); strokeWeight(4); rect(this.pos.x+2,this.pos.y+2,this.dim.x-4,this.dim.y-4);}   
  } // Ends Function renderBBox
} // Ends 'Abstract' Class CharBBox

class CharBBoxNoLabel extends CharBBox{
  constructor(pos,dim,char){
    super(pos,dim,char);
    this.yOff = 4;
  } // Ends Constructor

  //###[ RENDER FUNCTIONS ]#############################################
  renderChar(){
    textAlign(CENTER,CENTER); textSize(64); noStroke(); fill(this.fill_text);
    if(this.mousePressedOverMe()){fill(this.fill_mAct); strokeWeight(4); stroke(this.strk_mAct);}  
    text(this.symb, this.midP.x, this.midP.y+this.yOff);
  } // Ends Function renderChar
} // Ends Class CharBBoxNoLabel

class CharBBoxWithLabel extends CharBBox{
  constructor(pos,dim,char,labl){
    super(pos,dim,char);
    this.midP.y -= this.dim.y*0.15;
    this.yOff  = 48;
    this.label = labl;
  } // Ends Constructor

  //###[ RENDER FUNCTIONS ]#############################################
  renderChar(){
    textSize(64); noStroke(); fill(this.fill_text);
    if(this.mousePressedOverMe()){fill(this.fill_mAct); strokeWeight(4); stroke(this.strk_mAct);}  
    text(this.symb, this.midP.x, this.midP.y);
  } // Ends Function renderChar

  renderLabel(){
    textSize(16); stroke(this.fill_text); strokeWeight(1.25); fill(this.fill_text);
    if(this.mousePressedOverMe()){fill(this.fill_mAct); strokeWeight(2); stroke(this.strk_mAct);}  
    text(this.label, this.midP.x, this.midP.y+this.yOff);
  } // Ends Function renderLabel
} // Ends Class CharBBoxWithLabel