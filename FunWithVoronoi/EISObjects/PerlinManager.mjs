/*
ALGORITHM FOR PERLIN SAMPLING OF ELEV VALS WITHIN VORONOI CELLS:
  > Query-Get all the verts of the poly; which you already (know how to) do.
  > Compute {minX, minY, maxX, maxY} AABB via the verts; which you know how to do.
  > Write randomPtInBoundBox(pX,pY,qX,qY){return vec2(int(random(pX,qX)), int(random(pY,qY)))}
  > Pass values returned therefrom into your "isInPolygon" function xor that of the Voronoi lib.
  > Set a sentinel threshold on `numTries` to get a point within the polygon (512 should do it?)
  > Run it as many times as needed per the LOD and/or scale of the Perlin field
  > Speaking of Perlin-based elevations: mapping options of its [0,1] output:
    o Linear with [elevMIN,elevMAX] s.t. absdist(elevMIN) much less than absdist(elevMAX)
      * this should effect "have some shallow underwater areas but overall bias above water level"
      * ideas for [elevMIN,elevMAX] in feet: [0,1] => {[-60,320], [-12,240], [-12,96], etc.}
    o Logarithmic/Easing: meh... KISS for now
*/

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