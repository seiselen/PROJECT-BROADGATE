class Segment{
  constructor(pt1,len){
    this.pt1 = pt1;
    this.pt2 = createVector(0,0);
    this.len = len;
    this.setPt2();
  }

  setPt1(pt1){
    this.pt1 = pt1.copy();
    this.setPt2();
  }

  setPt2(pt2){
    this.pt2.x = this.pt1.x + (this.len * cos(this.ang));
    this.pt2.y = this.pt1.y + (this.len * sin(this.ang));
  }

  follow(tar = this.succ.pt1){
    let dir = p5.Vector.sub(tar,this.pt1);
    this.ang = dir.heading();
    dir.setMag(this.len);
    dir.mult(-1);
    this.pt1 = p5.Vector.add(tar,dir);
  }

  update(){
    this.setPt2();
  }

  render(){
    stroke(random(180,255));
    strokeWeight(3);
    line(this.pt1.x,this.pt1.y,this.pt2.x,this.pt2.y); 
  } // Ends Function render

} // Ends Class Segment


class SnakeSeg extends Segment{
  constructor(pos, len, rad){
    super(pos,len);
    this.pred = null;
    this.succ = null;
    this.rad = rad;
  }

  render(){
    stroke(random(180,255));
    strokeWeight(this.rad);
    line(this.pt1.x,this.pt1.y,this.pt2.x,this.pt2.y);
    if(this.pred!=null){this.pred.render();}  
  }
}