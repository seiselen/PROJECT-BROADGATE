
var ui_R1, ui_G1, ui_B1, ui_R2, ui_G2, ui_B2, ui_NB, ui_SetCol;
function initUI(){

  ui_R1 = createInput('').parent("ui_R1").size(32);
  ui_G1 = createInput('').parent("ui_G1").size(32);
  ui_B1 = createInput('').parent("ui_B1").size(32);

  ui_R2 = createInput('').parent("ui_R2").size(32);
  ui_G2 = createInput('').parent("ui_G2").size(32);
  ui_B2 = createInput('').parent("ui_B2").size(32);

  ui_SetCol = createButton("Go!").parent("ui_SetCol").mousePressed(ui_handleSetCol);

  ui_NB = createSelect().parent("ui_NB");
  ui_NB.option('16');
  ui_NB.option('32');
  ui_NB.option('64');
  ui_NB.option('128');
  ui_NB.option('256'); 
}

// could put all 6 into array and use loops to minimize code, but K.I.S.S. and #YOLO for now
function ui_handleSetCol(){
  let r1 = int(ui_R1.value());
  let g1 = int(ui_G1.value());
  let b1 = int(ui_B1.value());
  let r2 = int(ui_R2.value());
  let g2 = int(ui_G2.value());
  let b2 = int(ui_B2.value());

  if(isNaN(r1)||isNaN(g1)||isNaN(b1)||isNaN(r2)||isNaN(g2)||isNaN(b2)){return;}

  // constrain within color range. p5js likely does this within color(...), but J.I.C.
  r1 = constrain(r1,0,255);
  g1 = constrain(g1,0,255);
  b1 = constrain(b1,0,255);
  r2 = constrain(r2,0,255);
  g2 = constrain(g2,0,255);
  b2 = constrain(b2,0,255);

  myColormapBar.setColBounds(color(r1,g1,b1),color(r2,g2,b2));
  myColormapBar.setNumBars(int(ui_NB.value()));


}