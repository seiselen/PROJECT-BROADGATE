import QAD_FPS_DISP from "./misc_utils.js";
import initExamplePanel from "./example_proj.js";

import { UIBuildButton } from "./lib_ui_objects/ui_build_button.js";

const CanvasConfig = {
  init(wide,tall){this.wide=wide;this.wideH=wide/2;this.tall=tall;this.tallH=tall/2;},
  dims(){return [this.wide,this.tall];}, dimsH(){return [this.wideH,this.tallH];}
}
CanvasConfig.init(1200,800);

var tester;
var bbutton;

const Fonts = {
  titillium_web_regular : null,
  titillium_web_bold : null,
}


const SoundPlayer = {
  sounds : {},
  mostRecentSound : "",
  addSound(sID,sFile){this.sounds[sID]=sFile;},
  play(sID){
    if(SoundPlayer.mostRecentSound.length>0){SoundPlayer.sounds[this.mostRecentSound].stop()}
    if(SoundPlayer.sounds[sID]){
      SoundPlayer.mostRecentSound = sID;
      SoundPlayer.sounds[sID].play();
    }
  }
}



const externStateSimulator = {
  curCredits : 520,
  costOfItem : 150,
  timeFactor :  .5, // i.e. (buildTime = itemCost*timeFactor)

  //> simulates external constraints e.g. max limits, place-to-build, etc.
  maxStuffMade: false,
  noBuildSites: false,

  itemCost(){return externStateSimulator.costOfItem;},

  buildTime(){return Math.floor(externStateSimulator.curCredits*externStateSimulator.timeFactor);},

  canBuild(){return !externStateSimulator.maxStuffMade && !externStateSimulator.noBuildSites && externStateSimulator.canAfford();},

  canAfford(){return externStateSimulator.curCredits>=externStateSimulator.costOfItem;},

  purchaseItem(){
    externStateSimulator.curCredits -= externStateSimulator.costOfItem;
    console.log("%cWhoever Cares Informed Player Just Started Building Something",'color: #00FF20');    
  },

  refundItem(){
    externStateSimulator.curCredits += externStateSimulator.costOfItem;
    console.log("%cBldg Placement Mgr Informed Of Refund As To Disable Placing Thing",'color: #E48400');
  },

  buildComplete(){
    console.log("%cBldg Can Now Be Placed <xor> Unit Now Spawns: Inform Whoever Cares",'color: #00FF20');
  }

}



window.preload =_=>{
  Fonts.titillium_web_bold = loadFont('assets/fonts/TitilliumWeb-Bold.ttf');
  Fonts.titillium_web_regular = loadFont('assets/fonts/TitilliumWeb-Regular.ttf');

  SoundPlayer.addSound('building',    loadSound('assets/sfx/ra1_narrator_building.wav'));
  SoundPlayer.addSound('cancelled',   loadSound('assets/sfx/ra1_narrator_cancelled.wav'));
  SoundPlayer.addSound('in_progress', loadSound('assets/sfx/ra1_narrator_in_progress.wav'));
  SoundPlayer.addSound('cant_afford', loadSound('assets/sfx/ra1_narrator_insufficient_funds.wav'));
  SoundPlayer.addSound('on_hold',     loadSound('assets/sfx/ra1_narrator_on_hold.wav'));
  SoundPlayer.addSound('cant_comply', loadSound('assets/sfx/ra1_narrator_unable_to_comply.wav'));
  SoundPlayer.addSound('in_progress', loadSound('assets/sfx/ra1_narrator_unable_to_comply_bldg_in_progress.wav'));
  SoundPlayer.addSound('complete',   loadSound('assets/sfx/ra1_narrator_complete.wav'));  
  
}


window.setup =_=>{
  createCanvas(...CanvasConfig.dims()).parent("app");
  document.addEventListener("contextmenu", event => event.preventDefault()); // prevents right click menu popup
  textFont(Fonts.titillium_web_regular);

  tester = initExamplePanel();
  bbutton = new UIBuildButton(createVector(320,160),createVector(100,100))
  .bindCallbacks(
    externStateSimulator.canBuild,
    externStateSimulator.canAfford,
    externStateSimulator.itemCost,
    externStateSimulator.buildTime,
    externStateSimulator.purchaseItem,
    externStateSimulator.refundItem,
    externStateSimulator.buildComplete
  )
  .bindSoundPlayer(SoundPlayer);

  console.log(externStateSimulator);

} // Ends P5JS Function setup

window.draw =_=>{
  //-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
  //>>> UI/UX CALLS
  //-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+


  //-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
  //>>> UPDATE CALLS
  //-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
  //tester.update();
  bbutton.update();

  //-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
  //>>> RENDER CALLS
  //-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
  background(32);
  //tester.render();
  bbutton.render();
  QAD_FPS_DISP.render();
} // Ends P5JS Function draw


window.mousePressed =()=>{
  //tester.onMousePressed();
  bbutton.onMousePressed();
  return false;
}
