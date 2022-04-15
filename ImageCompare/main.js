/*----------------------------------------------------------------------
|>>> SYNTAX/FORMAT NOTES - SINGLE TEXTURE REQUEST LIST:
|
| (1) Entries utilize an array[3] composed of {<name>, <subDir>, <dims>}
|     such that:
|      # <name> is the name of the image;
|      # <subDir> is either [null] if within [filePath], xor name of the
|        subdirectory directory therebelow containing the image
|      # <dims> is either an int[2]=>[wide, tall] with custom dimensions
|        for the TexSlotage (i.e. resolution by which it displays bound
|        item) xor [null] if TexSlot dimensions should MATCH bound item
+-----------------------------------------------------------------------
|>>> SYNTAX/FORMAT NOTES - ANIMATED TEXTURE REQUEST LIST:
|
| (1) Entries use an array[5] composed of {<pfix>, <stSfix>, <endSfix>,
|     <subDir>, <dims>, <speed>} such that:
|      # <pfix> is the prefix common to all frames of the anim. texture;
|      # <stSfix>/<endSfix> are the suffixes of the first/last frames of
|        the animated texture, respectively;
|      # <subDir> is either [null] if the images are in [filePath], else
|        the name of a subdirectory located directly therebelow;
|      # <dims> is either an int[2]=>[wide, tall] for the dimensions of
|        of the TexSlot containing the images (i.e. resolution by which
|        it displays bound animated texture); xor [null] if such should
|        MATCH that of the images it contains. 
|      # <speed> is either [undefined] (i.e. keep default [deltaSpeed] 
|        value as assigned in the constructor), else custom speed as an
|        int of range [1,...] s.t.   higher values => lower speed.
| (2) The first three elements will be passed as input into a call of 
|     <getAnimNamesList> to produce remaining individual names of the
|     sequence of component images; while if the 4th element is not an
|     empty string, images will be loaded WRT "/filePath/subDir/".
+---------------------------------------------------------------------*/
var imgList = [
  {name:"CLOSED"       , subDir:null, dims:null}, 
  {name:"CMPST641"     , subDir:null, dims:null}, 
  {name:"CMPST642"     , subDir:null, dims:null}, 
  {name:"COM0"         , subDir:null, dims:null},
  {name:"COMP_N06 (2)" , subDir:null, dims:null},
];

var animList = [
  {pfix:"MOON",   stSfix:1,  endSufx:30, subDir:"MOON/",    dims:[64,64],  speed:4,         namesList:[]},
  {pfix:"TV",     stSfix:1,  endSufx:4,  subDir:"anim TV/", dims:null,     speed:undefined, namesList:[]},
  {pfix:"F1_0",   stSfix:1,  endSufx:4,  subDir:"anim F1/", dims:[128,64], speed:undefined, namesList:[]},
  {pfix:"DOSLVR", stSfix:11, endSufx:14, subDir:null,       dims:[64,128], speed:undefined, namesList:[]},
  {pfix:"DOSLVR", stSfix:21, endSufx:24, subDir:null,       dims:[64,128], speed:undefined, namesList:[]},
]


//######################################################################
//>>> IMPLEMENTATION CODE FOLLOWS...
//######################################################################
var Config = {
  canvWide: 1280, 
  canvTall:  896,
  snapDim :   16,

  //> [CLUSTER] mode config ops
  toggleRenderBBoxIfNotSel : function(){Config.renderBBoxIfNotSel = !Config.renderBBoxIfNotSel;},
  renderBBoxIfNotSel : false,
};



var scaleFactor = {x:2, y:2};
var transFactor = {x:0, y:0};
var BGColors    = [[180,0,180,255],[0,255,0,255],[24,255],[255,255]];
var curBGCol    = 2; // [ Magenta | Green | Black | White ]
var GridModes   = 4;
var curGridMode = 3; // [ none | 16sq | 32sq | 16sq and 32sq ]
var OpModes     = {COMPARE:0, CLUSTER:1};
var curOpMode   = 1;
var compSlider  = null;
var texSlots    = [];
let images      = {};

var filePath    = "../Via Other Mods/TEXTURES AND FLATS/COMP/";

var imgNameL    = "COMP_15.png";
var imgNameR    = "COMP_15J.png";




function preload() {
  switch(curOpMode){
    case OpModes.COMPARE: 
      loadImage(filePath+imgNameL, img => {onImageLoaded(img, imgNameL)});
      loadImage(filePath+imgNameR, img => {onImageLoaded(img, imgNameR)});
      return;

    case OpModes.CLUSTER: 
      if(imgList.length==0){break;}

      imgList.forEach(imgReq=> {loadImage(filePath+imgReq.name+".png", img => {onImageLoaded(img, imgReq.name)})} );

      if(animList.length==0){break;}

      let tempList;
      let locPath;
      animList.forEach(aTx=>{
        tempList = getAnimNamesList(aTx.pfix, aTx.stSfix, aTx.endSufx);
        locPath  = (aTx.subDir && aTx.subDir.length>0) ? aTx.subDir : "";
        tempList.forEach(name=> {
          loadImage(filePath+locPath+name+".png", img => {onImageLoaded(img, name)});
          aTx.namesList.push(name);
        })
      });
      return;
  }
}



