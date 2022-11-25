import UIManager from "./dom_uiux.js";

//######################################################################

var Config = {
  canvasDims:   {wide:1000,tall:800,wideH:undefined,tallH:undefined},
  colorModes:   {RGB:"rgb", HSB:"hsb"},
  colorMapResz: {x8:8, x16:16, x32:32, x64:64, x128:128, x256:256},

  curColors: {
    fill_bg: 60,
    fill_p:  [240,108,0],
    fill_q:  [0,108,240],
    swgt_c:  1,
    strk_e:  255,
    swgt_e:  4
  },

  curResCfg: {
    value:   8,   // temp 'till init
    valueH:  4,   // also temp 'till init
    tPcnt:   1/8, // yeah you get the idea...
  },

  init(){
    this.canvasDims.wideH = this.canvasDims.wide/2;
    this.canvasDims.tallH = this.canvasDims.tall/2;
    this.curColorMode     = this.colorModes.RGB;
    this.setCurRes(this.colorMapResz.x32);
    Object.keys(this.curColors).forEach(k=>{if(k.startsWith('fill')||k.startsWith('strk')){this.curColors[k]=color(this.curColors[k]);}})
  },

  setCurColors(pCol,qCol){
    this.setCurColor('fill_p',pCol);
    this.setCurColor('fill_q',qCol);
  },

  setCurColor(colorID,newColor){
    if(this.curColors[colorID]===undefined){
      console.error(`Invalid curCol PKID: "${colorID}"`)
    }
    else if(typeof(newColor)==='number'){
      this.curColors[colorID]=color(newColor);
    }
    else if(newColor.constructor===Array){
      this.curColors[colorID]=color(...newColor);
    }
    else if(newColor.constructor===p5.Color){
      this.curColors[colorID]=newColor;
    }
  },

  setCurRes(newRes){
    if(this.curResCfg.value===newRes){return false;}
    this.curResCfg.value  = newRes;
    this.curResCfg.valueH = newRes/2;
    this.curResCfg.tPcnt  = 1/newRes;
    return true;
  },

  canvasSizeVals(){
    return [this.canvasDims.wide,this.canvasDims.tall];
  }


}


//>>> Data Structures and Other Variables
var myColorBar;
var myColorWheel;

//######################################################################

window.setup =_=>{
  createCanvas(...Config.canvasSizeVals()).parent("viz");
  Config.init();
  UIManager
    .initDOM()
    .bindGoButtonHandler(handleInputButton)
    .initDOMColResOptions(Config.colorMapResz,Config.curResCfg.value)
    .initDOMCurColorOptions(
      Config.curColors.fill_p.levels.slice(0,-1),
      Config.curColors.fill_q.levels.slice(0,-1)
    )
  ;
  myColorBar   = new ColorBar(createVector(960,16), 768,96, Config);
  myColorWheel = new ColorWheel(createVector(width*.42,(height/2)), 64, 380, Config);
  handleInputButton(UIManager.valuesToOutput());
} // Ends P5JS Function setup

window.draw =_=>{
  background(Config.curColors.fill_bg);
  myColorBar.render();
  myColorWheel.render();
  UIManager.render();
} // Ends P5JS Function draw


function handleInputButton(domProps){  
  let [pCol,qCol] = [domProps.pColor,domProps.qColor];
  // If one color input is blank: it becomes its counterpart. Why? 'Next
  // Phase' QAD improved 'overload' means to request+view only 1 color.
  if(pCol.length===0){pCol=qCol;} if(qCol.length===0){qCol=pCol;}  
  Config.setCurColors(pCol,qCol);
  // don't update if rez not changed, as regen colorwheel is expensive
  if(Config.setCurRes(domProps.mapRez)===true){
    myColorBar.onStateChanged();
    myColorWheel.onStateChanged();
  }
}