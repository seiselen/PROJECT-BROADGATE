import VCell from "./VCell.mjs";
import VEdge from "./VEdge.mjs";
import VHalfEdge from "./VHalfEdge.mjs";
import VVertex from "./VVertex.mjs";
import VDiagram from "./VDiagram.mjs";

/** **VRBTree** (**V**oronoi **R**ed-**B**lack **Tree**) */
class VRBTree {
  constructor(){this.root=null;}
  getFirst(node){while (node.rbLeft){node=node.rbLeft;} return node;}
  getLast(node){while (node.rbRight){node=node.rbRight;} return node;} 
  rbRotateLeft(node){let p=node; let q=node.rbRight; let par=p.rbParent; if (par){if (par.rbLeft===p){par.rbLeft=q;} else {par.rbRight=q;}} else {this.root=q;} q.rbParent=par; p.rbParent=q; p.rbRight=q.rbLeft; if (p.rbRight){p.rbRight.rbParent=p;} q.rbLeft=p;}
  rbRotateRight(node){let p=node; let q=node.rbLeft; let par=p.rbParent; if (par){if (par.rbLeft===p){par.rbLeft=q;} else {par.rbRight=q;}} else {this.root=q;} q.rbParent=par; p.rbParent=q; p.rbLeft=q.rbRight; if (p.rbLeft){p.rbLeft.rbParent=p;} q.rbRight=p;}
  rbInsertSuccessor(node, successor){let parent; if (node){successor.rbPrevious=node;successor.rbNext=node.rbNext; if (node.rbNext){node.rbNext.rbPrevious=successor;} node.rbNext=successor; if (node.rbRight){node=node.rbRight; while (node.rbLeft){node=node.rbLeft;} node.rbLeft=successor;} else {node.rbRight=successor; } parent=node;} else if (this.root){node=this.getFirst(this.root); successor.rbPrevious=null; successor.rbNext=node; node.rbPrevious=successor; node.rbLeft=successor; parent=node;} else {successor.rbPrevious=successor.rbNext=null; this.root=successor; parent=null;} successor.rbLeft=successor.rbRight=null; successor.rbParent=parent; successor.rbRed=true; let grandpa,uncle; node=successor; while (parent && parent.rbRed){grandpa=parent.rbParent; if (parent===grandpa.rbLeft){uncle=grandpa.rbRight; if (uncle && uncle.rbRed){parent.rbRed=uncle.rbRed=false; grandpa.rbRed=true; node=grandpa;}else {if (node===parent.rbRight){this.rbRotateLeft(parent); node=parent; parent=node.rbParent;} parent.rbRed=false; grandpa.rbRed=true; this.rbRotateRight(grandpa);}} else {uncle=grandpa.rbLeft; if (uncle&&uncle.rbRed){parent.rbRed=uncle.rbRed=false; grandpa.rbRed=true; node=grandpa;}else {if (node===parent.rbLeft){this.rbRotateRight(parent); node=parent; parent=node.rbParent;} parent.rbRed=false; grandpa.rbRed=true; this.rbRotateLeft(grandpa);}} parent=node.rbParent;} this.root.rbRed=false;}
  rbRemoveNode(node){if (node.rbNext){node.rbNext.rbPrevious=node.rbPrevious;} if (node.rbPrevious){node.rbPrevious.rbNext=node.rbNext;} node.rbNext=node.rbPrevious=null; let parent=node.rbParent,left=node.rbLeft,right=node.rbRight,next; if (!left){next=right;} else if (!right){next=left;} else {next=this.getFirst(right);} if (parent){if (parent.rbLeft===node){parent.rbLeft=next;} else {parent.rbRight=next;}} else {this.root=next;}let isRed; if (left && right){isRed=next.rbRed; next.rbRed=node.rbRed; next.rbLeft=left; left.rbParent=next; if (next !== right){parent=next.rbParent; next.rbParent=node.rbParent; node=next.rbRight; parent.rbLeft=node; next.rbRight=right; right.rbParent=next;} else {next.rbParent=parent; parent=next; node=next.rbRight;}} else {isRed=node.rbRed; node=next;} if (node){node.rbParent=parent;} if (isRed){return;} if (node && node.rbRed){node.rbRed=false; return;} let sibling; do {if (node===this.root){break;} if (node===parent.rbLeft){sibling=parent.rbRight; if (sibling.rbRed){sibling.rbRed=false; parent.rbRed=true; this.rbRotateLeft(parent); sibling=parent.rbRight;} if ((sibling.rbLeft && sibling.rbLeft.rbRed) || (sibling.rbRight && sibling.rbRight.rbRed)){if (!sibling.rbRight || !sibling.rbRight.rbRed){sibling.rbLeft.rbRed=false; sibling.rbRed=true; this.rbRotateRight(sibling); sibling=parent.rbRight;} sibling.rbRed=parent.rbRed; parent.rbRed=sibling.rbRight.rbRed=false; this.rbRotateLeft(parent); node=this.root; break;}} else {sibling=parent.rbLeft; if (sibling.rbRed){sibling.rbRed=false; parent.rbRed=true; this.rbRotateRight(parent); sibling=parent.rbLeft;} if ((sibling.rbLeft && sibling.rbLeft.rbRed) || (sibling.rbRight && sibling.rbRight.rbRed)){if (!sibling.rbLeft || !sibling.rbLeft.rbRed){sibling.rbRight.rbRed=false;sibling.rbRed=true; this.rbRotateLeft(sibling); sibling=parent.rbLeft;} sibling.rbRed=parent.rbRed; parent.rbRed=sibling.rbLeft.rbRed=false; this.rbRotateRight(parent); node=this.root; break;}} sibling.rbRed=true; node=parent; parent=parent.rbParent;} while (!node.rbRed); if (node){node.rbRed=false;}}
}