function setup(){
  createCanvas(Config.canvWide, Config.canvTall).parent("viz");

  scaleFactor = vec2(scaleFactor.x, scaleFactor.y);
  transFactor = vec2(transFactor.x, transFactor.y);

  switch(curOpMode){
    case OpModes.COMPARE: setup_modeCompare(); break;
    case OpModes.CLUSTER: setup_modeCluster(); break;
  }
}

function setup_modeCompare(){
  imageMode(CENTER);
  transFactor.x = Config.canvWide/2;
  transFactor.y = Config.canvTall/2;
  compSlider = new CompareSlider();  
}



function setup_modeCluster(){
  imageMode(CORNER);

  let xOff = 64; let xGap = 32; let xDelta  = 0;
  let yOff = 64; let yGap = 32; let yDelta  = 0;

  let curName = "";
  let tempItem = null;

  imgList.forEach(imgReq=>{
    curName = imgReq.name;
    if(imgReq.dims==null){xDelta=images[curName].wide; yDelta=images[curName].tall;}
    else{xDelta=imgReq.dims[0]; yDelta=imgReq.dims[1];}
    addNewTexSlot(xOff, yOff, xDelta, yDelta).bindItem(images[curName]);

    xOff+=(xDelta+xGap);
  });

  yOff += 160;
  xOff  = 64;

  animList.forEach(animReq=>{
    if(animReq.dims==null){xDelta=images[animReq.namesList[0]].wide; yDelta=images[animReq.namesList[0]].tall;}
    else{xDelta=animReq.dims[0]; yDelta=animReq.dims[1];}
    tempItem = new AnimStruct().addFramesViaNames(animReq.namesList);
    if(animReq.speed!=undefined){tempItem.setDeltaSpeed(animReq.speed);}
    addNewTexSlot(xOff, yOff, xDelta, yDelta).bindItem(tempItem);

    xOff+=(xDelta+xGap);
  });
}




function draw_modeCompare(){
  //>>> UPDATE CALLS

  //>>> RENDER CALLS
  background(BGColors[curBGCol]);
  drawCanvasBorder();

  renderGridWRTMode();

  push();
  translate(transFactor.x,transFactor.y);
  scale(scaleFactor.x,scaleFactor.y);

  if(images[imgNameL]&&images[imgNameR]){
    //     let sliderOffset = ((compSlider.sliderPos.x-(Config.canvWide/2))+(images[imgNameL].wide))/scaleFactor.x;
    let sliderOffset = ((compSlider.sliderPos.x-(width/2))+(images[imgNameL].wide))/scaleFactor.x;

    sliderOffset = constrain(sliderOffset,1,images[imgNameL].wide);
    image(images[imgNameR].image, 0, 0, images[imgNameL].wide, images[imgNameL].tall, 0, 0, images[imgNameL].wide, images[imgNameL].tall);

    image(images[imgNameL].image,
      /* dest */ (sliderOffset/scaleFactor.x)-(images[imgNameL].wide/scaleFactor.x),  0, sliderOffset, images[imgNameL].tall, 
      /* sorc */ 0, 0, sliderOffset, images[imgNameL].tall
    );

  }

  pop();
  compSlider.render();
  drawFPS();
}




function draw_modeCluster(){
  //>>> UPDATE CALLS
  texSlots.forEach(slot=>{if(slot.item instanceof AnimStruct){slot.item.advance()}});
  //>>> RENDER CALLS
  background(BGColors[curBGCol]);
  drawCanvasBorder();
  renderGridWRTMode();

  push();
  translate(transFactor.x,transFactor.y);
  scale(scaleFactor.x,scaleFactor.y);

  if(mouseInCanvas()){texSlots.forEach(slot=>slot.onMouseHover(getModMouseVec()))};

  texSlots.forEach(slot=>slot.render());

  pop();

  drawFPS();
  drawMouseCoordsSnapDim();
}




function draw(){
  //> GLOBAL {IO} calls
  mouseDown(); keyOrKeysDown();
  //> PER-MODE {IO/Update/Render} calls
  switch(curOpMode){
    case OpModes.COMPARE: draw_modeCompare(); break;
    case OpModes.CLUSTER: draw_modeCluster(); break;
  }
}


function mouseDown(){
 if(!mouseIsPressed){return;}
}


function keyOrKeysDown(){
  if(!keyIsPressed){return;}
  if(keyIsDown(UP_ARROW)){transFactor.y-=2;}
  if(keyIsDown(DOWN_ARROW)){transFactor.y+=2;}
  if(keyIsDown(LEFT_ARROW)){transFactor.x-=2;}
  if(keyIsDown(RIGHT_ARROW)){transFactor.x+=2;}

}



