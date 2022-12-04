p5.disableFriendlyErrors = true;


var imageDim = {init(dim){this.dim=dim;this.dimH=this.dim/2;}};
var canvDims = {init(wide,tall){this.wide=wide;this.tall=tall;this.wideH=this.wide/2;this.tallH=this.tall/2;}};

var ColorMap = {WHITE:"#FFFFFF",BLACK:"#000000",PURPLE:"#FF00FF"}

canvDims.init(1280,640);
imageDim.init(512);

var img_originShape;
var img_perlinField;
var img_mergedShape;
var images = [];


var imgSlider;

var uiManager;

function setup(){
  createCanvas(canvDims.wide,canvDims.tall).parent("viz");

  Object.keys(ColorMap).map(k=>ColorMap[k]=color(ColorMap[k]));
  WollongongBias.init(WollongongBias.refBiasVal);
  uiManager = new UIManager();

  createImages();
  imgSlider = new ImageSlider(64,64,512,512)
    .bindImageLeft(img_originShape.img)
    .bindImageRight(img_perlinField.img)
  ;
}


function draw(){
  background(60,120,180);
  img_mergedShape.render();
  imgSlider.render();
  uiManager.render();
}


function createImages(){
  PerlinNoiseField.scrambleOffsets();
  img_originShape = new ShaderImage(220,240).setRuleAndHeur("circle","biased").generate();
  img_perlinField = new ShaderImage(640,240).setRule("perlin").generate();
  img_mergedShape = new ShaderImage(704,64).setRuleAndHeur("wollongong",["circle","biased"]).generate();
}






/*----------------------------------------------------------------------
|>>> MOUSE/KEYBOARD INTERACTION FUNCTIONS
+---------------------------------------------------------------------*/
function mousePressed(){
  imgSlider.onMousePressed();
}

function mouseDragged(){
  imgSlider.onMouseDragged();
}

function mouseReleased(){
  imgSlider.onMouseReleased();
}



function keyPressed(){
  if(key==='r'||key==='R'){generateAllMaps();}
}