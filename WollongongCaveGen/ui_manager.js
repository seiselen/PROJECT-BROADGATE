
// Note: DOM UI Manager; i.e. SANS in-canvas image overlap slider
class UIManager {
  static CONSOLE_LOG_EFFECTS = false;

  constructor(){
    this.fpsPane=document.getElementById("fpsPane");
    this.ddown_tShape = document.getElementById("ddown_tShape");
    this.slidr_wBias  = document.getElementById("slidr_wBias");
    this.slidr_pScale = document.getElementById("slidr_pScale");
    this.labl_wBias   = document.getElementById("lbl_valOf_wBias");
    this.labl_pScale  = document.getElementById("lbl_valOf_pScale");
    this.butt_pOffsts = document.getElementById("butt_pOffsets");
    this.butt_fldFill = document.getElementById("butt_fldFill");    

    this.initShapeDDown();
    this.initWBiasSlider();
    this.initPScaleSlider();
    this.initPOffstsButton();
    this.initFldFillButton();
  }

  initShapeDDown(){
    this.ddown_tShape.add(this.createOption("Circle", 'c', true));
    this.ddown_tShape.add(this.createOption("Square", 's'));
    this.ddown_tShape.add(this.createOption("Diamond",'d'));
    this.ddown_tShape.add(this.createOption("X Cross",'x'));
    this.ddown_tShape.addEventListener("change", ()=>this.onShapeOptionChanged());
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

  initFldFillButton(){
    this.butt_fldFill.addEventListener("click", ()=>this.onFloodFillButtonClicked());
  }

  onShapeOptionChanged(){
    switch(this.ddown_tShape.value){
      case 'c': this.shapeOptionChangeAction('circle'); return; 
      case 's': this.shapeOptionChangeAction('square'); return; 
      case 'd': this.shapeOptionChangeAction('diamond'); return; 
      case 'x': this.shapeOptionChangeAction('diag_cross'); return; 
    }
    if(UIManager.CONSOLE_LOG_EFFECTS){console.log("Shape Template Changed And Image Subsequently Re-Generated");}
  }
  
  onWBiasSliderValDragged(){
    this.labl_wBias.textContent = nf(this.slidr_wBias.value,1,2);
  }

  onWBiasSliderValDropped(){
    WollongongBias.setBiasVal(this.slidr_wBias.value);
    myWGImage.generate();
    if(UIManager.CONSOLE_LOG_EFFECTS){console.log("Wollongong Bias Value Changed And Image Subsequently Re-Generated");}
  }

  onPScaleSliderValDragged(){
    this.labl_pScale.textContent = nf(this.slidr_pScale.value,1,3);
  }

  onPScaleSliderValDropped(){
    PerlinNoiseField.setNoiseScale(this.slidr_pScale.value);
    myWGImage.generate();
    if(UIManager.CONSOLE_LOG_EFFECTS){console.log("Perlin Noise Scale Value Changed And Image Subsequently Re-Generated");}
  }

  onPOffsetsButtonClicked(){
    PerlinNoiseField.scrambleOffsets();
    myWGImage.generate();
    if(UIManager.CONSOLE_LOG_EFFECTS){console.log(`New Perlin Offsets = (${[PerlinNoiseField.posOffsetX,PerlinNoiseField.posOffsetY].toString()})`)}
  }

  onFloodFillButtonClicked(){
    floodFill.floodFill();
    if(UIManager.CONSOLE_LOG_EFFECTS){console.log("Flood Fill Operation Complete");}
  }


  shapeOptionChangeAction(nr){
    if(myWGImage.curRule==nr){return;}
    myWGImage.setRule(nr).generate();
  }  

  createOption(txt,val,isSel=false){
    let ret   = document.createElement("option");
    ret.text  = txt;
    ret.value = val;
    if(isSel){ret.selected="selected";}
    return ret;
  }


  onKeyPressed(){
    if(key==='r'||key==='R'){myWGImage.generate();}
  }


  render(){
    this.dispFPSViaDOM();
  }

  dispFPSViaDOM(){
    this.fpsPane.textContent = `[${nf(frameRate(),2,2)}]`;
  }

}