/** **VBeachsection** (**V**oronoi **Beachsection**) */
class VBeachsection {constructor(in_site){this.init(in_site)} init(new_site){this.site=new_site;}}

/** **VCircleEvent** (**V**oronoi **Beachsection**) */
class VCircleEvent{constructor(){this.arc=null; this.rbLeft=null; this.rbNext=null; this.rbParent=null; this.rbPrevious=null; this.rbRed=false; this.rbRight=null; this.site=null; this.x=this.y=this.ycenter=0;}}

const EPSILON = 1e-9;
const EPSILON2 = 2e-12;
function equalWithEpsilon(a,b){return Math.abs(a-b)<EPSILON}
function greaterThanWithEpsilon(a,b){return a-b>EPSILON}
function lessThanWithEpsilon(a,b){return b-a>EPSILON}
function notEqualWithEpsilon(a,b){return !equalWithEpsilon(a,b)}

//==============================================================================

class Voronoi{
  constructor(){
    /** @type {VCell[]} */    
    this.cells=null;
    /** @type {VEdge[]} */       
    this.edges=null;
    /** @type {VVertex[]} */
    this.vertices=null;
    this.toRecycle=null;
    this.beachsectionJunkyard=[];
    this.circleEventJunkyard=[];
    this.vertexJunkyard=[];
    this.edgeJunkyard=[];
    this.cellJunkyard=[];
  }

  //==============================================================================
  //>>> VCell Methods
  //==============================================================================
  createCell(site){let cell=this.cellJunkyard.pop(); if(cell){return cell.init(site);} return new VCell(site);}

  //==============================================================================
  // VVertex/VSite Methods
  //==============================================================================
  createVertex(x,y){let v=this.vertexJunkyard.pop(); if(!v){v=new VVertex(x,y);} else {v.set(x,y);} this.vertices.push(v); return v;}

  //==============================================================================
  // VEdge/VHalfEdge methods
  //==============================================================================
  createHalfedge(edge,lSite,rSite){return new VHalfEdge(edge,lSite,rSite);}