function mousePressed(){
  if(mouseInCanvas() && mouseButton === LEFT){
    switch(curOpMode){
      case OpModes.COMPARE: compSlider.onMousePressed(getModMouseVec()); break;
      case OpModes.CLUSTER: texSlots.forEach(slot=>slot.onMousePressed(getModMouseVec())); break;
    }
  }
}


function mouseDragged(){
  if(mouseInCanvas() && mouseButton === LEFT){
    switch(curOpMode){
      case OpModes.COMPARE: compSlider.onMouseDragged(getModMouseVec()); break;
      case OpModes.CLUSTER: texSlots.forEach(slot=>slot.onMouseDragged(getModMouseVec())); break;
    }
  }
}


function mouseReleased(){
  switch(curOpMode){
    case OpModes.COMPARE: compSlider.onMouseReleased(); break;
    case OpModes.CLUSTER: texSlots.forEach(slot=>slot.onMouseReleased()); break;
  }
}


function mouseWheel(event) {
  changeScaleFactor(-Math.sign(event.delta));
}


function keyPressed(){
  if(key=='g'){iterCurGridMode();}
  if(key=='c'){iterCurBGMode();}
}

function iterCurBGMode(){curBGCol = (curBGCol+1)%BGColors.length;}

function iterCurGridMode(){curGridMode = (curGridMode+1)%GridModes;}

function onImageLoaded(i,n){images[n] = new ImgStruct(i,n);}

function changeScaleFactor(sign){scaleFactor.x = (sign>0) ? min(8, scaleFactor.x*2) : (sign<0) ? max(1, scaleFactor.x*0.5) : scaleFactor.x; scaleFactor.y = scaleFactor.x;}

function addNewTexSlot(posX,posY,wide,tall){let texSlot = new TexSlot(vec2(posX,posY),wide,tall); texSlots.push(texSlot); return texSlot;}

function getModMouseVec(){let ret = mousePtToVec().sub(transFactor).div(scaleFactor.x); return ret;}



/*----------------------------------------------------------------------
|>>> Function getAnimNamesList
+-----------------------------------------------------------------------
| SCHEMA/ALGO:
|  > currently expecting common prefix followed by individual suffix of
|    either char in range ['A',...,'Z'] xor int suffix
|  > currently expecting strictly increasing sequence
|  
|  > if pI is an int i.e. [2] i.e. isNaN(pI)=>[false], then:
|    > if it or pQ is above 10, then need to call nf(<int>,2,0)
|    > analogous scenario if either is above 100 WRT nf(<int>,3,0)
|    > can then spit out vals using for loop
|  
|  > elseif pI is a char i.e. 'A' is isNaN(pI)=>[true], then:
|    > determine #frames between pI and pQ; i.e. diff('A','D')=>[4]
|    > can then use for loop via char(unchar(pI)+i) to spit out vals
+---------------------------------------------------------------------*/
var alphList = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
function getAnimNamesList(prefx, pI, qI){
  let names = [];
  let totFrames = -1;

  if(isNaN(pI)){
    let stIdx = alphList.indexOf(pI);
    let fnIdx = alphList.indexOf(qI);
    totFrames = (fnIdx-stIdx)+1;
    for (let i=0; i<totFrames; i++){names.push(prefx+alphList[stIdx+i]);}
  }
  else{
    let nfVal = (pI>99 || qI>99) ? 3 : (pI>9 || qI>9) ? 2 : 1;
    totFrames = (qI-pI)+1
    for (let i=0; i<totFrames; i++){names.push(prefx+nf(pI+i,nfVal,0));}
  }
  return names;
}


function renderGridWRTMode(){
  switch(curGridMode){
    case 0: return;
    case 1: drawGrid(16,"#FF780040"); return;
    case 2: drawGrid(32,"#FFFFFF40"); return;
    case 3: drawGrid(16,"#FF780040"); drawGrid(32,"#FFFFFF40"); return;
  }
}

function drawMouseCoords(){
  // Draw Semi-Transparent Background Rect
  noStroke(); fill(0,128); rectMode(CORNER); rect(100,height-32,240,32);
  // Draw Text displaying the current FPS (rounded down to nearest int)
  textSize(18); textAlign(LEFT,CENTER); strokeWeight(2); stroke(0); fill(255);

  switch(mouseInCanvas()){
    case true:  text("Mouse Coords: ("+round(mouseX)+","+round(mouseY)+")", 108, height-14); return;
    case false: text("Mouse Coords: (N/A)", 108, height-14); return;
  }
}

function drawMouseCoordsSnapDim(){
  // Draw Semi-Transparent Background Rect
  noStroke(); fill(0,128); rectMode(CORNER); rect(100,height-32,240,32);
  // Draw Text displaying the current FPS (rounded down to nearest int)
  textSize(18); textAlign(LEFT,CENTER); strokeWeight(2); stroke(0); fill(255);

  switch(mouseInCanvas()){
    case true:  text("Mouse Coords: ("+(round(mouseX/Config.snapDim)*Config.snapDim)+","+(round(mouseY/Config.snapDim)*Config.snapDim)+")", 108, height-14); return;
    case false: text("Mouse Coords: (N/A)", 108, height-14); return;
  }
}