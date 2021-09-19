//======================================================================
//>>> Variables
//======================================================================
var slider; 
var sldTxt;

//> colorMapRaw_1 => diverg purpBlue<->yellow<->purpRed via colorbrewer
var colorMapRaw_1 = [[94,79,162],[50,136,189],[102,194,165],[171,221,164],[230,245,152],[253,174,97],[244,109,67],[213,62,79],[158,1,66]];

//> colorMapRaw_2 => yellows<->reds via colorbrewer
var colorMapRaw_2 = [[254,217,118],[254,178,76],[253,141,60],[252,78,42],[227,26,28],[189,0,38]];

//> colorMapRaw_3 => blues via colorbrewer
var colorMapRaw_3 = [[158,202,225],[107,174,214],[66,146,198],[33,113,181],[8,81,156],[8,48,107]];

//> make your choice HERE (and leave everything below procedural {i.e. AS-IS})
var colMap  = colorMapRaw_3;
var colMode = 1; // where {[0]:linear, [1]:logarithmic}


function setup(){
  createCanvas(800,160).parent("viz");
  slider = createSlider(0, 100, 50).style('width', '768px').parent("#ui");
  sldTxt = createSpan('100').parent("#ui");
}

function draw(){
  //>>> UPDATE CALLS
  updateUI(); // should be last as basically hybrid [update<->draw]
  //>>> RENDER CALLS
  background(255);
  drawCanvasBorder();
  drawColorBar(colMap,colMode);
  drawSlideValColor(colMap,colMode);
}

function updateUI(){sldTxt.html(slider.value());}

function drawColorBar(map,mode=0){
  let curCol; for(let i=0; i<100; i++){
    curCol = (mode==0) ? linMapCol(i,map) : logMapCol(i,map)
    fill(curCol); stroke(curCol); 
    rect(8*i,0,8,80);
  }
}

function drawSlideValColor(map,mode=0){
  let curCol = (mode==0) ? linMapCol(slider.value(),map) : logMapCol(slider.value(),map)
  fill(curCol); stroke(curCol); 
  rect(0,80,800,80);  
}

function linMapCol(val,map){
  let vKey = val/(100/(map.length-1)); //=> key of pct from which to 'colerp'
  let idxL = floor(vKey); //=> index of left color on raw map
  let idxR = ceil(vKey); //=> index of right color on raw map
  let lPct = vKey-floor(vKey); //=> % by which to lerp between L and R colors
  return lerpColor(color(map[idxL]), color(map[idxR]), lPct);
}

function logMapCol(val,map){
  val = min(((log(val+1)/log(10))*100)/2,100);
  let vKey = val/(100/(map.length-1)); //=> key of pct from which to 'colerp'
  let idxL = floor(vKey); //=> index of left color on raw map
  let idxR = ceil(vKey); //=> index of right color on raw map
  let lPct = vKey-floor(vKey); //=> % by which to lerp between L and R colors
  return lerpColor(color(map[idxL]), color(map[idxR]), lPct);
}



//======================================================================
//>>> 'The Usual' Util Functions
//======================================================================
function drawGrid(spacing=10,lineColor=null,lineThick=2){let numLinesH = int(height/spacing); let numLinesV = int(width/spacing); stroke((lineColor) ? lineColor : color(64,32)); strokeWeight(lineThick); for(let i=0; i<numLinesH; i++){line(0,spacing*i,width,spacing*i);} for(let i=0; i<numLinesV; i++){line(spacing*i,0,spacing*i,height);}}
function drawCanvasBorder(){stroke(60); strokeWeight(4); noFill(); rect(0,0,width,height);}
function drawCanvasCrosshair(x=0,y=0,w=width,h=height){stroke(255,60,0,64); strokeWeight(2); line(x,h/2,w,h/2); line(w/2,y,w/2,h);}
function drawFPSSimple(){textSize(18); textAlign(LEFT,CENTER); noStroke(); fill(60);text("FPS: "+nfs(frameRate(),2,2), 12, height-15);}
function mouseInCanvas(){return (mouseX > 0) && (mouseY > 0) && (mouseX < width) && (mouseY < height);}
function mousePtToVec(){return createVector(mouseX, mouseY);}
function randCanvasPt(){return vec2(int(random(qtSqPixels)),int(random(qtSqPixels)));}
function vec2(x=0,y=0){return createVector(x,y);}