  /** Creates and adds an edge to internal collection, and also creates two halfedges which are added to each site's counterclockwise array of halfedges. */
  createEdge(lSite,rSite,va,vb){let edge=this.edgeJunkyard.pop(); if(!edge){edge=new VEdge(lSite,rSite);} else {edge.set(lSite,rSite)} this.edges.push(edge); if(va){this.setEdgeStartpoint(edge,lSite,rSite,va);} if(vb){this.setEdgeEndpoint(edge,lSite,rSite,vb);} this.cells[lSite.voronoiId].halfedges.push(this.createHalfedge(edge,lSite,rSite)); this.cells[rSite.voronoiId].halfedges.push(this.createHalfedge(edge,rSite,lSite)); return edge;}
    
  createBorderEdge(lSite,va,vb){let edge=this.edgeJunkyard.pop(); if(!edge){edge=new VEdge(lSite,null);} else {edge.set(lSite,null);} edge.va=va; edge.vb=vb; this.edges.push(edge); return edge;}
  setEdgeStartpoint(edge,lSite,rSite,vertex){if(!edge.va&&!edge.vb){edge.va=vertex; edge.lSite=lSite; edge.rSite=rSite;} else if(edge.lSite===rSite){edge.vb=vertex;} else {edge.va=vertex;}}
  setEdgeEndpoint(edge,lSite,rSite,vertex){this.setEdgeStartpoint(edge,rSite,lSite,vertex)}

  //==============================================================================
  //>>> Beachline methods
  //==============================================================================
  createBeachsection(site){let beachsection=this.beachsectionJunkyard.pop(); if(!beachsection){beachsection= new VBeachsection(site)} beachsection.init(site); return beachsection;}
  leftBreakPoint(arc,dtrix){let site=arc.site, rfocx=site.x, rfocy=site.y, pby2=rfocy-dtrix; if(!pby2){return rfocx} let lArc=arc.rbPrevious; if(!lArc){return -Infinity} site=lArc.site; let lfocx=site.x, lfocy=site.y, plby2=lfocy-dtrix; if(!plby2){return lfocx} let hl=lfocx-rfocx, aby2=1/pby2-1/plby2, b=hl/plby2; if(aby2){return (-b+Math.sqrt(b*b-2*aby2*(hl*hl/(-2*plby2)-lfocy+plby2/2+rfocy-pby2/2)))/aby2+rfocx} return (rfocx+lfocx)/2;}
  rightBreakPoint(arc,dtrix){let rArc=arc.rbNext; if(rArc){return this.leftBreakPoint(rArc, dtrix)} let site=arc.site; return (site.y===dtrix?site.x:Infinity);}
  detachBeachsection(bsec){this.detachCircleEvent(bsec); this.beachline.rbRemoveNode(bsec); this.beachsectionJunkyard.push(bsec);}
  removeBeachsection(beachsection){let circle=beachsection.circleEvent,x=circle.x,y=circle.ycenter,vertex=this.createVertex(x, y),previous=beachsection.rbPrevious,next=beachsection.rbNext,disappearingTransitions=[beachsection]; this.detachBeachsection(beachsection); let lArc=previous;  while (lArc.circleEvent&&equalWithEpsilon(x,lArc.circleEvent.x)&&equalWithEpsilon(y,lArc.circleEvent.ycenter)){previous=lArc.rbPrevious; disappearingTransitions.unshift(lArc); this.detachBeachsection(lArc); lArc=previous;} disappearingTransitions.unshift(lArc); this.detachCircleEvent(lArc); let rArc=next; while (rArc.circleEvent&&equalWithEpsilon(x,rArc.circleEvent.x)&&equalWithEpsilon(y,rArc.circleEvent.ycenter)){next=rArc.rbNext; disappearingTransitions.push(rArc); this.detachBeachsection(rArc); rArc=next;} disappearingTransitions.push(rArc); this.detachCircleEvent(rArc); let nArcs=disappearingTransitions.length,iArc; for (iArc=1;iArc<nArcs;iArc++){rArc=disappearingTransitions[iArc]; lArc=disappearingTransitions[iArc-1]; this.setEdgeStartpoint(rArc.edge,lArc.site,rArc.site,vertex);} lArc=disappearingTransitions[0]; rArc=disappearingTransitions[nArcs-1]; rArc.edge=this.createEdge(lArc.site,rArc.site,undefined,vertex); this.attachCircleEvent(lArc); this.attachCircleEvent(rArc);}
  addBeachsection(site){let x=site.x,dtrix=site.y;let lArc,rArc,dxl,dxr,node=this.beachline.root; while (node){dxl=this.leftBreakPoint(node,dtrix)-x; if(dxl>EPSILON){node=node.rbLeft} else {dxr=x-this.rightBreakPoint(node,dtrix); if(dxr>EPSILON){if(!node.rbRight){lArc=node;break;} node=node.rbRight;} else {if(dxl>-EPSILON){lArc=node.rbPrevious;rArc=node;} else if(dxr>-EPSILON){lArc=node;rArc=node.rbNext;} else {lArc=rArc=node} break;}}} let newArc=this.createBeachsection(site); this.beachline.rbInsertSuccessor(lArc,newArc); if(!lArc&&!rArc){return;} if(lArc===rArc){this.detachCircleEvent(lArc); rArc=this.createBeachsection(lArc.site); this.beachline.rbInsertSuccessor(newArc,rArc); newArc.edge=rArc.edge=this.createEdge(lArc.site,newArc.site); this.attachCircleEvent(lArc); this.attachCircleEvent(rArc); return;} if(lArc&&!rArc){newArc.edge=this.createEdge(lArc.site,newArc.site); return;} if(lArc!==rArc){this.detachCircleEvent(lArc); this.detachCircleEvent(rArc); let lSite=lArc.site,ax=lSite.x,ay=lSite.y,bx=site.x-ax,by=site.y-ay,rSite=rArc.site,cx=rSite.x-ax,cy=rSite.y-ay,d=2*(bx*cy-by*cx),hb=bx*bx+by*by,hc=cx*cx+cy*cy,vertex=this.createVertex((cy*hb-by*hc)/d+ax,(bx*hc-cx*hb)/d+ay); this.setEdgeStartpoint(rArc.edge,lSite,rSite,vertex); newArc.edge=this.createEdge(lSite,site,undefined,vertex); rArc.edge=this.createEdge(site,rSite,undefined,vertex); this.attachCircleEvent(lArc); this.attachCircleEvent(rArc); return;}}

