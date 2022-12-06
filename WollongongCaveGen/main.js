/*######################################################################
|>>> [Wollongong Cave(rn) Generation]              (BROADGATE | GENESIS)
+-----------------------------------------------------------------------
| Description: Interactive viz/sim of the first steps of the 'Wollongong
|              Method' in 2D; i.e. that described in paper "Voxel-based 
|              Octree construction approach for procedural cave gen.",
|              by Cui et.al. at the University of Wollongong, Australia
|              (hence the name I apply to this method.)
| Author:      Steven Eiselen (Eiselen Laboratories)
| Source:      Aforementioned paper for basic ideas to generate 'Blended
|              Shape'; though I utilize a different distance metric. 
| Libraries:   P5JS and BROADGATE's 'Utils.js'
+-----------------------------------------------------------------------
|# Implementation Notes:
|  > Wollongong Bias Function (Math and Desmos 'copy+paste' Expression): 
|     o -Math-: {f(x)=x^(ln(b)/ln(0.5)) | x∋[0≤x≤1] ∧ b∋[0≤b=.05≤0.5]}
|     o Desmos: y=x^{\frac{\ln\left(0.05\right)}{\ln\left(0.5\right)}}
|  > I NO LONGER NEED to define a separate Linear Heuristic, as setting 
|    'Wollongong Bias' value to [0.5] is exactly equivalent thereto, as
|    shown here ⮕ {y=x^(ln(0.5)/ln(0.5))} ⬌ {y=x^(1)} ⬌ {y=x} QED ∎
|  > x
+-----------------------------------------------------------------------
|# NATs/TODOs:
|  > SHOULD Partition In-Canvas Slider into a new "UIObjects" analog to
|    Util.js (i.e. <vs> into the latter); as is commonly enough used,
|    but should be greater effort for disjoint globally accessible util
|    for BOTH In-Canvas and DOM UIObjects.
|     o COULD implement via 'Michael Jackson Script' (i.e. as JS module)
|       to assert that all consuming projects must be realized likewise;
|       especially as I now know how to implement P5JS projects thereby.
######################################################################*/
var canvDims = {init(wide,tall){this.wide=wide;this.tall=tall;this.wideH=this.wide/2;this.tallH=this.tall/2;}};
canvDims.init(1280,640);

var imgSlider;
var uiManager;
var floodFill;
var myWGImage;

function setup(){
  createCanvas(canvDims.wide,canvDims.tall).parent("viz");
  WollongongBias.init(WollongongBias.refBiasVal);
  uiManager = new UIManager();
  myWGImage = new WollongongImage(704,64,512).setRule('circle').generate();
  imgSlider = new ImageSlider(64,64,512,512).bindImages(myWGImage.image_TShape,myWGImage.image_PField);
  floodFill = new FloodFillUtil(myWGImage);
}


function draw(){
  background(60,120,180);
  myWGImage.render(); 
  imgSlider.render();
  uiManager.render();
}

//>>> P5JS Device UI Calls
function mousePressed(){imgSlider.onMousePressed();}
function mouseDragged(){imgSlider.onMouseDragged();}
function mouseReleased(){imgSlider.onMouseReleased();}
function keyPressed(){uiManager.onKeyPressed();}