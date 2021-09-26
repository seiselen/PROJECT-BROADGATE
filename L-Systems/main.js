/*======================================================================
|>>> Project: L-System Demo/Testbed/Sandbox
+-----------------------------------------------------------------------
| Description:  [QAD] Interactive visualization and experimentation with
|               PCG of simple 2D L-System objects for mostly vegetation
|               (e.g. trees bushes, etc.); as well as other things that
|               can be generated utilizing [L-System] shape grammars. 
| Author:       > Steven Eiselen (WRT contributions of below references)
| References:   > Dan Shiffman (NYU / The Coding Train / Nature Of Code) 
|                 whose L-System code provided a base from which this
|                 implementation expanded upon.
|                  <https://natureofcode.com/book/chapter-8-fractals/>
|               > Christopher G. Jennings whose analogous L-System demo,
|                 despite being discovered late into my own realization,
|                 provided some additional template and production rule 
|                 definitions. He also implemented UI/UX that is in my
|                 opinion superior to my own: such that if I produce a
|                 major update to this project in the future: its UI/UX
|                 will be inspired thereby; as discussed in the 'Future
|                 UI/UX' note further below.
|                  <https://cgjennings.ca/articles/l-systems/>
+-----------------------------------------------------------------------
| Note on Future UI/UX: Derived from the one implemented by Jennings...
|  > Whenever a template L-System definition is selected (i.e. either 
|    on-init and/or via the user), two things happen;
|     [1] It is loaded into ergo modifies the lsys object per usual; AND
|     [2] Its data definition is placed into a multi-line text-input DOM
|         element whereby the user can first modify it as desired, then
|         click a button to effect the changes accordingly. 
|  > Although I'm compelled to implement this feature NOW, let's not and
|    say we did; as at the time of writing: this project was planned to 
|    be the last of the P5JS 'Broadgate II/III' series of code demos, as
|    I'd like to return to Unity3D for other Genesis/Fea/other projects.
+=====================================================================*/

/*----------------------------------------------------------------------
|>>> Setup/Init/Draw/UI
+---------------------------------------------------------------------*/
var PaneDims = {VIZ_WIDE:1024, UI_WIDE:320, TALL:768};
var pzUtil, lsys;

function setup() {
  createCanvas(PaneDims.VIZ_WIDE, PaneDims.TALL).parent("pane_viz");
  pzUtil = new PZUtil([PaneDims.VIZ_WIDE, PaneDims.TALL]);
  lsys   = new LSystem().loadConfig('ex_tree_05').fullyGenerate();
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