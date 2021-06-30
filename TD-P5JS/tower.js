/*----------------------------------------------------------------------
|>>> Class Tower
+-----------------------------------------------------------------------
| Description: [QAD] Implements towers AND other buildings, but keeping 
|              its name 'Tower' for now to KISS. If/When I implement a
|              building that generates money for every [x] frames, I'll
|              call it 'Fusion Reactor Tower', if a building increases
|              rate-of-fire for all towers by [x] frames, I'll call it
|              'Weapons Lab', etc.
+---------------------------------------------------------------------*/
class Tower{
  constructor(pos,cell,map){
    this.pos  = pos;
    this.cell = cell;
    this.map  = map;
    this.diam = this.map.cellSize; // ALL towers will be 1x1 cells in size
    this.rad  = this.map.cellSize/2; // originally cellSize*0.375 (i.e. half of 0.75)
    this.weap = new Weapon(this.pos, this.map, this); // set null? (i.e. base tower unarmed -> player needs to buy weapon)?

    //> GFX/Viz Settings (Note: WILL VARY once I implement diff. tower types)
    this.nGonSides = 6;
    this.nGonVerts = this.createNgon(this.pos,this.rad,this.nGonSides);
    this.fill_reg  = color(0,216,0);     // fill color if NOT selected by player
    this.fill_sel  = color(0,216,0,127); // fill color if selected by player 
    this.stke_reg  = color(60);          // stroke color if NOT selected by player
    this.stke_sel  = color(60,127);      // stroke color if selected by player
    this.stke_wgt  = 2;                  // stroke weight
  } // Ends Constructor


  update(){
    if(this.weap){
      this.weap.update();
      this.weap.attack();
    }
  } // Ends Function update


  ptInBoundCirc(pt){
    return p5.Vector.dist(pt,this.pos) <= this.diam;
  } // Ends Function ptInBoundCirc


  //####################################################################
  //>>> Render and other GFX/VFX methods
  //####################################################################

  /*--------------------------------------------------------------------
  |>>> Function createNgon
  +---------------------------------------------------------------------
  | Description: Creates vertices needed to display the towers as n-gon
  |              primitive shapes, as this project is not using sprites.
  +-------------------------------------------------------------------*/
  createNgon(pos, rad, nSides){
    let degOff = 0;
    switch(nSides){
      case 4: degOff =    45; break;
      case 5: degOff =    54; break;
      case 6: degOff =     0; break;
      case 7: degOff = 64.25; break;
      case 8: degOff =  67.5; break;
    }

    let degPerPt = 360/nSides;
    let curDeg   = 0;
    let verts    = [];
    for (let i=0; i<nSides; i++){
      verts.push(createVector(pos.x+(rad*cos(radians(degOff+curDeg))), pos.y+(rad*sin(radians(degOff+curDeg)))));
      curDeg+=degPerPt;}
    return verts;
  } // Ends Function createNgon


  render(){
    strokeWeight(this.stke_wgt);
    if(this.isSelected){fill(this.fill_sel);stroke(this.stke_sel);} 
    else               {fill(this.fill_reg);stroke(this.stke_reg);}

    beginShape();this.nGonVerts.forEach(v => vertex(v.x,v.y));endShape(CLOSE);
    if(this.weap){this.weap.render();}
  } // Ends Function render

} // Ends Class Tower