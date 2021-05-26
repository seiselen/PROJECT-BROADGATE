function insertWord(root, word){
  var buffer = root;
  var curChar = '$';

  for(let i=0; i<word.length; i++){
    curChar = word.charAt(i);
    let child = findValInArray(curChar,buffer.children);
    if(child == null){
      let newNode = new TrieNode(curChar);
      buffer.children.push(newNode);
      buffer = newNode;
    }
    else{
      buffer = child;
    }
  }
  buffer.eow = true;
  resetTform(root);
}

function findValInArray(val,arr){
  for(let i=0; i<arr.length; i++){
    if(arr[i].val==val){return arr[i];}
  }
  return null;
}

function resetTform(root){
  root.calcBoundBox();
  root.calcNodePos( (width/2)-(root.dim.x/2), TRIE_OFF_Y);
}


class TrieNode{
  constructor(val,lev=-1){
    this.pos = createVector(0,0);
    this.dim = createVector(0,0);
    this.rad = NODE_DIM;
    this.mid = createVector(0,0);
    this.lev = lev;

    // Related to Trie State
    this.val = val;
    this.eow = false;
    this.children = [];
  } // Ends Constructor

  calcBoundBox(){
    this.children.forEach(c => c.calcBoundBox());

    this.dim.x = 0;
    this.dim.y = NODE_DIM;

    if(this.children.length == 0){
      this.dim.x = NODE_DIM;
    }
    else{
      this.children.forEach(c => {this.dim.x += c.dim.x});
      this.dim.x += (this.children.length-1) * NODE_PAD;
    }
  } // Ends Function calcBoundBox

  calcNodePos(posX, posY){
    this.pos.x = posX;
    this.pos.y = posY;
    this.mid.x = this.pos.x + (this.dim.x/2);
    this.mid.y = this.pos.y + (this.dim.y);

    let curWide = this.pos.x;

    this.children.forEach(c => {
      c.calcNodePos(curWide, this.pos.y+ TRIE_OFF_Y);
      curWide += c.dim.x + NODE_PAD;
    });
  } // Ends Function calcNodePos


  render(showBBox=false){
    this.children.forEach(child => this.renderSubtree(showBBox,child));
    if(showBBox){this.renderBBox();}
    this.renderNode();
  } // Ends Function render

  renderBBox(){
    noFill(); stroke(255,144,0);
    rect(this.pos.x, this.pos.y, this.dim.x , this.dim.y*2);
    stroke(255);
  }

  renderNode(){
    stroke(255); strokeWeight(2); fill(0,144,240);
    if(this.eow == true){fill(240,144,0);}
    ellipse(this.mid.x, this.mid.y, this.rad, this.rad);
    noStroke(); fill(255); text(this.val, this.mid.x, this.mid.y);
  }

  renderSubtree(showBBox,child){
    stroke(255); strokeWeight(2);
    line(this.mid.x,this.mid.y,child.mid.x,child.mid.y);
    child.render(showBBox);
  }

} // Ends Class DrawNode