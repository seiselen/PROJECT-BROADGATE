
//> TODO START 05/26 => 'Bake' Perlin Image in bound box area (xor i guess entire canvas) s.t. keypress('r') resets it

const PerlinNoiseField = {
  noiseBound: {min:0.005,max:0.03,step:0.001},
  noiseScale: 0.02,
  posOffsetX: 516,
  posOffsetY: 516,

  setPosOffset : (newX,newY)=>{
    PerlinNoiseField.posOffsetX = newX;
    PerlinNoiseField.posOffsetY = newY;
  },

  setNoiseScale : (newScale)=>{PerlinNoiseField.noiseScale = constrain(
    newScale,
    PerlinNoiseField.noiseBound.min,
    PerlinNoiseField.noiseBound.max
  )},

  scrambleOffsets : ()=>{
    PerlinNoiseField.setPosOffset(Math.floor(Date.now()*random()), Math.floor(Date.now()*random()));
    return this; // for function chaining (namely 'prime pump' call {AtInit})
  },

  getValueAtCoord : (r,c)=>{return noise(
    (c+PerlinNoiseField.posOffsetX)*PerlinNoiseField.noiseScale,
    (r+PerlinNoiseField.posOffsetY)*PerlinNoiseField.noiseScale
  )}
}

export default PerlinNoiseField;