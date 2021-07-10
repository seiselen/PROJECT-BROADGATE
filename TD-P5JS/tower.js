/*----------------------------------------------------------------------
|>>> Class Tower
+-----------------------------------------------------------------------
| Description: [QAD] Implements towers AND other buildings, but keeping 
|              its name 'Tower' for now to KISS. If/When I implement a
|              building that generates money for every [x] frames, I'll
|              call it 'Fusion Reactor Tower', 'Weapons Lab' for a bldg
|              that increases ROF for all towers by [x] frames, etc.
+---------------------------------------------------------------------*/
class Tower{
  // Data Schema: [0]=> # polygon sides | [1]=> [r,g,b] fill color
  static TypeInfo = {
    BLST: [6, [0,60,156]], BEAM: [8, [0,72,192]], CANN: [5, [96,96,120]], MISS: [4, [216,120,0]]
  } // Ends Dict TypeInfo

  constructor(pos,cell,map){
    this.pos  = pos;
    this.cell = cell;
    this.map  = map;
    this.diam = this.map.cellSize;   // ALL towers will be 1x1 cells in size
    this.rad  = this.map.cellSize/2; // originally cellSize*0.375 (i.e. half of 0.75)
    this.setWeapon("ENGY_BL1");
  } // Ends Constructor

  setWeapon(weapID){
    switch(weapID){
      /* ENERGY WEAPONS */
      case "ENGY_BL1" : this.weap = new LaserBlaster(this);       this.setTowerByWeapType(Tower.TypeInfo.BLST); break;
      case "ENGY_BL2" : this.weap = new LaserBlasterDual(this);   this.setTowerByWeapType(Tower.TypeInfo.BLST); break;
      case "ENGY_BL3" : this.weap = new LaserBlasterTriple(this); this.setTowerByWeapType(Tower.TypeInfo.BLST); break;
      case "ENGY_LBM" : this.weap = new LaserBeam(this);          this.setTowerByWeapType(Tower.TypeInfo.BEAM); break;
      case "ENGY_RBM" : this.weap = new LaserBeamRelay(this);     this.setTowerByWeapType(Tower.TypeInfo.BEAM); break;
      /* PROJECTILE WEAPONS */
      case "PROJ_ONE" : this.weap = new Cannon(this);             this.setTowerByWeapType(Tower.TypeInfo.CANN); break;
      case "PROJ_SEM" : this.weap = new SemiAutoCannon(this);     this.setTowerByWeapType(Tower.TypeInfo.CANN); break;
      case "PROJ_GAT" : this.weap = new GatlingGunCannon(this);   this.setTowerByWeapType(Tower.TypeInfo.CANN); break;
      case "PROJ_ML1" : this.weap = new MissileLauncher(this);    this.setTowerByWeapType(Tower.TypeInfo.MISS); break;
      case "PROJ_ML2" : this.weap = new MissileLauncher2X(this);  this.setTowerByWeapType(Tower.TypeInfo.MISS); break;

      default: console.log(">>> ERROR: Invalid weapon type: ["+weapID+"]. Tip: Compare it with options in WeaponType object/dict!");
    }
    return this; // to support function chaining
  } // Ends Function setWeapon


  setTowerByWeapType(info){
    this.nGonSides = info[0];
    this.nGonVerts = this.createNgon(this.pos,this.rad,this.nGonSides);
    this.strk_col  = color(180); 
    this.strk_wgt  = 2;
    this.fill_col  = color(info[1][0],info[1][1],info[1][2]);
  } // Ends Function setTowerByWeapType




  update(){
    if(this.weap){
      this.weap.update();
      this.weap.attack();
    }
  } // Ends Function update

  // Used by game manager to support toggling showing tower's weap range when user clicks on it
  toggleShowRange(){
    if(this.weap){this.weap.dispRange=!this.weap.dispRange;}
  }

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
  +---------------------------------------------------------------------
  | Implementation Notes:
  |  > degree offsets were pre-computed from a formula I developed which
  |    I've since forgotten; but it makes sure that the shapes line-up
  |    axis-parallel to the canvas.
  |  > there is one y-offset case for when [nSides==5], as the pentagon
  |    is off-center for some reason: but adding a y-offset of [3] seems
  |    to resolve the issue.
  +-------------------------------------------------------------------*/
  createNgon(pos, rad, nSides){
    let dOff = 0;   // degree offset (as applicable else zero)
    let yOff = 0;   // y offset (as applicable else zero)
    let rOff = rad; // radius offset (as applicable else input)
    switch(nSides){
      case 4: dOff = 45;                     break;
      case 5: dOff = 54;   rOff-= 3; yOff=3; break;
      case 6:              rOff-=4;          break;
      case 8: dOff = 67.5; rOff-=3;          break;
    }
    let degPerPt = 360/nSides; let curDeg = 0; let verts = [];
    for (let i=0; i<nSides; i++){verts.push(createVector(pos.x+(rOff*cos(radians(dOff+curDeg))), yOff+pos.y+(rOff*sin(radians(dOff+curDeg)))));curDeg+=degPerPt;}
    return verts;
  } // Ends Function createNgon

  render(){
    stroke(this.strk_col); strokeWeight(this.strk_wgt); fill(this.fill_col);
    beginShape();this.nGonVerts.forEach(v => vertex(v.x,v.y));endShape(CLOSE);
    if(this.weap){this.weap.render();}
  } // Ends Function render

} // Ends Class Tower