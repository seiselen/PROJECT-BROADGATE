/*======================================================================
|>>> Project: L-System Demo/Testbed/Sandbox
+-----------------------------------------------------------------------
| Description:  [QAD] Interactive visualization and experimentation with
|               PCG of simple 2D L-System objects for mostly vegetation
|               (e.g. trees bushes, etc.); as well as other things that
|               can be generated utilizing [L-System] shape grammars. 
| Author:     > Dan Shiffman (NYU / The Coding Train / Nature Of Code) 
|                for a chunk of the base L-System init and render code.
|              > Steven Eiselen (Eiselen Laboratories) for expansion and
|                enhancement thereupon, as well as UI/UX interactivity.
| Lang./Lib.:  JavaScript via P5JS
+=====================================================================*/

/*----------------------------------------------------------------------
|>>> Setup/Init/Draw/UI
+---------------------------------------------------------------------*/
var PaneDims = {VIZ_WIDE:1024, UI_WIDE:320, TALL:768};
var pzUtil, lsys;

function setup() {
  createCanvas(PaneDims.VIZ_WIDE, PaneDims.TALL).parent("pane_viz");
  pzUtil = new PZUtil([PaneDims.VIZ_WIDE, PaneDims.TALL]);
  lsys   = new LSystem().loadConfig('ex_tree_01').fullyGenerate();
  init_ui();
  frameRate(30);
} // Ends P5JS Function setup

function draw() {
  pzUtil.update(); updateDOMUI();
  background("#78B4D8"); // i.e. background(120,180,216) 
  pzUtil.pushTF();lsys.render();pzUtil.popTF();
  drawCanvasBorder(); drawFPS();
  pzUtil.render();
} // Ends P5JS Function draw

function mousePressed(){pzUtil.handleMousePressed();if(mouseInCanvas()){return false;}}
function mouseWheel(evt){pzUtil.handleMouseWheel(evt);}
function keyPressed(){pzUtil.handleKeyPressed(key);}


/*----------------------------------------------------------------------
|>>> DOM UI Init/Update Functions  (restored to main.js for convenience) 
+---------------------------------------------------------------------*/
var sldr_len, sldr_theta, labl_len, labl_theta, drop_exs, cbox_colBranch, cbox_simWind;

function init_ui(){
  sldr_len   = createSlider(1, 10, 0, 0.1).style('width', "160px").parent("sldr_len").input(()=>lsys.setLenFac(sldr_len.value()));
  sldr_theta = createSlider(5, 90, 15, 2.5).style('width', "160px").parent("sldr_theta").input(()=>lsys.setTheta(sldr_theta.value()));

  cbox_colBranch = select("#cBox_branches");
  cbox_colBranch.elt.checked = false;
  cbox_colBranch.changed(()=>{lsys.colBrch = cbox_colBranch.checked()});

  cbox_simWind = select("#cBox_wind");
  cbox_simWind.elt.checked = false;
  cbox_simWind.changed(()=>{lsys.simWind = cbox_simWind.checked()});


  updateSliderVals();

  labl_len   = select("#labl_len");
  labl_theta = select("#labl_theta");

  drop_exs = createSelect().parent("#down_exs").style("font-size","18px").style("margin-left","8px");
  Object.keys(templates).filter((k)=>k[0]=='e').forEach((k)=>{drop_exs.option(templates[k].name, k);})
  drop_exs.selected(lsys.cfigKey);
  drop_exs.changed(()=>{lsys.loadConfig(drop_exs.value()).fullyGenerate(); updateSliderVals();});



}

function updateDOMUI(){
  labl_len.html(lsys.lenFac);
  labl_theta.html(nf(lsys.theta,1,1));
}

function updateSliderVals(){
  let disableUI = templates[lsys.cfigKey].disblUI;

  if(disableUI == undefined){
    sldr_theta.elt.disabled=false; 
    sldr_len.elt.disabled=false;
    sldr_theta.value(lsys.theta)
    sldr_len.value(lsys.lenFac);
  }
  else{
    if(disableUI.includes("theta")){sldr_theta.elt.disabled=true;}
    else{sldr_theta.elt.disabled=false; sldr_theta.value(lsys.theta);}
    
    if(disableUI.includes("len")){sldr_len.elt.disabled=true;}
    else{sldr_len.elt.disabled=false; sldr_len.value(lsys.lenFac);}
  }

  if(lsys.isVeg == true){
    cbox_colBranch.elt.disabled = false;
    cbox_simWind.elt.disabled = false;
    cbox_colBranch.elt.checked = false;
    cbox_simWind.elt.checked = false;
  }
  else{
    cbox_colBranch.elt.checked = false;
    cbox_simWind.elt.checked = false;
    cbox_colBranch.elt.disabled = true;
    cbox_simWind.elt.disabled = true;
  }
}