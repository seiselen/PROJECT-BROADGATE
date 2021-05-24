class Tentacle{
  constructor(rootPos, segLen, numSegs){
    this.rootPos = rootPos;
    this.segLen  = segLen;
    this.numSegs = numSegs;

    this.segments = [];
    this.createSegments();
  } // Ends Constructor

  createSegments(){
    this.segments.push(new Segment(this.rootPos, this.segLen));
    for (let i=1; i<this.numSegs; i++) {
      this.segments.push(new Segment(this.segments[i-1].pt2,this.segLen));
    }
  } // Ends Function createSegments

  update(tar){
    let lastSeg = this.segments[this.numSegs-1];

    // TODO: call update within follow code? else keep decoupled?
    lastSeg.follow(tar);
    lastSeg.update();

    for(let i=this.numSegs-2; i>=0; i--){
      this.segments[i].follow(this.segments[i+1].pt1);
      this.segments[i].update(); 
    }

    this.segments[0].setPt1(this.rootPos);

    for(let i=1; i<this.numSegs; i++){
      this.segments[i].setPt1(this.segments[i-1].pt2); 
    }
  } // Ends Function update

  render(){
    for(let i=0; i<this.numSegs; i++){this.segments[i].render();}
  } // Ends Function render


  

} // Ends Class Tentacle