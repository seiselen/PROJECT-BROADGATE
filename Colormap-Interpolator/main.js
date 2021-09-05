

//######################################################################

//>>> "Enums" for Color Mode / Map Resolution
var ColorMode = {RGB:"rgb", HSB:"hsb"};
var ColMapRes = {x32:32, x64:64, x128:128, x256:256, x512:512};

//>>> Current Settings (kept as init and for 'dirty flag' changes)
var curColMode = ColorMode.RGB;
var curCMapRes = ColMapRes.x32;
var curCol1 = [240,108,0];
var curCol2 = [0,108,240];

//>>> Data Structures and Other Variables
var myColorBar;
var myColorWheel;
var bgColor;

//######################################################################

function setup(){
  createCanvas(896,704).parent("viz");
  initUI();
  myColorBar   = new ColorBar(createVector(64,32),curCol1,curCol2,curCMapRes,768,96);
  myColorWheel = new ColorWheel(createVector(width/2,(height/2)+64), curCol1, curCol2, curCMapRes, 64, 256);
  bgColor = color(24); // pre-defines as color object persists across color mode changes (via having vals \forall defined within)
  colorMode(curColMode); // do one initialization call before first draw() call; UI handler will make all successive [re]sets
} // Ends P5JS Function setup

function draw(){
  background(bgColor);
  myColorBar.render();
  myColorWheel.render();
  drawFPSSimple();
} // Ends P5JS Function draw

function drawFPSSimple(){
  textSize(18); textAlign(LEFT,CENTER); noStroke(); fill(255); text("FPS: "+nfs(frameRate(),2,2), 12, height-15);
} // Ends (Util) Function drawFPSSimple