import QAD_FPS_DISP from "./misc_utils.js";
import initExamplePanel from "./example_proj.js";


const CanvasConfig = {
  init(wide,tall){this.wide=wide;this.wideH=wide/2;this.tall=tall;this.tallH=tall/2;},
  dims(){return [this.wide,this.tall];}, dimsH(){return [this.wideH,this.tallH];}
}
CanvasConfig.init(1200,800);

var tester;

window.setup =_=>{
  createCanvas(...CanvasConfig.dims()).parent("app");

  tester = initExamplePanel();


  console.log(tester);

} // Ends P5JS Function setup

window.draw =_=>{
  //-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
  //>>> UI/UX CALLS
  //-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+


  //-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
  //>>> UPDATE CALLS
  //-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
  tester.update();

  //-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
  //>>> RENDER CALLS
  //-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
  background(32,32,int(random(32,48)));
  tester.render();
  QAD_FPS_DISP.render();
} // Ends P5JS Function draw


window.mousePressed =()=>{
  tester.onMousePressed();
  return false;
}