  //==============================================================================
  //>>> Circle event methods
  //==============================================================================
  attachCircleEvent(arc){let lArc=arc.rbPrevious,rArc=arc.rbNext; if(!lArc||!rArc){return;} let lSite=lArc.site,cSite=arc.site,rSite=rArc.site; if(lSite===rSite){return;} let bx=cSite.x,by=cSite.y,ax=lSite.x-bx,ay=lSite.y-by,cx=rSite.x-bx,cy=rSite.y-by; let d=2*(ax*cy-ay*cx); if(d>=-EPSILON2){return;} let ha=ax*ax+ay*ay,hc=cx*cx+cy*cy,x=(cy*ha-ay*hc)/d,y=(ax*hc-cx*ha)/d,ycenter=y+by; let circleEvent=this.circleEventJunkyard.pop(); if(!circleEvent){circleEvent=new VCircleEvent()} circleEvent.arc=arc; circleEvent.site=cSite; circleEvent.x=x+bx; circleEvent.y=ycenter+Math.sqrt(x*x+y*y); circleEvent.ycenter=ycenter; arc.circleEvent=circleEvent; let predecessor=null, node=this.circleEvents.root; while (node){if(circleEvent.y<node.y||(circleEvent.y===node.y&&circleEvent.x<=node.x)){if(node.rbLeft){node=node.rbLeft} else {predecessor=node.rbPrevious;break;}} else {if(node.rbRight){node=node.rbRight} else {predecessor=node;break;}}} this.circleEvents.rbInsertSuccessor(predecessor,circleEvent); if(!predecessor){this.firstCircleEvent=circleEvent}}
  detachCircleEvent(arc){let circleEvent=arc.circleEvent; if(circleEvent){if(!circleEvent.rbPrevious){this.firstCircleEvent=circleEvent.rbNext} this.circleEvents.rbRemoveNode(circleEvent); this.circleEventJunkyard.push(circleEvent); arc.circleEvent=null;}}

