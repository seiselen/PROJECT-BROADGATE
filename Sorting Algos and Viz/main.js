/*----------------------------------------------------------------------
|> QAD TEMP Note on 'Merge Sort' (and/or its basic algorithm)
+-----------------------------------------------------------------------
| Main Idea / Algorithm:
|  (!) *DO* utilize Divide-And-Conquer vis-a-vis first sorting on array
|      subsets of every |2| elements, then merge-op on every |4|, then
|      on every [8], etc. until merging the two sets of |n/2|, but...
|  (!) *DON'T* utilize more than 1 external array: I should (in theory)
|      be able to utilize exactly one (and maybe visualize IT instead of
|      the input array, especially as the input won't change but it will
|      {and in a manner which shows incremental progress}). This array
|      could have elements initialized to [-1] or some sentinel, as for
|      the viz to do some special effect to show that this part is not
|      yet merge[sorted].      
|  (!) Lastly: if not even set, disregard final element. We'll do a O(n)
|      insertion operation on it at the end as to make things easier;
|      especially as 'vanilla' Merge Sort is O(n*log(n)), so we're only
|      affording a worst-case extra O(n) on top. This ironically won't
|      even hurt in the worst case effeciency scenario of a 'small' size
|      to 'n', as the corresponding O(n) will likewise be a small const.
|      (whereas the O(n) will be 'felt much less' with large |n| sets).
+---------------------------------------------------------------------*/



//======================================================================
//>>> 'Enum' Initializations
//======================================================================
var Globals  = {MAX_VAL:100, SET_SIZE:100};
var SortType = {INS:'i', SEL:'s', BUB:'b'};

//======================================================================
//>>> [Sorting Algo] Data Structure Declarations
//======================================================================
var testerIns;
var testerBub;

//======================================================================
//>>> Variables Involving Animation/Reset
//======================================================================
var inputSet   = Array(Globals.SET_SIZE).fill(0);
var lastFrames = 0;
var frameDelay = 240;
var lFramesRec = false;

//======================================================================
//>>> Setup / Draw / Misc. Functions
//======================================================================
function setup() {
  createCanvas(1280,720);
  for (var i = 0; i < inputSet.length; i++){inputSet[i]=i;} 
  testerIns = new InsertSort(vec2(0,0),vec2(640,720),vec2(60,60));
  testerBub = new BubbleSort(vec2(640,0),vec2(640,720),vec2(60,60));
  doSortingRun();
} // Ends P5JS Function setup


function draw(){
  //>>> UPDATE CALLS
  handleAutoReset();
  testerIns.advance();
  testerBub.advance();
  //>>> RENDER CALLS
  background(60);
  testerIns.render();
  testerBub.render();
} // Ends P5JS Function draw


function handleAutoReset(){
  if(lFramesRec == false && testerIns.isSorted && testerBub.isSorted){lastFrames = frameCount; lFramesRec = true;}
  if(lFramesRec == true && frameCount - lastFrames >= frameDelay ){doSortingRun(); lFramesRec = false;}  
} // Ends Function handleAutoReset


function doSortingRun(){
  inputSet = shuffle(inputSet);
  testerIns.loadInput(inputSet.slice());
  testerBub.loadInput(inputSet.slice());
} // Ends Function doSortingRun


//======================================================================
//>>> 'The Usual' Util Functions
//======================================================================
function vec2(x,y){return createVector(x,y);}
function drawFPSSimple(){noStroke();fill(0,128); rect(0,height-20,80,height-20);textSize(16); textAlign(LEFT,CENTER); strokeWeight(2); stroke(0); fill(255);text("FPS: "+round(frameRate()), 10, height-8);}
function drawCanMPtQAD(){strokeWeight(4); stroke(255,180,0); line(0,height/2,width,height/2); line(width/2,0,width/2,height);}