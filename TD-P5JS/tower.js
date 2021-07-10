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
  constructor(pos,cell,map){
    this.pos  = pos;
    this.cell = cell;
    this.map  = map;
    this.diam = this.map.cellSize; // ALL towers will be 1x1 cells in size
    this.rad  = this.map.cellSize/2; // originally cellSize*0.375 (i.e. half of 0.75)

    this.setWeapon("LaserBlaster");

    //> GFX/Viz Settings (Note: WILL VARY once I implement diff. tower types)
    this.nGonSides = 6;
    this.nGonVerts = this.createNgon(this.pos,this.rad,this.nGonSides);
    this.fill_reg  = color(0,216,0);     // fill color if NOT selected by player
    this.fill_sel  = color(0,216,0,127); // fill color if selected by player 
    this.stke_reg  = color(180);          // stroke color if NOT selected by player
    this.stke_wgt  = 2;                  // stroke weight
  } // Ends Constructor

  setWeapon(weapID){
    switch(weapID){
      /* ENERGY WEAPONS */
      case "LaserBlaster"       : this.weap = new LaserBlaster(this);       this.setTowerByType("blaster"); break;
      case "LaserBlasterDual"   : this.weap = new LaserBlasterDual(this);   this.setTowerByType("blaster"); break;
      case "LaserBlasterTriple" : this.weap = new LaserBlasterTriple(this); this.setTowerByType("blaster"); break;
      case "LaserBeam"          : this.weap = new LaserBeam(this);          this.setTowerByType("lazbeam"); break;
      case "LaserBeamRelay"     : this.weap = new LaserBeamRelay(this);     this.setTowerByType("lazbeam"); break;
      /* PROJECTILE WEAPONS */
      case "Cannon"             : this.weap = new Cannon(this);             this.setTowerByType("cannon");  break;
      case "SemiAutoCannon"     : this.weap = new SemiAutoCannon(this);     this.setTowerByType("cannon");  break;
      case "GatlingGunCannon"   : this.weap = new GatlingGunCannon(this);   this.setTowerByType("cannon");  break;
      case "MissileLauncher"    : this.weap = new MissileLauncher(this);    this.setTowerByType("missile"); break;
      case "MissileLauncher2X"  : this.weap = new MissileLauncher2X(this);  this.setTowerByType("missile"); break;

      default: console.log("ERROR - Should Not Get Here! Check input with those expected!");
    }
    return this; // to support function chaining
  } // Ends Function setWeapon


  setTowerByType(type){
    switch(type){
      case "blaster": this.setTowerBase(6); this.fill_reg = color(0,60,156); break;
      case "lazbeam": this.setTowerBase(8); this.fill_reg = color(0,72,192); break;
      case "cannon":  this.setTowerBase(5); this.fill_reg = color(96,96,120); break;
      case "missile": this.setTowerBase(4); this.fill_reg = color(216,120,0); break;
    }

  }




  setTowerBase(nSides){
    this.nGonSides = nSides;
    this.nGonVerts = this.createNgon(this.pos,this.rad,this.nGonSides);

  }





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
  +-------------------------------------------------------------------*/
  createNgon(pos, rad, nSides){
    let degOff = 0;
    switch(nSides){
      case 4: degOff = 45;            break;
      case 5: degOff = 54;   rad-= 3; break;
      case 6: degOff = 0;    rad-=4;  break;
      case 8: degOff = 67.5; rad-=3;  break;
    }

    let degPerPt = 360/nSides;
    let curDeg   = 0;
    let verts    = [];
    for (let i=0; i<nSides; i++){
      verts.push(createVector(pos.x+(rad*cos(radians(degOff+curDeg))), pos.y+(rad*sin(radians(degOff+curDeg)))));
      curDeg+=degPerPt;}
    if(nSides == 5){verts.forEach((v)=>{v.y+=3;})} // fixes minor y-offset of 4
    return verts;
  } // Ends Function createNgon


  render(){
    strokeWeight(this.stke_wgt);
    {fill(this.fill_reg);stroke(this.stke_reg);}
    beginShape();this.nGonVerts.forEach(v => vertex(v.x,v.y));endShape(CLOSE);
    if(this.weap){this.weap.render();}
  } // Ends Function render

} // Ends Class Tower