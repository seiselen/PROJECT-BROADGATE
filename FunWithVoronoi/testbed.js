

class VDManager{
  constructor(bbox,nVerts,minVertDist){
    this.bbox     = bbox;
    this.numVerts = nVerts;
    this.minVDist = minVertDist;
    this.VDUtil   = new Voronoi();

    this.init();
  }

  init(){
    this.verts = VertUtil.createVertSetMinDist(this.bbox.getBoundsPC(),this.numVerts,this.minVDist);
    this.initVD();
  }

  initVD(){
    this.VD = this.VDUtil.compute(VertUtil.vertListToSitesList(this.verts), this.bbox.getBoundsVD());
  }

  smoothCellsViaBBoxMidpt(){
    this.verts = VertUtil.createVertListFromSiteList(VDManager.getBBoxMidptAllCells(this.VD.cells));
    this.initVD();    
  }




  render(){
    this.bbox.render();
    VertUtil.renderVerts(this.verts);
    VDManager.drawAllEdges(this.VD.edges);
    //VDManager.drawVDCellAtMousePt(this.VD.cells);
    //VDManager.drawMouseCellBBoxMidpt(this.VD.cells);
  }

  static findHEPair(cell,edgeQ,id){
    let edgeI;
    for(let i=1; i<cell.halfedges.length; i++){
      edgeI = cell.halfedges[i].edge;
      if(edgeQ==edgeI){continue;}
      if(VDManager.vertsEqual(edgeQ[id],edgeI.va)){return {edge: edgeI , VID: "vb"};}
      if(VDManager.vertsEqual(edgeQ[id],edgeI.vb)){return {edge: edgeI , VID: "va"};}
    }
  }

  static vertsEqual(v1,v2){
    return (abs(v1.x-v2.x)<0.01)&&(abs(v1.y-v2.y)<0.01);
  }


  static getCellIdxAtMousePt(cells){
    let minDist = 9999;
    let minIdx  = -1;
    let curDist;

    if(!CanvUtil.mouseInCanvas()){return -1;}

    for(let i=0; i<cells.length; i++){
      curDist = dist(cells[i].site.x,cells[i].site.y,mouseX,mouseY);
      if(curDist<minDist){
        minDist = curDist;
        minIdx  = i;
      }
    }
    return minIdx;
  }


  static getBBoxMidptAllCells(cells){
    let ret = [];
    cells.forEach((c)=>ret.push(VDManager.getCellBBoxMidpt(c)));
    return ret;
  }


  static getCellBBoxMidpt(cell){
    let bounds = {minX:9999,minY:9999,maxX:-9999,maxY:-9999};
    let curEdge;

    for(let i=0; i<cell.halfedges.length; i++){
      curEdge = cell.halfedges[i].edge;
      if(curEdge.va.x < bounds.minX){bounds.minX = curEdge.va.x;}
      if(curEdge.va.x > bounds.maxX){bounds.maxX = curEdge.va.x;}
      if(curEdge.va.y < bounds.minY){bounds.minY = curEdge.va.y;}
      if(curEdge.va.y > bounds.maxY){bounds.maxY = curEdge.va.y;}
      if(curEdge.vb.x < bounds.minX){bounds.minX = curEdge.vb.x;}
      if(curEdge.vb.x > bounds.maxX){bounds.maxX = curEdge.vb.x;}
      if(curEdge.vb.y < bounds.minY){bounds.minY = curEdge.vb.y;}
      if(curEdge.vb.y > bounds.maxY){bounds.maxY = curEdge.vb.y;}
    }
    let mptX = lerp(bounds.minX,bounds.maxX,0.5);
    let mptY = lerp(bounds.minY,bounds.maxY,0.5);
    return {x:mptX,y:mptY};
  }



  static drawMouseCellBBoxMidpt(cells,diam=8){
    let idx = VDManager.getCellIdxAtMousePt(cells);
    if(idx>-1){
      let mpt = VDManager.getCellBBoxMidpt(cells,idx);
      stroke(0,72,0); strokeWeight(1); fill(0,255,0);
      ellipse(mpt.x,mpt.y,diam,diam);
    } 
  }


  static drawCellBBoxMidpt(cells,idx){

  }


  static drawAllEdges(edges){noFill(); stroke(0,120,36); strokeWeight(2); edges.forEach((e) => VDManager.drawEdge(e.va, e.vb));}

  static drawCellEdges(cells,idx){stroke(0,216,0,128); strokeWeight(4); cells[idx].halfedges.forEach((h) => VDManager.drawEdge(h.edge.va, h.edge.vb));}

  static drawCellNgon(cells,idx){
    let curEdge; let curVID;
    noStroke(); fill(0,216,0,64);
    beginShape();
      curEdge = cells[idx].halfedges[0].edge;
      curVID = "vb";
      vertex(curEdge.va.x, curEdge.va.y);
      vertex(curEdge.vb.x, curEdge.vb.y);
      let info;
      for(let i=1; i<cells[idx].halfedges.length; i++){
        info = VDManager.findHEPair(cells[idx],curEdge,curVID);
        curEdge = info.edge;
        curVID  = info.VID
        vertex(curEdge[curVID].x, curEdge[curVID].y);
      }
    endShape(CLOSE);  
  }

  static drawVDCellAtIdx(cells,idx){
    if(idx>-1 && idx< cells.length){
      VDManager.drawCellEdges(cells,idx);
      VDManager.drawCellNgon(cells,idx);
    }
  }

  static drawVDCellAtMousePt(cells){
    let idx = VDManager.getCellIdxAtMousePt(cells);
    if(idx>-1){
      VDManager.drawCellEdges(cells,idx);
      VDManager.drawCellNgon(cells,idx);
    }
  }


  static drawEdge(va,vb){line(va.x,va.y,vb.x,vb.y);}
} // Ends Class VoronoiManager