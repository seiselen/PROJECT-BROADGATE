//======================================================================
//>>> WOLLONGONG BIAS UTIL
//======================================================================


var WollongongBias = {
  refBiasVal : .05,
  curBiasVal : 0,
  biasIntrvl : [0,0.5],
  lnHalfEval : -1,
  curExpoVal : -1,

  init : (b)=>{
    WollongongBias.lnHalfEval=log(0.5);
    if(b===undefined){b=WollongongBias.refBiasVal;}
    WollongongBias.setBiasVal(b);
  },

  setBiasVal : (b)=>{
    WollongongBias.curBiasVal = constrain(b,...WollongongBias.biasIntrvl);
    WollongongBias.setExpoVal();
  },
  
  setExpoVal : ()=>{
    WollongongBias.curExpoVal = log(WollongongBias.curBiasVal)/WollongongBias.lnHalfEval;
  },
  
  getBiasVal : (x)=>{
    return pow(constrain(x,0,1),WollongongBias.curExpoVal);
  },

  getBiasFromNormDist(nd){
    return lerp(255,0,WollongongBias.getBiasVal(nd));
  }
}