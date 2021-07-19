


function init_ui(){
  let labl_genSettings = createElement("h3", "L-Tree General Settings:").class("ui_labl").parent("ui");

  let p_initLen = createElement("p", "Init Length: ").id("init_len").class("ui_subl").parent("ui");
  let sldr_initLen = createSlider(10, 400, 0, 5).style('width', "120px").parent("init_len").input(()=>{initLength = sldr_initLen.value();});


  //let inpt_initLen = createInput(""+initLength).style("width","80px").parent("init_len");
  //let butt_initLen = createButton("-SET-").style("width","80px").mousePressed(()=>{initLength = parseInt(inpt_initLen.value());}).parent("init_len");

  let p_initLenFac = createElement("p", "Init Length Factor: ").id("init_lenFac").class("ui_subl").parent("ui");
  let sldr_initLenFac = createSlider(0.05, 2.0, 0, 0.05).style('width', "120px").parent("init_lenFac").input(()=>{initLenFac = sldr_initLenFac.value();});


  let p_initRot = createElement("p", "Init Rotation: ").id("init_rot").class("ui_subl").parent("ui");
  let sldr_initRot = createSlider(0, TWO_PI, 0, PI/60).style('width', "120px").parent("init_rot").input(()=>{initRotate = sldr_initRot.value();});

}

