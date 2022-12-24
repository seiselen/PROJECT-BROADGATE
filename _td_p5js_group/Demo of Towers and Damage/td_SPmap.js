

class TDSPMap{

  constructor(cellsTall,cellsWide, cellSize){
    this.cellsTall = cellsTall;
    this.cellsWide = cellsWide;
    this.cellSize  = cellSize;
    this.cellSizeH = this.cellSize/2;
    this.map       = [];

    this.initMap();

    // for heatmap viz
    this.colL = color(222,235,247);
    this.colR = color(33,113,181);
  }

  initMap(){
    for (var r = 0; r < this.cellsTall; r++) {
      this.map[r]=[];
      for (var c = 0; c < this.cellsWide; c++) {
        this.map[r].push({});
      }
    }    
  } // Ends Function resetMap

  updatePos(agent){
    let newCoords = this.coordsViaPos(agent.pos);

    // am i in the same cell as last call? if so - do nothing.
    if(agent.spCell != null && 
      agent.spCell[0]==newCoords[0] &&
      agent.spCell[1]==newCoords[1] ){
      return;
    }


    if(agent.spCell != null){
      delete this.map[agent.spCell[0]][agent.spCell[1]][agent.ID];
    } 

    
    this.map[newCoords[0]][newCoords[1]][agent.ID] = agent;
    agent.spCell = newCoords;

  }

  getAgentsInCellList(list){
    let agents = [];

    for (var i = 0; i < list.length; i++) {
      agents = agents.concat(this.getAgentsAtCell(list[i]));
    }
    
    return agents;
  }

  getAgentsAtCell(rc){
    let agents = [];
    let cellVals = Object.values(this.map[rc[0]][rc[1]]);

    for (var i = 0; i < cellVals.length; i++) {
      agents.push(cellVals[i]);
    }

    return agents;
  }


  coordsViaPos(pos){
    return [Math.floor(pos.y/this.cellSize),Math.floor(pos.x/this.cellSize)];
  }

  render(){
    let temp;
    noStroke();
    for(var r=0; r<this.cellsTall; r++){
      for(var c=0; c<this.cellsWide; c++){
        temp = Object.keys(this.map[r][c]).length;
        if(temp==0){noFill();}
        else{fill(lerpColor(this.colL,this.colR,temp/5.0));}
        rect(c*this.cellSize,r*this.cellSize,this.cellSize,this.cellSize);

        //fill(255); noStroke();
        //text(temp, (c*this.cellSize)+this.cellSizeH, (r*this.cellSize)+this.cellSizeH);
      }
    }
  } // Ends Function render

}