  //==============================================================================
  //>>> Diagram completion, computation, and general util methods
  //==============================================================================
  connectEdge(edge,bbox){let vb=edge.vb; if(!!vb){return true} let va=edge.va,xl=bbox.xl,xr=bbox.xr,yt=bbox.yt,yb=bbox.yb,lSite=edge.lSite,rSite=edge.rSite,lx=lSite.x,ly=lSite.y,rx=rSite.x,ry=rSite.y,fx=(lx+rx)/2,fy=(ly+ry)/2,fm,fb; this.cells[lSite.voronoiId].closeMe=true; this.cells[rSite.voronoiId].closeMe=true; if(ry!==ly){fm=(lx-rx)/(ry-ly); fb=fy-fm*fx;} if(fm===undefined){if(fx<xl||fx>=xr){return false} if(lx>rx){if(!va||va.y<yt){va=this.createVertex(fx,yt)} else if(va.y>=yb){return false} vb=this.createVertex(fx,yb);} else {if(!va||va.y>yb){va=this.createVertex(fx,yb)} else if(va.y<yt){return false} vb=this.createVertex(fx, yt);}} else if(fm<-1||fm>1){if(lx>rx){if(!va||va.y<yt){va=this.createVertex((yt-fb)/fm,yt)} else if(va.y>=yb){return false} vb=this.createVertex((yb-fb)/fm,yb);} else {if(!va||va.y>yb){va=this.createVertex((yb-fb)/fm,yb)} else if(va.y<yt){return false} vb=this.createVertex((yt-fb)/fm,yt);}} else {if(ly<ry){if(!va||va.x<xl){va=this.createVertex(xl,fm*xl+fb)} else if(va.x>=xr){return false} vb=this.createVertex(xr,fm*xr+fb);} else {if(!va||va.x>xr){va=this.createVertex(xr, fm*xr+fb)} else if(va.x<xl){return false} vb=this.createVertex(xl,fm*xl+fb);}} edge.va=va; edge.vb=vb; return true;}
  /** (RHill) Line-clipping code from 'Liang-Barsky function' by Daniel White {@link http://www.skytopia.com/project/articles/compsci/clipping.html link}; with a bit modified to minimize code paths */ 
  clipEdge(edge,bbox){let ax=edge.va.x,ay=edge.va.y,bx=edge.vb.x,by=edge.vb.y,t0=0,t1=1,dx=bx-ax,dy=by-ay; let q=ax-bbox.xl; if(dx===0&&q<0){return false} let r=-q/dx; if(dx<0){if(r<t0){return false} if(r<t1){t1=r}} else if(dx>0){if(r>t1){return false} if(r>t0){t0=r}} q=bbox.xr-ax; if(dx===0&&q<0){return false} r=q/dx; if(dx<0){if(r>t1){return false} if(r>t0){t0=r}} else if(dx>0){if(r<t0){return false} if(r<t1){t1=r}} q=ay-bbox.yt; if(dy===0&&q<0){return false} r=-q/dy; if(dy<0){if(r<t0){return false} if(r<t1){t1=r}} else if(dy>0){if(r>t1){return false} if(r>t0){t0=r}} q=bbox.yb-ay; if(dy===0&&q<0){return false} r=q/dy; if(dy<0){if(r>t1){return false} if(r>t0){t0=r}} else if(dy>0){if(r<t0){return false} if(r<t1){t1=r}} if(t0>0){edge.va=this.createVertex(ax+t0*dx,ay+t0*dy);} if(t1<1){edge.vb=this.createVertex(ax+t1*dx,ay+t1*dy);} if(t0>0||t1<1){this.cells[edge.lSite.voronoiId].closeMe=true; this.cells[edge.rSite.voronoiId].closeMe=true;} return true;}
  clipEdges(bbox){let edges=this.edges,iEdge=edges.length,edge; while (iEdge--){edge=edges[iEdge]; if(!this.connectEdge(edge, bbox)||!this.clipEdge(edge, bbox)||equalWithEpsilon(edge.va.x-edge.vb.x)&&equalWithEpsilon(edge.va.y-edge.vb.y)){edge.va=edge.vb=null; edges.splice(iEdge,1);}}}
  closeCells(bbox){let xl=bbox.xl,xr=bbox.xr,yt=bbox.yt,yb=bbox.yb,cells=this.cells,iCell=cells.length,cell,iLeft,halfedges,nHalfedges,edge,va,vb,vz,lastBorderSegment; while (iCell--){cell=cells[iCell]; if(!cell.prepareHalfedges()){continue} if(!cell.closeMe){continue} halfedges=cell.halfedges; nHalfedges=halfedges.length; iLeft=0; while (iLeft<nHalfedges){va=halfedges[iLeft].getEndpoint(); vz=halfedges[(iLeft+1)%nHalfedges].getStartpoint(); if(notEqualWithEpsilon(va.x,vz.x)||notEqualWithEpsilon(va.y,vz.y)){switch (true){case equalWithEpsilon(va.x,xl)&&lessThanWithEpsilon(va.y,yb): lastBorderSegment=equalWithEpsilon(vz.x,xl); vb=this.createVertex(xl,lastBorderSegment?vz.y:yb); edge=this.createBorderEdge(cell.site,va,vb); iLeft++; halfedges.splice(iLeft,0,this.createHalfedge(edge,cell.site,null)); nHalfedges++; if(lastBorderSegment){break} va=vb; case equalWithEpsilon(va.y,yb)&&lessThanWithEpsilon(va.x,xr): lastBorderSegment=equalWithEpsilon(vz.y,yb); vb=this.createVertex(lastBorderSegment?vz.x:xr,yb); edge=this.createBorderEdge(cell.site,va,vb); iLeft++; halfedges.splice(iLeft,0,this.createHalfedge(edge,cell.site,null)); nHalfedges++; if(lastBorderSegment){break} va=vb; case equalWithEpsilon(va.x,xr)&&greaterThanWithEpsilon(va.y,yt): lastBorderSegment=equalWithEpsilon(vz.x,xr); vb=this.createVertex(xr,lastBorderSegment?vz.y:yt); edge=this.createBorderEdge(cell.site,va,vb); iLeft++; halfedges.splice(iLeft,0,this.createHalfedge(edge,cell.site,null)); nHalfedges++; if(lastBorderSegment){break} va=vb; case equalWithEpsilon(va.y,yt)&&greaterThanWithEpsilon(va.x,xl): lastBorderSegment=equalWithEpsilon(vz.y,yt); vb=this.createVertex(lastBorderSegment?vz.x:xl,yt); edge=this.createBorderEdge(cell.site,va,vb); iLeft++; halfedges.splice(iLeft, 0, this.createHalfedge(edge,cell.site,null)); nHalfedges++; if(lastBorderSegment){break} va=vb; lastBorderSegment=equalWithEpsilon(vz.x,xl); vb=this.createVertex(xl,lastBorderSegment?vz.y:yb); edge=this.createBorderEdge(cell.site,va,vb); iLeft++; halfedges.splice(iLeft,0,this.createHalfedge(edge,cell.site,null)); nHalfedges++; if(lastBorderSegment){break} va=vb; lastBorderSegment=equalWithEpsilon(vz.y,yb); vb=this.createVertex(lastBorderSegment?vz.x:xr,yb); edge=this.createBorderEdge(cell.site,va,vb); iLeft++; halfedges.splice(iLeft,0,this.createHalfedge(edge,cell.site,null)); nHalfedges++; if(lastBorderSegment){break} va=vb; lastBorderSegment=equalWithEpsilon(vz.x,xr); vb=this.createVertex(xr,lastBorderSegment?vz.y:yt); edge=this.createBorderEdge(cell.site,va,vb); iLeft++; halfedges.splice(iLeft,0,this.createHalfedge(edge,cell.site,null)); nHalfedges++; if(lastBorderSegment){break} default: throw "Voronoi.closeCells()>this makes no sense!";}} iLeft++;} cell.closeMe=false;}}
  reset(){if(!this.beachline){this.beachline=new VRBTree()} if(this.beachline.root){let beachsection=this.beachline.getFirst(this.beachline.root); while (beachsection){this.beachsectionJunkyard.push(beachsection); beachsection=beachsection.rbNext;}} this.beachline.root=null; if(!this.circleEvents){this.circleEvents=new VRBTree();} this.circleEvents.root=this.firstCircleEvent=null; this.vertices=[]; this.edges=[]; this.cells=[];}; 
  /**
   * * (SEiselen) TL;DR: Nerfs input site pts with coord valRs of massive decimals; see Hill's docu immediately below for more info. I dont think I need to use this as long as I'm nerfing my own input; but keeping as a 'JIC' nonetheless.
   * * (RHill) Solves https://github.com/gorhill/Javascript-Voronoi/issues/15. Because not all users will end up using the kind of coord values which would cause this issue to arise, I chose to let the user decide whether or not he should sanitize his coord values through this helper. This way, for those users who uses coord values which are known to be fine, no overhead is added.
   */
  quantizeSites(sites){let n=sites.length,site; while (n--){site=sites[n]; site.x=Math.floor(site.x/EPSILON)*EPSILON; site.y=Math.floor(site.y/EPSILON)*EPSILON;}}
  recycle(diagram){if(!diagram){return;} if(diagram instanceof VDiagram){this.toRecycle=diagram;} else {throw 'Voronoi.recycleDiagram()>Need a Diagram object.';}}
  /** 
   * (RHill) Top-level Fortune loop. Voronoi sites are kept clientside for now, s.t. user can freely modify their content. At compute time, *references* to the sites are copied locally.
   * @example
   *  var sites = [{x:300,y:300}, {x:100,y:100}, {x:200,y:500}, {x:250,y:450}, {x:600,y:150}];
   *  var bbox = {x_left:0, x_right:800, y_top:0, y_bottom:600};
   *  var voronoi = new Voronoi();
   *  //pass bounding box exhibiting xl, xr, yt, yb properties. The bounding
   *  // box will be used to connect unbound edges, and to close open cells
   *  result = voronoi.compute(sites, bbox);
   *  // ... render, further analyze, etc. ...
   * */
  compute(sites,bbox){let startTime=new Date(); this.reset(); if(this.toRecycle){this.vertexJunkyard=this.vertexJunkyard.concat(this.toRecycle.vertices); this.edgeJunkyard=this.edgeJunkyard.concat(this.toRecycle.edges); this.cellJunkyard=this.cellJunkyard.concat(this.toRecycle.cells); this.toRecycle=null;} let siteEvents=sites.slice(0); siteEvents.sort(function(a,b){let r=b.y-a.y; if(r){return r;} return b.x-a.x;}); let site=siteEvents.pop(),siteid=0,xsitex,xsitey,cells=this.cells,circle; for (;;){circle=this.firstCircleEvent; if(site&&(!circle||site.y<circle.y||(site.y===circle.y&&site.x<circle.x))){if(site.x!==xsitex||site.y!==xsitey){cells[siteid]=this.createCell(site); site.voronoiId=siteid++; this.addBeachsection(site); xsitey=site.y; xsitex=site.x;} site=siteEvents.pop();} else if(circle){this.removeBeachsection(circle.arc)} else {break}} this.clipEdges(bbox); this.closeCells(bbox); let stopTime=new Date(); let outDiagram = new VDiagram(this.cells, this.edges, this.vertices, stopTime.getTime()-startTime.getTime()); this.reset(); return outDiagram;}

} // Ends Class

export default Voronoi;