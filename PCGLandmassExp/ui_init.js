function init_ui(){
  //####################################################################
  //>>> Object Definition/Initialization of uiItems
  //####################################################################

  uiItems = {
    label_scl : null, label_oct : null, label_per : null, label_lac : null,   
    setText: function(item,val){if(this[item]){this[item].html(val);} else{console.log(item);}},
    pressed: {NW:false, N:false, NE:false, W:false, E:false, SW:false, S:false, SE:false},
    updateDirReqs: function(){if(this.pressed.NW){reqLandmassPan("NW");} if(this.pressed.N){reqLandmassPan("N");} if(this.pressed.NE){reqLandmassPan("NE");} if(this.pressed.W){reqLandmassPan("W");} if(this.pressed.E){reqLandmassPan("E");} if(this.pressed.SW){reqLandmassPan("SW");} if(this.pressed.S){reqLandmassPan("S");} if(this.pressed.SE){reqLandmassPan("SE");}}
  } // Ends Object Definition/Initialization uiItems

  //####################################################################
  //>>> State + Behaviors for Noise Parm Sliders/Labels
  //####################################################################

  let npInfo = argz.nInfo;

  let sldrWidth = "512px"; let sldrWidth2 = "240px"; let sepPadding = "16px";

  uiItems.label_scl = select("#td_nScale_labItem");
  let td_nScale_slider = createSlider(npInfo.scaleMin, npInfo.scaleMax, 0, npInfo.scaleDel).style('width', sldrWidth).parent("td_nScale_sldItem").input(()=> landmass.setNoiseScale(td_nScale_slider.value()));
  uiItems.label_oct = select("#td_nOctv_labItem");
  let td_nOctv_slider = createSlider(npInfo.octMin, npInfo.octMax, 0, npInfo.octDel).style('width', sldrWidth2).parent("td_nOctv_sldItem").input(()=> landmass.setNumOctaves(td_nOctv_slider.value()));
  uiItems.label_per = select("#td_vPers_labItem");
  let td_vPers_slider = createSlider(npInfo.perMin, npInfo.perMax, 0, npInfo.perDel).style('width', sldrWidth2).parent("td_vPers_sldItem").input(()=> landmass.setPersistVal(td_vPers_slider.value()));
  uiItems.label_lac = select("#td_vLacu_labItem");
  let td_vLacu_slider = createSlider(npInfo.lacMin, npInfo.lacMax, 0, npInfo.lacDel).style('width', sldrWidth2).parent("td_vLacu_sldItem").input(()=> landmass.setLacunarVal(td_vLacu_slider.value()));

  //####################################################################
  //>>> State + Behaviors for Directional Buttons
  //####################################################################

  let dirBut_NW = select("#dirBut_NW").mousePressed(()=> uiItems.pressed.NW=true).mouseReleased(()=> uiItems.pressed.NW=false).mouseOut(()=> uiItems.pressed.NW=false);
  let dirBut_N  = select("#dirBut_N").mousePressed(()=>  uiItems.pressed.N=true).mouseReleased(()=>  uiItems.pressed.N=false).mouseOut(()=>  uiItems.pressed.N=false);
  let dirBut_NE = select("#dirBut_NE").mousePressed(()=> uiItems.pressed.NE=true).mouseReleased(()=> uiItems.pressed.NE=false).mouseOut(()=> uiItems.pressed.NE=false);
  let dirBut_W  = select("#dirBut_W").mousePressed(()=>  uiItems.pressed.W=true).mouseReleased(()=>  uiItems.pressed.W=false).mouseOut(()=>  uiItems.pressed.W=false);
  let dirBut_E  = select("#dirBut_E").mousePressed(()=>  uiItems.pressed.E=true).mouseReleased(()=>  uiItems.pressed.E=false).mouseOut(()=>  uiItems.pressed.E=false);
  let dirBut_SW = select("#dirBut_SW").mousePressed(()=> uiItems.pressed.SW=true).mouseReleased(()=> uiItems.pressed.SW=false).mouseOut(()=> uiItems.pressed.SW=false);
  let dirBut_S  = select("#dirBut_S").mousePressed(()=>  uiItems.pressed.S=true).mouseReleased(()=>  uiItems.pressed.S=false).mouseOut(()=>  uiItems.pressed.S=false);
  let dirBut_SE = select("#dirBut_SE").mousePressed(()=> uiItems.pressed.SE=true).mouseReleased(()=> uiItems.pressed.SE=false).mouseOut(()=> uiItems.pressed.SE=false);

} // Ends Function init_ui