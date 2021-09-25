

var sldr_len, sldr_theta, sldr_rot;
var labl_len, labl_theta, labl_rot;
var drop_exs;

function init_ui(){
  sldr_len   = createSlider(10, 400, 0, 5).style('width', "152px").parent("sldr_len").input(()=>lsys.setInitLen(sldr_len.value()));
  sldr_theta = createSlider(5, 90, 15, 2.5).style('width', "152px").parent("sldr_theta").input(()=>lsys.setInitTheta(sldr_theta.value()));
  sldr_rot   = createSlider(0, TWO_PI, 0, PI/60).style('width', "152px").parent("sldr_rot").input(()=>lsys.setInitRot(sldr_rot.value()));
  
  updateSliderVals();

  labl_len   = select("#labl_len");
  labl_theta = select("#labl_theta");
  labl_rot   = select("#labl_rot");

  drop_exs = createSelect().parent("#down_exs").style("font-size","18px").style("margin-left","8px");
  Object.keys(templates).filter((k)=>k[0]=='e').forEach((k)=>{drop_exs.option(k);})
  drop_exs.selected(lsys.cfigKey);
  drop_exs.changed(()=>{lsys.loadConfig(drop_exs.value()).instaGenerate(); updateSliderVals();});

}

function updateDOMUI(){
  labl_len.html(sldr_len.value());
  labl_theta.html(nf(sldr_theta.value(),1,1));
  labl_rot.html(nf(sldr_rot.value(),1,2));
}

function updateSliderVals(){
  sldr_len.value(lsys.baseLen);
  sldr_rot.value(lsys.baseRot);
  sldr_theta.value(lsys.theta);  
}