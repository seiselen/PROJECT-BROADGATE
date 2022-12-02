class KingOfPop{
  constructor(xPos=0,yPos=0){
    this.pos = vec2(xPos,yPos);


    // Sprite Related Vals
    this.sprDims=  {offX:16, offY:4, wide:32, tall:64, vizWide:64, vizTall:128};
    this.sprites = [];
    this.anims   = {};
    this.curSpriteIdx=0;
    this.curAnim = 'WALK_LEFT';
    
    this.loadSprites();
    this.loadAnims();
  }

  loadSprites(){
    let [offX,offY,wide,tall] = [this.sprDims.offX,this.sprDims.offY,this.sprDims.wide,this.sprDims.tall];
    for (let r=0; r<5; r++) {
      for (let c=0; c<7; c++) {
        this.sprites.push(sheet.get(offX+(c*wide), offY+(r*tall), wide, tall));
      }
    }
  }

  // maybe keep standin pose as first element, and skip over (i.e. 2nd-to-7th) unless velocity is zero?
  loadAnims(){
    let s = this.sprites;
    this.anims = {
      WALK_UP:    {nFrames:6, mirror:false, frames:[ s[1], s[2], s[3], s[4], s[5], s[6]]},
      WALK_DOWN:  {nFrames:6, mirror:false, frames:[ s[8], s[9],s[10],s[11],s[12],s[13]]},
      WALK_RIGHT: {nFrames:6, mirror:false, frames:[s[15],s[16],s[17],s[18],s[19],s[20]]},
      WALK_LEFT:  {nFrames:6, mirror:true,  frames:[s[15],s[16],s[17],s[18],s[19],s[20]]},
      WALK_DG_DR: {nFrames:6, mirror:false, frames:[s[22],s[23],s[24],s[25],s[26],s[27]]},
      WALK_DG_DL: {nFrames:6, mirror:true,  frames:[s[22],s[23],s[24],s[25],s[26],s[27]]},
      WALK_DG_UR: {nFrames:6, mirror:false, frames:[s[29],s[30],s[31],s[32],s[33],s[34]]},
      WALK_DG_UL: {nFrames:6, mirror:true,  frames:[s[29],s[30],s[31],s[32],s[33],s[34]]},
    }
  }

  /*
        0 →  22.5  ⇒  [R]      
     22.5 →  67.5  ⇒ [UR]
     67.5 → 112.5  ⇒ [UP]
    112.5 → 157.5  ⇒ [UL]
    157.5 → 180    ⇒  [L]

        0 →  -22.5  ⇒  [R]      
     -22.5 →  -67.5  ⇒ [BR]
     -67.5 → -112.5  ⇒ [B]
    -112.5 → -157.5  ⇒ [BL]
    -157.5 → -180    ⇒  [L]
  */
  update(){

    if(mouseInCanvas()){
      let mousePos = mousePtToVec();

      if(vectorManhattanDist(this.pos,mousePos)<64){return;}

      let ang = p5.Vector.sub(mousePos,this.pos).heading()*-1;
      let dir = 'WALK_'

      switch(Math.sign(ang)){
        case 1:  dir += (ang<=22.5) ? 'RIGHT' : (ang<=67.5) ? 'DG_UR' : (ang<=112.5) ? 'UP' : (ang<=157.5) ? 'DG_UL' : 'LEFT'; break;
        case -1: ang*=-1; dir += (ang<=22.5) ? 'RIGHT' : (ang<=67.5) ? 'DG_DR' : (ang<=112.5) ? 'DOWN' : (ang<=157.5) ? 'DG_DL' : 'LEFT'; break;
      }

      if(dir!=this.curAnim){this.curAnim=dir; this.curSpriteIdx=0;}

      let qadDeltaPos  = 1.5;
      let qadDeltDiag = qadDeltaPos*0.7071; 
      switch(this.curAnim){
        case 'WALK_UP'    : this.pos.add(           0, -qadDeltaPos); return;
        case 'WALK_DOWN'  : this.pos.add(           0,  qadDeltaPos); return;
        case 'WALK_RIGHT' : this.pos.add( qadDeltaPos,            0); return;
        case 'WALK_LEFT'  : this.pos.add(-qadDeltaPos,            0); return;

        case 'WALK_DG_DR' : this.pos.add( qadDeltDiag,  qadDeltDiag); return;
        case 'WALK_DG_DL' : this.pos.add(-qadDeltDiag,  qadDeltDiag); return;
        case 'WALK_DG_UR' : this.pos.add( qadDeltDiag, -qadDeltDiag); return;
        case 'WALK_DG_UL' : this.pos.add(-qadDeltDiag, -qadDeltDiag); return;
      }
    }
  }

  render(){
    imageMode(CENTER);
    push();
      translate(this.pos.x, this.pos.y);
      if(this.anims[this.curAnim].mirror){scale(-1,1);}
      image(this.anims[this.curAnim].frames[this.curSpriteIdx],0,0,this.sprDims.vizWide,this.sprDims.vizTall);
    pop();
      
    if(frameCount%this.anims[this.curAnim].nFrames==0){
      this.curSpriteIdx = (this.curSpriteIdx+1)%this.anims[this.curAnim].nFrames;
    }
  }

}