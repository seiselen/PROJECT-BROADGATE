class SegSnake{
  constructor(pos,lenSegs,numSegs,widSegs){
    this.pos = pos;
    this.vel = vec2(0,0);
    this.acc = vec2(0,0);
    this.maxSpeed = 5;
    this.maxForce = .15;
    this.slowDist = this.maxSpeed*27;
    this.bordDist = 36;
    this.segLen = lenSegs;
    this.segNum = numSegs;
    this.segWid = widSegs;

    this.initSegs();

  }

  initSegs(){
    let cur = new SnakeSeg(this.pos,this.segLen,this.segWid);
    let next;
    for (var i = 0; i < this.segNum; i++) {
      next = new SnakeSeg(cur.pt2,this.segLen,i+this.segWid);
      next.pred = cur;
      cur.succ = next;
      cur = next;
    }
    this.head = cur;
  }
  
  update(toFollow){
    // STEERING AGENT BEHAVIOR WOULD/WILL GO HERE, THEN UPDATES STATE FOR 'head'

    this.applyForce(this.arrive(toFollow));

    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.obeyBounds();
    this.pos.add(this.vel);
    this.acc.mult(0);


    this.head.follow(this.pos);  
    this.head.update();
    let next = this.head.pred;
    while(next!=null){
      next.follow();
      next.update(); 
      next = next.pred;
    }
  } // Ends Function update

  applyForce(force){
    this.acc.add(force);
  };

  seek(tarVec){
    var des = p5.Vector.sub(tarVec,this.pos);     // Desired vector from position to target
    des.setMag(this.maxSpeed);               // Scale desired vector to maximum speed
    var steer = p5.Vector.sub(des,this.vel); // Steering = Desired minus velocity
    steer.limit(this.maxForce);              // Limit to maximum steering force    
    return steer;                            // Return force - effecting acceleration
  } // Ends Behavior seek


  arrive(t){ 
    var des = p5.Vector.sub(t,this.pos);
    var dist = des.mag();
    var speed = this.maxSpeed;   
    if(dist<this.slowDist){speed=map(dist,0,this.slowDist,0,this.maxSpeed);} // if within range, slow down as d decreases
    des.setMag(speed);
    var steer = p5.Vector.sub(des,this.vel); 
    steer.limit(this.maxForce);     
    return steer;
  } // Ends Behavior arrive


  obeyBounds(){
    if (this.pos.x < this.bordDist)            {this.vel.set(this.maxSpeed,this.vel.y);}     
    else if (this.pos.x > width-this.bordDist) {this.vel.set(-this.maxSpeed,this.vel.y);} 
    if (this.pos.y < this.bordDist)            {this.vel.set(this.vel.x,this.maxSpeed);}    
    else if (this.pos.y > height-this.bordDist){this.vel.set(this.vel.x,-this.maxSpeed);}   
  } // Ends Behavior obeyBounds 

  render(){
    this.head.render();
  } // Ends Function render 


} // Ends Class Snake