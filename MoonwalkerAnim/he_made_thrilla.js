/*> 'Dir -given- Angle' Vals
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


class KingOfPop{

  constructor(xPos=0,yPos=0){
    this.pos = vec2(xPos,yPos);
    this.vel = vec2();

    this.speedFore = 1.5;
    this.speedDiag = this.speedFore*0.7071;

    // Sprite Related Vals
    this.walkSpriteDims = {offX:16, offY:4, wide:32, tall:64, vizWide:64, vizTall:128};
    this.animSpriteDims = {offX:0, offY:0, wide:64, tall:64, vizWide:128, vizTall:128};
    this.walkSprites = [];
    this.animSprites = [];
    this.anims   = {};
    this.curSpriteIdx=0;
    this.curAnim = 'STAND_DOWN';
    this.isIdle = true;
    this.isDoingMotion = false;
    this.frameOnEnterIdle = -1;
    this.framesBetweenIdleActs = 16*8;

    this.loadWalkSprites();
    this.loadAnimSprites();
    this.loadAnims();
  }

  loadWalkSprites(){
    let [offX,offY,wide,tall] = [this.walkSpriteDims.offX,this.walkSpriteDims.offY,this.walkSpriteDims.wide,this.walkSpriteDims.tall];
    for (let r=0; r<5; r++) {
      for (let c=0; c<7; c++) {
        this.walkSprites.push(sheetWalkAnims.get(offX+(c*wide), offY+(r*tall), wide, tall));
      }
    }
  }

  getSprite(sheet,row,col,wide,tall,offX=0,offY=0){
    return sheet.get(offX+(col*wide), offY+(row*tall), wide, tall);
  }

  loadAnimSprites(){
    let [nRows,nCols] = [7,8];

    let i = 0;
    for (let r=0; r<nRows; r++) {
      for (let c=0; c<nCols; c++) {
        if(i!=12&&i!=13&&i!=14&&i!=15&&i!=34&&i!=35&&i!=36&&i!=37&&i!=38&&i!=39&&i!=46&&i!=47&&i!=54&&i!=55){
          this.animSprites.push(this.getSprite(sheetIdleAnims,r,c,64,64));
        }
        i++;
      }
    }
  }

  // maybe keep standin pose as first element, and skip over (i.e. 2nd-to-7th) unless velocity is zero?
  loadAnims(){
    let s = this.walkSprites;

    this.anims.WALK_UP    =  {type:'w', deltaF:4, nFrames:6, mirror:false, frames:[ s[1], s[2], s[3], s[4], s[5], s[6]]};
    this.anims.WALK_DOWN  =  {type:'w', deltaF:4, nFrames:6, mirror:false, frames:[ s[8], s[9],s[10],s[11],s[12],s[13]]};
    this.anims.WALK_RIGHT =  {type:'w', deltaF:4, nFrames:6, mirror:false, frames:[s[15],s[16],s[17],s[18],s[19],s[20]]};
    this.anims.WALK_LEFT  =  {type:'w', deltaF:4, nFrames:6, mirror:true,  frames:[s[15],s[16],s[17],s[18],s[19],s[20]]};
    this.anims.WALK_DG_DR =  {type:'w', deltaF:4, nFrames:6, mirror:false, frames:[s[22],s[23],s[24],s[25],s[26],s[27]]};
    this.anims.WALK_DG_DL =  {type:'w', deltaF:4, nFrames:6, mirror:true,  frames:[s[22],s[23],s[24],s[25],s[26],s[27]]};
    this.anims.WALK_DG_UR =  {type:'w', deltaF:4, nFrames:6, mirror:false, frames:[s[29],s[30],s[31],s[32],s[33],s[34]]};
    this.anims.WALK_DG_UL =  {type:'w', deltaF:4, nFrames:6, mirror:true,  frames:[s[29],s[30],s[31],s[32],s[33],s[34]]};

    this.anims.STAND_UP    = {type:'w', deltaF:1, nFrames:1, mirror:false, frames:[ s[0]]};
    this.anims.STAND_DOWN  = {type:'w', deltaF:1, nFrames:1, mirror:false, frames:[ s[7]]};
    this.anims.STAND_RIGHT = {type:'w', deltaF:1, nFrames:1, mirror:false, frames:[s[14]]};
    this.anims.STAND_LEFT  = {type:'w', deltaF:1, nFrames:1, mirror:true,  frames:[s[14]]};
    this.anims.STAND_DG_DR = {type:'w', deltaF:1, nFrames:1, mirror:false, frames:[s[21]]};
    this.anims.STAND_DG_DL = {type:'w', deltaF:1, nFrames:1, mirror:true,  frames:[s[21]]};
    this.anims.STAND_DG_UR = {type:'w', deltaF:1, nFrames:1, mirror:false, frames:[s[28]]};
    this.anims.STAND_DG_UL = {type:'w', deltaF:1, nFrames:1, mirror:true,  frames:[s[28]]};

    s = this.animSprites;

    this.anims.MOTION_A    = {type:'a', deltaF:6, nFrames:16, mirror:false, frames:[ s[0], s[1], s[2], s[3], s[4], s[5], s[6], s[7], s[8], s[9],s[10],s[11],s[12],s[13],s[14],s[15]]};
    this.anims.MOTION_B    = {type:'a', deltaF:6, nFrames:16, mirror:false, frames:[ s[0], s[1], s[2], s[3], s[4], s[5], s[6], s[7], s[8], s[9],s[10],s[11],s[16],s[17],s[18],s[19]]};
    this.anims.MOTION_C    = {type:'a', deltaF:6, nFrames:16, mirror:false, frames:[s[20],s[21],s[22],s[23],s[24],s[25],s[26],s[27],s[28],s[29],s[30],s[31],s[32],s[33],s[34],s[35]]};
    this.anims.MOTION_D    = {type:'a', deltaF:6, nFrames:16, mirror:false, frames:[s[20],s[21],s[22],s[23],s[24],s[25],s[26],s[27],s[28],s[29],s[36],s[37],s[38],s[39],s[40],s[41]]};
  }


  update(){

    if(this.isDoingMotion){return;}

    let mousePos = mousePtToVec();
    let ang = p5.Vector.sub(mousePos,this.pos).heading()*-1;

    if(mouseInCanvas()){
      let dist = vectorManhattanDist(this.pos,mousePos);
      if(dist<120 || dist>480){this.state_idle(ang);return;}
      this.state_walk(ang); return;
    }

    this.state_idle(ang);
  }

  state_idle(ang){
    if(!this.isIdle){this.isIdle=true;}
    this.state_stand(ang);

    if(frameCount%60==0&&round(random(100))<10){
      this.state_motion();
    }

  }


  state_anim(animID){
    this.curAnim = `MOTION_${animID}`;
    this.curSpriteIdx=0;
  }


  state_stand(ang){
    let dir= 'STAND_';
    switch(Math.sign(ang)){
      case 1:  dir += (ang<=22.5) ? 'RIGHT' : (ang<=67.5) ? 'DG_UR' : (ang<=112.5) ? 'UP' : (ang<=157.5) ? 'DG_UL' : 'LEFT'; break;
      case -1: ang*=-1; dir += (ang<=22.5) ? 'RIGHT' : (ang<=67.5) ? 'DG_DR' : (ang<=112.5) ? 'DOWN' : (ang<=157.5) ? 'DG_DL' : 'LEFT'; break;
    }        
    if(dir!=this.curAnim){this.curAnim=dir; this.curSpriteIdx=0;}   
    return;
  }


  state_walk(ang){
    if(this.isIdle){this.isIdle=false;}

    let dir = 'WALK_';

    switch(Math.sign(ang)){
      case 1:  dir += (ang<=22.5) ? 'RIGHT' : (ang<=67.5) ? 'DG_UR' : (ang<=112.5) ? 'UP' : (ang<=157.5) ? 'DG_UL' : 'LEFT'; break;
      case -1: ang*=-1; dir += (ang<=22.5) ? 'RIGHT' : (ang<=67.5) ? 'DG_DR' : (ang<=112.5) ? 'DOWN' : (ang<=157.5) ? 'DG_DL' : 'LEFT'; break;
    }

    if(dir!=this.curAnim){this.curAnim=dir; this.curSpriteIdx=0;}

    switch(this.curAnim){
      case 'WALK_UP'    : this.pos.add(              0, -this.speedFore); return;
      case 'WALK_DOWN'  : this.pos.add(              0,  this.speedFore); return;
      case 'WALK_RIGHT' : this.pos.add( this.speedFore,               0); return;
      case 'WALK_LEFT'  : this.pos.add(-this.speedFore,               0); return;

      case 'WALK_DG_DR' : this.pos.add( this.speedDiag,  this.speedDiag); return;
      case 'WALK_DG_DL' : this.pos.add(-this.speedDiag,  this.speedDiag); return;
      case 'WALK_DG_UR' : this.pos.add( this.speedDiag, -this.speedDiag); return;
      case 'WALK_DG_UL' : this.pos.add(-this.speedDiag, -this.speedDiag); return;
    }
  }

 
  state_motion(mID=undefined){
    if(!this.isIdle){return;}
    this.isDoingMotion = true;

    if(mID===undefined){
      switch(round(random(3))){
        case 0: mID = 'A'; break;
        case 1: mID = 'B'; break;
        case 2: mID = 'C'; break;
        case 3: mID = 'D'; break;
      }
    }

    mjSounds[round(random(2))].play();
 
    this.curAnim = `MOTION_${mID}`;
    this.curSpriteIdx=0;
  }

  stop_current_motion(){
    this.isDoingMotion = false;
  }


  render(){
    let anim = this.anims[this.curAnim];
    imageMode(CENTER);
    push();
      translate(this.pos.x, this.pos.y);
      if(anim.mirror){scale(-1,1);}
      // because P5JS fucking only takes (x,y,wide,tall) numbers and not (pos,size) vectors...
      switch(anim.type){
        case 'w': image(anim.frames[this.curSpriteIdx],0,0, this.walkSpriteDims.vizWide,this.walkSpriteDims.vizTall); break;
        case 'a': image(anim.frames[this.curSpriteIdx],0,0, this.animSpriteDims.vizWide,this.animSpriteDims.vizTall); break;
      }
    pop();


    if(frameCount%this.anims[this.curAnim].deltaF==0){
      if(this.isDoingMotion && this.curSpriteIdx+1==this.anims[this.curAnim].nFrames){this.stop_current_motion();}
      this.curSpriteIdx = (this.curSpriteIdx+1)%this.anims[this.curAnim].nFrames;
    }
  }

}