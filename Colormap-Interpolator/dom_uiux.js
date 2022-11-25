
/*
  > Implement UIManager local state as to compare updated vals thereby
    o can respond to invalid input by not calling the handler and then
      resetting DOM vals to last valid configuration
  
  > Also: UIManager should have full data validation, so implement this
    when validating the color inputs:

      // Reject immediately if any arg is not a number
      if(
        isNaN(col1In[0])||isNaN(col1In[1])||isNaN(col1In[2])||
        isNaN(col2In[0])||isNaN(col2In[1])||isNaN(col2In[2])){
        <REJECT AND HANDLE>
      }

*/

var UIManager = {
  initDOM(){
    this.ui_col1    = createInput('240, 180, 0').parent("ui_col1").size(96);
    this.ui_col2    = createInput('0, 180, 240').parent("ui_col2").size(96);
    this.ui_cMapRes = createSelect().parent("ui_cMapRes");
    this.ui_inputGO = createButton("Go!").parent("ui_inputGO");
    this.fpsPane    = document.getElementById("fpsPane");
    this.fpsDltFrm  = 3;
    return this;
  },

  initDOMColResOptions(colResOps,initVal=null){
    Object.values(colResOps).forEach((res) => this.ui_cMapRes.option(res));
    if(initVal){this.ui_cMapRes.selected(initVal);}
    return this;
  },

  initDOMCurColorOptions(col1,col2){
    this.ui_col1.elt.value = col1.join().replaceAll(',',', ');
    this.ui_col2.elt.value = col2.join().replaceAll(',',', ');
    return this;
  },


  col1ToOutput(){
    let ret = this.ui_col1.value().split(',');
    return (ret.length===1&&ret[0]==='') ? [] : ret.map(v => parseInt(v.trim()));
  },

  col2ToOutput(){
    let ret = this.ui_col2.value().split(',');
    return (ret.length===1&&ret[0]==='') ? [] : ret.map(v => parseInt(v.trim()));
  },



  resToOutput(){return parseInt(this.ui_cMapRes.value())},

  valuesToOutput(){
    return {
      mapRez: this.resToOutput(),
      pColor: this.col1ToOutput(),
      qColor: this.col2ToOutput()
    };
  },

  bindGoButtonHandler(handler){
    this.ui_inputGO.mousePressed(()=>handler(this.valuesToOutput()));
    return this;
  },

  render(){
    if(frameCount%this.fpsDltFrm==0){
      this.fpsPane.innerHTML = `FPS: <strong>[${floor(frameRate())}]</strong> <em>(Updated Every ${this.fpsDltFrm} Frames)</em>`;
    }
  }

}

export default UIManager;