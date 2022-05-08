class GameObject{
  constructor(){
    this.position = vec3();
    this.rotation = vec3();
    this.scale    = vec3(1,1,1);
    this.action   = null;
  }

  bindAction(action){
    this.action = action;
    return this; // for function chaining
  }

  render(){
    push();
    translate(this.position.x, this.position.y, this.position.z);
    rotateX(radians(this.rotation.x));
    rotateY(radians(this.rotation.y));
    rotateZ(radians(this.rotation.z));
    scale(this.scale.x, this.scale.y, this.scale.z);
    this.action();
    pop();
  }

} // Ends Class GameObject