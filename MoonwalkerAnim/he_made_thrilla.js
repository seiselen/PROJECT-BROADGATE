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
    this.pos        = vec2(xPos,yPos);
    this.vel        = vec2();
    this.maxSpeed   = 1.5;
    this.curCell    = null;
    this.curMoveTar = null;

    // Sprite Related Vals
    this.walkSpriteDims = {offX:16, offY:4, wide:32, tall:64, vizWide:64, vizTall:128};
    this.animSpriteDims = {offX:0, offY:0, wide:64, tall:64, vizWide:128, vizTall:128};
    this.walkSprites = [];
    this.animSprites = [];
    this.anims = {};
    this.curSpriteIdx=0;
    this.curAnim = 'STAND_DOWN';
    this.isIdle = true;
    this.isDoingMotion = false;
    this.spriteOffY = -48;

    this.loadSpritesAndAnims();
  }

  loadSpritesAndAnims(){
    this.loadWalkSprites(); this.loadAnimSprites(); this.loadAnims();
  }

  setPositionViaPos(xPos,yPos){
    [this.pos,this.curCell] = [vec2(xPos,yPos), GridMap.posToCoord(xPos,yPos)]; return this;
  }

  setPositionViaCoord(iRow,iCol){
    [this.pos,this.curCell] = [GridMap.coordToPos(iRow,iCol), [iRow,iCol]]; return this;
  }


  loadWalkSprites(){
    for (let r=0; r<5; r++){for (let c=0; c<7; c++){this.walkSprites.push(sheetWalkAnims.get(this.walkSpriteDims.offX+(c*this.walkSpriteDims.wide), this.walkSpriteDims.offY+(r*this.walkSpriteDims.tall), this.walkSpriteDims.wide, this.walkSpriteDims.tall));}}
  }

  getSprite(sheet,row,col,wide,tall,offX=0,offY=0){
    return sheet.get(offX+(col*wide), offY+(row*tall), wide, tall);
  }

  loadAnimSprites(){
    let i = 0; 
    for (let r=0; r<7; r++) {
      for (let c=0; c<8; c++) {
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

    this.anims.MOTION_0    = {type:'a', deltaF:6, nFrames:16, mirror:false, frames:[ s[0], s[1], s[2], s[3], s[4], s[5], s[6], s[7], s[8], s[9],s[10],s[11],s[12],s[13],s[14],s[15]]};
    this.anims.MOTION_1    = {type:'a', deltaF:6, nFrames:16, mirror:false, frames:[ s[0], s[1], s[2], s[3], s[4], s[5], s[6], s[7], s[8], s[9],s[10],s[11],s[16],s[17],s[18],s[19]]};
    this.anims.MOTION_2    = {type:'a', deltaF:6, nFrames:16, mirror:false, frames:[s[20],s[21],s[22],s[23],s[24],s[25],s[26],s[27],s[28],s[29],s[30],s[31],s[32],s[33],s[34],s[35]]};
    this.anims.MOTION_3    = {type:'a', deltaF:6, nFrames:16, mirror:false, frames:[s[20],s[21],s[22],s[23],s[24],s[25],s[26],s[27],s[28],s[29],s[36],s[37],s[38],s[39],s[40],s[41]]};
  }


  update(){
    if(this.isDoingMotion){return;}

    if(mouseInCanvas()){
      this.curCell = GridMap.posToCoord(...this.pos.array())
      let minLen = 9001;
      let minCoord = null;
      let dist;
      
      for (let r=this.curCell[0]-1; r<this.curCell[0]+2; r++) {
        for (let c=this.curCell[1]-1; c<this.curCell[1]+2; c++) {
          if(!GridMap.isValidCell(r,c)){continue;}
          dist = GridMap.coordToPos(r,c).dist(mousePtToVec());
          if(dist<minLen){minLen=dist; minCoord=[r,c]}
        }   
      }
      if(minCoord){this.curMoveTar = GridMap.coordToPos(...minCoord)}
    }

    this.moveToCurMoveTar_viaVelAndDotProd();

    if(this.vel.magSq()>0){this.anim_walk(p5.Vector.sub(this.curMoveTar,this.pos).heading()*-1)}
    else{this.anim_idle()}
  }

  moveToCurMoveTar_viaVelAndDotProd(){
    if(this.curMoveTar){
      let des = p5.Vector.sub(this.curMoveTar,this.pos).setMag(this.maxSpeed);
      let str = p5.Vector.sub(des,this.vel);
      this.vel.add(str).limit(this.maxSpeed);

      let newPos = p5.Vector.add(this.pos,this.vel); // this is the position i will be at upon effecting vel without clamping
      let vecT_0 = p5.Vector.sub(this.curMoveTar,this.pos); // get ori at t_0 (i.e. pre-update)
      let vecT_1 = p5.Vector.sub(this.curMoveTar,newPos);   // get ori at t_1 (i.e. on-update a.k.a. 'lookahead')

      if(p5.Vector.dot(vecT_0,vecT_1)<0){this.pos.set(this.curMoveTar); this.curMoveTar=null; this.vel.mult(0);}
      else{this.pos.set(newPos)};
    } 
    else{
      this.vel.mult(0);
    }
  } // Ends Function moveToCurMoveTar

  anim_idle(){
    if(!this.isIdle){this.isIdle=true; this.anim_stand(int(random(-180,180)))}
    if(frameCount%240==0){this.anim_stand(int(random(-180,180)))}
    else if(frameCount%60==0&&round(random(100))<10){this.anim_motion();}
  }

  anim_stand(ang){
    let dir= 'STAND_';
    switch(Math.sign(ang)){
      case 1:  dir += (ang<=22.5) ? 'RIGHT' : (ang<=67.5) ? 'DG_UR' : (ang<=112.5) ? 'UP' : (ang<=157.5) ? 'DG_UL' : 'LEFT'; break;
      case -1: ang*=-1; dir += (ang<=22.5) ? 'RIGHT' : (ang<=67.5) ? 'DG_DR' : (ang<=112.5) ? 'DOWN' : (ang<=157.5) ? 'DG_DL' : 'LEFT'; break;
    }        
    if(dir!=this.curAnim){this.curAnim=dir; this.curSpriteIdx=0;}   
    return;
  }   

  anim_walk(ang){
    if(this.isIdle){this.isIdle=false;}

    let dir = 'WALK_';
    switch(Math.sign(ang)){
      case 0:  case -0: dir+='RIGHT'; break
      case 1:  dir += (ang<=22.5) ? 'RIGHT' : (ang<=67.5) ? 'DG_UR' : (ang<=112.5) ? 'UP' : (ang<=157.5) ? 'DG_UL' : 'LEFT'; break;
      case -1: ang*=-1; dir += (ang<=22.5) ? 'RIGHT' : (ang<=67.5) ? 'DG_DR' : (ang<=112.5) ? 'DOWN' : (ang<=157.5) ? 'DG_DL' : 'LEFT'; break;
    }
    if(dir!=this.curAnim){this.curAnim=dir; this.curSpriteIdx=0;}

  }

  anim_motion(){
    if(!this.isIdle){return;}
    this.isDoingMotion = true;
    mjSounds[round(random(2))].play();
    this.curAnim = `MOTION_${round(random(3))}`;
    this.curSpriteIdx=0;
  }

  stop_current_motion(){
    this.isDoingMotion = false;
  }

  render(){
    let anim = this.anims[this.curAnim];
    if(!anim){console.log(this.curAnim);return;}
    push();
      translate(this.pos.x, this.pos.y);
      if(anim.mirror){scale(-1,1);}
      // because P5JS fucking only takes (x,y,wide,tall) numbers and not (pos,size) vectors...
      switch(anim.type){
        case 'w': image(anim.frames[this.curSpriteIdx],0,this.spriteOffY, this.walkSpriteDims.vizWide,this.walkSpriteDims.vizTall); break;
        case 'a': image(anim.frames[this.curSpriteIdx],0,this.spriteOffY, this.animSpriteDims.vizWide,this.animSpriteDims.vizTall); break;
      }
    pop();

    if(frameCount%this.anims[this.curAnim].deltaF==0){
      if(this.isDoingMotion && this.curSpriteIdx+1==this.anims[this.curAnim].nFrames){this.stop_current_motion();}
      this.curSpriteIdx = (this.curSpriteIdx+1)%this.anims[this.curAnim].nFrames;
    }
  }

}