class ExplodeEffect{
  constructor(xPos,yPos){
    this.ID  = 'e'+Math.floor(Math.random()*16384);
    this.pos = vec2(xPos,yPos);

    this.totFrameCount = 60;
    this.curFrameCount = 0;
    this.framePct      = 0;
    this.isDead        = false;

    this.circle_minDiam = 12;
    this.circle_maxDiam = 240;
    this.circle_curDiam = this.updateCircleDiam();

    this.colormap = ["#FFF000","#E49000"].map(hexVal=>{return color(hexVal)});
    this.colAlpha = 255;

    objPool.insert(this);
  }

  getFramePct(){
    return this.curFrameCount/this.totFrameCount;
  }

  updateCircleDiam(){
    this.circle_curDiam = lerp(this.circle_minDiam,this.circle_maxDiam, sin(PI*this.getFramePct()));
  }

  update(){
    if(this.isDead){this.poolRef.addToKillList(this.ID);return;}
    this.curFrameCount++;
    this.updateCircleDiam();
    if(this.curFrameCount==this.totFrameCount){this.isDead=true;}
  }

  linMapCol(){
    this.framePct = this.getFramePct();
    this.colAlpha = (192*(1-this.framePct))+64;
    this.colormap[0].setAlpha(this.colAlpha); 
    this.colormap[1].setAlpha(this.colAlpha);
    return lerpColor(this.colormap[1],this.colormap[0],sin(PI*this.framePct));
  }

  render(){
    noStroke();
    fill(this.linMapCol());
    ellipse(this.pos.x,this.pos.y,this.circle_curDiam);
  }
}