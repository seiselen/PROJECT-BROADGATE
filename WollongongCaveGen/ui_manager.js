
// Note: DOM UI Manager; i.e. SANS in-canvas image overlap slider
class UIManager {
  constructor(){
    this.fpsPane=document.getElementById("fpsPane");
    this.ddown_tShape = document.getElementById("ddown_tShape");
    this.ddown_hType  = document.getElementById("ddown_hType");
    this.slidr_wBias  = document.getElementById("slidr_wBias");
    this.slidr_pScale = document.getElementById("slidr_pScale");
    this.labl_wBias   = document.getElementById("lbl_valOf_wBias");
    this.labl_pScale  = document.getElementById("lbl_valOf_pScale");
    this.butt_pOffsts = document.getElementById("butt_pOffsets");

    this.initShapeDDown();
    this.initHeurDDown();
    this.initWBiasSlider();
    this.initPScaleSlider();
    this.initPOffstsButton()
  }

  initShapeDDown(){
    this.ddown_tShape.add(this.createOption("Circle", 'c', true));
    this.ddown_tShape.add(this.createOption("Square", 's'));
    this.ddown_tShape.add(this.createOption("Diamond",'d'));
    this.ddown_tShape.add(this.createOption("X Cross",'x'));
    this.ddown_tShape.addEventListener("change", ()=>this.onShapeOptionChanged());
  }

  initHeurDDown(){
    this.ddown_hType.add(this.createOption("Wollongong", 'w', true));
    this.ddown_hType.add(this.createOption("Linear", 'l'));
    this.ddown_hType.addEventListener("change", ()=>this.onHeurOptionChanged());
  }

  initWBiasSlider(){
    this.slidr_wBias.min = WollongongBias.biasIntrvl[0];
    this.slidr_wBias.max = WollongongBias.biasIntrvl[1];
    this.slidr_wBias.step = 0.01;
    this.slidr_wBias.value = WollongongBias.curBiasVal;
    this.slidr_wBias.addEventListener("input", ()=>this.onWBiasSliderValDragged());
    this.slidr_wBias.addEventListener("change", ()=>this.onWBiasSliderValDropped());
    this.onWBiasSliderValDragged();
  }

  initPScaleSlider(){
    this.slidr_pScale.min = PerlinNoiseField.noiseBound.min;
    this.slidr_pScale.max = PerlinNoiseField.noiseBound.max;
    this.slidr_pScale.step = PerlinNoiseField.noiseBound.step;
    this.slidr_pScale.value = PerlinNoiseField.noiseScale;
    this.slidr_pScale.addEventListener("input", ()=>this.onPScaleSliderValDragged());
    this.slidr_pScale.addEventListener("change", ()=>this.onPScaleSliderValDropped());
    this.onPScaleSliderValDragged();    
  }

  initPOffstsButton(){
    this.butt_pOffsts.addEventListener("click", ()=>this.onPOffsetsButtonClicked());
  }

  onShapeOptionChanged(){
    switch(this.ddown_tShape.value){
      case 'c': this.shapeOptionChangeAction('circle'); return; 
      case 's': this.shapeOptionChangeAction('square'); return; 
      case 'd': this.shapeOptionChangeAction('diamond'); return; 
      case 'x': this.shapeOptionChangeAction('diag_cross'); return; 
    }
  }
  
  onHeurOptionChanged(){
    switch(this.ddown_hType.value){
      case 'w': this.heurOptionChangeAction('biased'); return; 
      case 'l': this.heurOptionChangeAction('linear'); return; 
    }
  }

  onWBiasSliderValDragged(){
    this.labl_wBias.textContent = nf(this.slidr_wBias.value,1,2);
  }

  onWBiasSliderValDropped(){
    WollongongBias.setBiasVal(this.slidr_wBias.value);
    if(img_originShape.curHeur=='biased'){
      img_originShape.generate();
      img_mergedShape.generate();
    }
  }

  onPScaleSliderValDragged(){
    this.labl_pScale.textContent = nf(this.slidr_pScale.value,1,3);
  }

  onPScaleSliderValDropped(){
    PerlinNoiseField.setNoiseScale(this.slidr_pScale.value);
    img_perlinField.generate();
    img_mergedShape.generate();
  }

  onPOffsetsButtonClicked(){
    PerlinNoiseField.scrambleOffsets();
    img_perlinField.generate();
    img_mergedShape.generate();
    console.log(`New Perlin Offsets = (${[PerlinNoiseField.posOffsetX,PerlinNoiseField.posOffsetY].toString()})`)
  }

  shapeOptionChangeAction(nr){
    if(img_originShape.curRule==nr){return;}
    img_originShape.setRule(nr).generate();
    img_mergedShape.setHeur([nr,img_mergedShape.curHeur[1]]).generate();
  }
  
  heurOptionChangeAction(nh){
    if(img_originShape.curHeur==nh){return;}
    img_originShape.setHeur(nh).generate();
    img_mergedShape.setHeur([img_mergedShape.curHeur[0],nh]).generate();
  }
  






  
  
  createOption(txt,val,isSel=false){
    let ret   = document.createElement("option");
    ret.text  = txt;
    ret.value = val;
    if(isSel){ret.selected="selected";}
    return ret;
  }




  render(){
    this.dispFPSViaDOM();
  }


  dispFPSViaDOM(){
    this.fpsPane.textContent = `[${nf(frameRate(),2,2)}]`;
  }

}