
//>>> UIObject (DOM) Variables
var ui_col1, ui_col2, ui_colMode, ui_cMapRes, ui_inputGO;

function initUI(){
  ui_col1    = createInput('240, 180, 0').parent("ui_col1").size(96);
  ui_col2    = createInput('0, 180, 240').parent("ui_col2").size(96);
  ui_colMode = createSelect().parent("ui_colMode");
  ui_cMapRes = createSelect().parent("ui_cMapRes");
  ui_inputGO = createButton("Go!").parent("ui_inputGO").mousePressed(ui_handleInputButton);

  Object.values(ColMapRes).forEach((res) => ui_cMapRes.option(res));
  Object.keys(ColorMode).forEach((key)=> ui_colMode.option(key,ColorMode[key]));
} // Ends Function initUI

function ui_handleInputButton(){
  //====================================================================
  //>>> Colormap Rez value changed => update bar/wheel
  //====================================================================
  let mapRezVal = ui_cMapRes.value(); 
  if(mapRezVal != curCMapRes){
    myColorBar.setNumBars(mapRezVal);
    myColorWheel.setNumSlices(mapRezVal);
  }

  //====================================================================
  //>>> Color Mode value changed => update color mode
  //====================================================================
  let colModeVal = ui_colMode.value();
  if(colModeVal != curColMode){
    curColMode = colModeVal;
    colorMode(curColMode);
  }

  //====================================================================
  //>>> Grab and Data-Validate inputs for Color-1 and Color-2
  //====================================================================

  // NOTE: This is a VERY CUTE 'Split-Then-Trim' snippet!
  let col1In = ui_col1.value().split(',').map(v => v.trim());
  let col2In = ui_col2.value().split(',').map(v => v.trim());

  // Reject immediately if there's not exactly 3 args per color
  if(col1In.length != 3 || col2In.length != 3){return;}

  // Reject immediately if any arg is not a number
  if(isNaN(col1In[0])||isNaN(col1In[1])||isNaN(col1In[2])||isNaN(col2In[0])||isNaN(col2In[1])||isNaN(col2In[2])){return;}

  // Colors are considered 'valid' at this point (P5JS -DOES- constrain them, so no worries about that!)
  //console.log(col1In); console.log(col2In); // debug-use only!

  //====================================================================
  //>>> Update Color 1 and 2 values (no REAL need for 'only if changed')
  //====================================================================
  myColorBar.setColVals(col1In, col2In);
  myColorWheel.setColVals(col1In, col2In);
} // Ends Function ui_handleInputButton