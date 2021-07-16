class VoronoiDiagram{
  constructor(bbox,nVerts,minVertDist){
    this.bbox     = bbox;
    this.numVerts = nVerts;
    this.minVDist = minVertDist;
    this.VDUtil   = new Voronoi();
    this.vertUtil = new VertUtil(this.bbox,nVerts,minVertDist);

    // VFX Settings
    this.strk_allEdges = color(0,120,36); 
    this.sWgt_allEdges = 2;

    this.initVD();
  }

  initVD(){
    this.VD = this.VDUtil.compute(this.vertUtil.vertListToSiteList(), this.bbox.getBoundsVD());
  }

  resetVD(){
    this.vertUtil.resetVertSet();
    this.VD = this.VDUtil.compute(this.vertUtil.vertListToSiteList(), this.bbox.getBoundsVD());
  }

  smoothCellsViaBBoxMidpt(){
    this.vertUtil.setVertListFromVDSiteList(this.getMinBoundRectMidptAllCells());
    this.initVD();    
  }

  // FPS is behaving perfectly, so no need for special 'only if pt actually moved' handling!
  onMousePressed(){this.vertUtil.onMousePressed();}
  onMouseDragged(){this.vertUtil.onMouseDragged(); this.initVD();}
  onMouseReleased(){this.vertUtil.onMouseReleased(); this.initVD();}


  //####################################################################
  //>>> GETTER FUNCTIONS
  //####################################################################
  getCellIdxAtMousePt(){
    if(!CanvUtil.mouseInCanvas()){return -1;}
    let minDist = 9999; let minIdx  = -1; let curDist;
    for(let i=0; i<this.VD.cells.length; i++){
      curDist = dist(this.VD.cells[i].site.x,this.VD.cells[i].site.y,mouseX,mouseY);
      if(curDist<minDist){minDist = curDist; minIdx  = i;}
    }
    return minIdx;
  }

  getMinBoundRectMidpt(cell){
    let bounds = {minX:9999,minY:9999,maxX:-9999,maxY:-9999}; let curEdge;
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

  findHEPair(cell,q){
    let i_edge;
    for(let i=1; i<cell.halfedges.length; i++){
      i_edge = cell.halfedges[i].edge;
      if(q.edge==i_edge){continue;}
      if(this.vertsEqual(q.edge[q.vID],i_edge.va)){return {edge: i_edge, vID: "vb"};}
      if(this.vertsEqual(q.edge[q.vID],i_edge.vb)){return {edge: i_edge, vID: "va"};}
    }
  }

  vertsEqual(v1,v2){
    return (abs(v1.x-v2.x)<0.01)&&(abs(v1.y-v2.y)<0.01);
  }

  getMinBoundRectMidptAllCells(){
    let ret = []; 
    this.VD.cells.forEach((c)=>ret.push(this.getMinBoundRectMidpt(c))); 
    return ret;
  }


  //####################################################################
  //>>> RENDER FUNCTIONS
  //####################################################################
  render(){
    this.renderBBox();
    this.renderVerts();
    this.renderVDEdges();
    this.drawVDCellAtMousePt();
  }

  renderBBox(){
    this.bbox.renderBorder();
  }

  renderVerts(){
    this.vertUtil.renderVerts();
  }

  renderVDEdges(){
    noFill(); stroke(this.strk_allEdges); strokeWeight(this.sWgt_allEdges); 
    this.VD.edges.forEach((e) => this.drawEdge(e.va, e.vb));
  }

  drawCellEdges(cell){
    stroke(0,216,0,128); strokeWeight(4); 
    cell.halfedges.forEach((h) => this.drawEdge(h.edge.va, h.edge.vb));
  }

  drawEdge(va,vb){
    line(va.x,va.y,vb.x,vb.y);
  }

  drawVDCellAtIdx(idx){
    if(idx>-1 && idx<this.VD.cells.length){
      this.drawCellEdges(this.VD.cells[idx]); this.drawCellNgon(this.VD.cells[idx]);
    }
  }

  drawVDCellAtMousePt(){
    this.drawVDCellAtIdx(this.getCellIdxAtMousePt());
  }

  drawCellNgon(cell){
    let cur;
    noStroke(); fill(0,216,0,64);
    beginShape();
      cur = {edge:cell.halfedges[0].edge, vID:"vb"}
      vertex(cur.edge.va.x, cur.edge.va.y); vertex(cur.edge.vb.x, cur.edge.vb.y);
      for(let i=1; i<cell.halfedges.length; i++){cur=this.findHEPair(cell,cur); vertex(cur.edge[cur.vID].x, cur.edge[cur.vID].y);}
    endShape(CLOSE);  
  }

  drawVDCellMidptAtIdx(idx){
    if(idx>-1 && idx<this.VD.cells.length){
      let mpt = this.getMinBoundRectMidpt(this.VD.cells[idx]); 
      stroke(0,72,0); strokeWeight(1); fill(0,255,0); ellipse(mpt.x,mpt.y,this.diam_vertPts,this.diam_vertPts);
    } 
  }

  drawVDCellMidptAtMousePt(){this.drawVDCellMidptAtIdx(this.getCellIdxAtMousePt());}

} // Ends Class VoronoiManager