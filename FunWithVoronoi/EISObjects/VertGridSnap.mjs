//# SUPER TEMP JUST TO COPY-VIZ-THEN-FUCK-WITH VD CELL VERTS
//  > OKAY SO THIS EXPERIMENT DOES PROVE THAT SNAPPING VIA 'ROUND-TO-INT-THEN-TO-INPUT-VAL'
//    DOES WORK AND IS CONSISTENT (OR AT LEAST NON-DEGENERATE) AS WAS EXPECTED...
var VertGridSnapExpmt = {
  verts: [],

  init: ()=>{
    VertGridSnapExpmt.strk = color(0);
    VertGridSnapExpmt.fillA = color(255,255,0);
    VertGridSnapExpmt.fillB = color(255,120,0);     
    VertGridSnapExpmt.sWgt = 1.5;
    VertGridSnapExpmt.diam = 6;
    VertGridSnapExpmt.sinCoTerm = (3*PI)/2;
    VertGridSnapExpmt.getCopyOfVDsVerts();
  },

  getCopyOfVDsVerts: ()=>{
    VertGridSnapExpmt.verts = [];
    voronoi.VD.vertices.forEach((v)=>VertGridSnapExpmt.verts.push(createVector(v.x,v.y)));
  },

  snapVertsToNearest: (val=1.0)=>{
    VertGridSnapExpmt.verts.forEach(v=>v.set(round(v.x/val)*val,round(v.y/val)*val));
  },

  setLazyStrobeFill: (speed=60)=>{
    fill(lerpColor(VertGridSnapExpmt.fillA, VertGridSnapExpmt.fillB, (sin(map(frameCount%speed,0,speed,0,TAU,true),VertGridSnapExpmt.sinCoTerm)+1)*0.5));
  },

  render: ()=>{
    stroke(VertGridSnapExpmt.strk);
    strokeWeight(VertGridSnapExpmt.sWgt);
    VertGridSnapExpmt.setLazyStrobeFill();
    VertGridSnapExpmt.verts.forEach(v=>ellipse(v.x,v.y,VertGridSnapExpmt.diam))
  },

}