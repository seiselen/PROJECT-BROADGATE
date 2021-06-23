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

function drawFPSSimple(blurb="FPS: "){textSize(32); textAlign(LEFT,CENTER); stroke(0); strokeWeight(4); fill(255); text(blurb+round(frameRate()), 12, height-15);}


/*----------------------------------------------------------------------
|>>> Mouse-Related Utils
+---------------------------------------------------------------------*/
function mouseInCanvas(){return(mouseX>0)&&(mouseY>0)&&(mouseX<width)&&(mouseY<height);}
function mousePtToVec(){return createVector(mouseX, mouseY);}

/*----------------------------------------------------------------------
|>>> Vector Creation Utils
+---------------------------------------------------------------------*/
function randCanvasPt(){return vec2(int(random(qtSqPixels)),int(random(qtSqPixels)));}
function vec2(x=0,y=0){return createVector(x,y);}

