const DELTA_FRAME = 3; // frames between FPS value updates

var QAD_FPS_DISP = {
  init(){
    this.elt = document.getElementById("debug_fps_p");
  },
  render(){
    (frameCount%DELTA_FRAME===0) ? this.elt.innerHTML = `FPS ⮕ [${nf(frameRate(),2,2)}] (updated every</em> [${DELTA_FRAME}]frames)` : true;
    
  }
}
QAD_FPS_DISP.init();

export default QAD_FPS_DISP;