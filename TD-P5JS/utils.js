/*======================================================================
|>>> UTILS
+=======================================================================
| Description: Contains misc. (yet useful) functions and other resources 
|              that are too small to be in their own source files and/or
|              object classes. If you find yourself needing to implement
|              a small util method or whatnot: be sure to look at this 
|              file BEFORE doing so... it may already exist here! Also: 
|              contents are ordered/grouped as best as possible (i.e. 
|              functions for vector producing, debug viz/console, etc.)
*=====================================================================*/


/*----------------------------------------------------------------------
|>>> Wrapper Classes (Older Version - but KISS 'to-the-build')
+---------------------------------------------------------------------*/
class Bool{
  constructor(val=false){this.val = val;}
  eval(){return this.val;}
  toggle(){this.val = !this.val;}
}

class Integer{
  constructor(val=0){this.val = val;}
  set(val){this.val = val;}
  inc(i=1){this.val += i;}
  dec(i=1){this.val -= i;}
}

class BuyItem{
  constructor(name,cost){this.name = name; this.cost = cost;}
  canAfford(){return (this.cost <= int_money.val);}
}


/*----------------------------------------------------------------------
|>>> Canvas [Debug] Display Utils
+-----------------------------------------------------------------------
| Implementation Notes:
|  > 'CHair' = Crosshair (i.e. 2 midpoint lines x and y axis parallel)
|  > Order of lines in 'db_drawCHair()' is  [horizontal ; vertical]
+---------------------------------------------------------------------*/
function db_drawRect(x,y,wide,tall,sCol,fCol=null,lWgt=4){stroke(sCol); strokeWeight(lWgt); (fCol)?fill(fCol):noFill(); rect(x,y,wide,tall);}
function db_drawCHair(x,y,w,t,sCol=null,lWgt=4){strokeWeight(lWgt); (sCol)?stroke(sCol):stroke(255,0,255,128); let xH = x+(w/2); let yH = y+(t/2); line(x,yH,x+w,yH); line(xH,y,xH,y+t);}
function db_drawFullCanv(){db_drawRect(0,0,width,height,color(60));db_drawCHair(0,0,width,height,color(255,60,0,64));}
function db_drawSubCanvs(){db_drawGameSubCanv();db_drawMenuSubCanv();}
function db_drawGameSubCanv(){db_drawRect(0,0,worldWide,worldTall,color(60),color(255,60,0,8)); db_drawCHair(0,0,worldWide,worldTall,color(255,60,0,64));}
function db_drawMenuSubCanv(){db_drawRect(worldWide,0,menuWide,height,color(60),color(0,60,255,8)); db_drawCHair(worldWide,0,menuWide,height,color(0,60,255,64));}

function db_drawTextSimple(txt){textSize(32);textAlign(CENTER,CENTER);stroke(64,64);strokeWeight(4);fill(255);text(txt,width/2,height-32);}

function drawFPSSimple(blurb="FPS: "){textSize(32); textAlign(LEFT,CENTER); stroke(0); strokeWeight(4); fill(255); text(blurb+round(frameRate()), 12, height-15);}
function fpsBlurbToString(){return "FPS: "+round(frameRate());}


/*----------------------------------------------------------------------
|>>> Mouse-Related Utils
+---------------------------------------------------------------------*/
function mouseInCanvas(){return(mouseX>0)&&(mouseY>0)&&(mouseX<width)&&(mouseY<height);}
function mouseInGWindow(){return(mouseX>0)&&(mouseY>0)&&(mouseX<worldWide)&&(mouseY<height);}
function mouseInSidebar(){return(mouseX>worldWide)&&(mouseY>0)&&(mouseX<width)&&(mouseY<height);}

function mousePtToVec(){return createVector(mouseX, mouseY);}

function dispMousePlaceCell(){
  if(!mouseInCanvas() || manager.gameMode == GameManager.MODES.IDLE){return;}
  let mPos = mousePtToVec(); let cPos = map.coordToTopLeftPos(map.posToCoord(mPos));
  strokeWeight(2); noFill();
  switch (manager.gameMode){
    case GameManager.MODES.PLACE_BLDG: (map.isVacant2(map.posToCoord(mPos))) ? stroke(255) : stroke(255,0,0); break;
    case GameManager.MODES.PLACE_UNIT: (map.isEnemyPathCell2(map.posToCoord(mPos))) ? stroke(255) : stroke(255,0,0); break;
  }
  push();translate(cPos.x,cPos.y);line(0,32,32,0);line(0,16,16,0);line(0,64,64,0);line(0,48,48,0);line(16,64,64,16);line(32,64,64,32);line(48,64,64,48);pop();
} // Ends Function dispMousePlaceCell


/*----------------------------------------------------------------------
|>>> Vector Creation Utils
+---------------------------------------------------------------------*/
function randCanvasPt(){return vec2(int(random(qtSqPixels)),int(random(qtSqPixels)));}
function vec2(x=0,y=0){return createVector(x,y);}


/*----------------------------------------------------------------------
|>>> UTILS FOR UNIT AND BLDG CLASS (AND OPS RELATED THERETO)
|      > TODO: Put these in their respective source files? (i.e. unit.js
|        and {tower.js xor weapon.js WLOG})
+---------------------------------------------------------------------*/
function unitKeyToUIName(key){
  switch(key){
    case "STD_1": return "ST Type 1";
    case "STD_2": return "ST Type 2";
    case "STD_3": return "ST Type 3";
    case "STD_4": return "ST Type 4";
    case "STD_5": return "ST Type 5";
    case "STD_6": return "ST Type 6";
    case "STD_7": return "ST Type 7";
    case "STD_8": return "ST Type 8";
  }
}
