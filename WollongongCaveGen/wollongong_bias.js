//======================================================================
//>>> WOLLONGONG BIAS UTIL
//======================================================================

// Wollongong Bias Function: {f(x)=x^(ln(b)/ln(0.5)) | x∋[0≤x≤1] ∧ b∋[0≤b=.05≤0.5]}
// ↑ Desmos [Ctrl]+[V] Expr: y=x^{\frac{\ln\left(0.05\right)}{\ln\left(0.5\right)}}
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
    WollongongBias.curExpoVal=log(WollongongBias.curBiasVal)/WollongongBias.lnHalfEval;
  },
  
  getBiasVal : (x)=>{
    return pow(constrain(x,0,1),WollongongBias.curExpoVal);
  }
}