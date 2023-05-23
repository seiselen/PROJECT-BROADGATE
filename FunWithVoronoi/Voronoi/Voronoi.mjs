
import VRBTree from "./RedBlackTree.mjs";
import VCell from "./Cell.mjs";
import VEdge from "./Edge.mjs";
import VHalfEdge from "./HalfEdge.mjs";
import VVertex from "./Vertex.mjs";
import VDiagram from "./Diagram.mjs";


//==============================================================================
function Voronoi() {
  this.vertices = null;
  this.edges = null;
  this.cells = null;
  this.toRecycle = null;
  this.beachsectionJunkyard = [];
  this.circleEventJunkyard = [];
  this.vertexJunkyard = [];
  this.edgeJunkyard = [];
  this.cellJunkyard = [];
  }

// ---------------------------------------------------------------------------
Voronoi.prototype.reset = function() {
  if (!this.beachline) {
      this.beachline = new VRBTree();
      }
  // Move leftover beachsections to the beachsection junkyard.
  if (this.beachline.root) {
      var beachsection = this.beachline.getFirst(this.beachline.root);
      while (beachsection) {
          this.beachsectionJunkyard.push(beachsection); // mark for reuse
          beachsection = beachsection.rbNext;
          }
      }
  this.beachline.root = null;
  if (!this.circleEvents) {
      this.circleEvents = new VRBTree();
      }
  this.circleEvents.root = this.firstCircleEvent = null;
  this.vertices = [];
  this.edges = [];
  this.cells = [];
  };


/**
 * **TL;DR:** Nerfs input site pts with coord valRs of massive decimals;
 * see Hill's docu in 'UsageNotes' for more info. I dont think need to
 * use this as long as I'm nerfing my own input; but keeping as a 'JIC'.
 */
Voronoi.prototype.quantizeSites = function(sites){
  var ε = this.ε, n = sites.length, site;
  while (n--){site=sites[n]; site.x=Math.floor(site.x/ε)*ε; site.y=Math.floor(site.y/ε)*ε;}
}

/**
 * **TL;DR:** Recycles all `{vertex, edge, cell}` instances into their
 * respective object pools within this instance. Keeping as a 'JIC'.
 * @param {VDiagram} diagram 
 */
Voronoi.prototype.recycle = function(diagram) {
  if(!diagram){return;}
  if (diagram instanceof VDiagram ){this.toRecycle = diagram;}
  else {throw 'Voronoi.recycleDiagram() > Need a Diagram object.';}
}

Voronoi.prototype.sqrt = Math.sqrt;
Voronoi.prototype.abs = Math.abs;
Voronoi.prototype.ε = Voronoi.ε = 1e-9;
Voronoi.prototype.invε = Voronoi.invε = 1.0 / Voronoi.ε;
Voronoi.prototype.equalWithEpsilon = function(a,b){return this.abs(a-b)<1e-9;};
Voronoi.prototype.greaterThanWithEpsilon = function(a,b){return a-b>1e-9;};
Voronoi.prototype.greaterThanOrEqualWithEpsilon = function(a,b){return b-a<1e-9;};
Voronoi.prototype.lessThanWithEpsilon = function(a,b){return b-a>1e-9;};
Voronoi.prototype.lessThanOrEqualWithEpsilon = function(a,b){return a-b<1e-9;};


//==============================================================================
// VCell Methods
//==============================================================================

Voronoi.prototype.createCell = function(site) {
  /** @type {VCell} */
  var cell = this.cellJunkyard.pop();
  if (cell) {return cell.init(site);}
  return new VCell(site);
}

//==============================================================================
// VVertex/VSite Methods
//==============================================================================

Voronoi.prototype.createVertex = function(x, y) {
  /** @type {VVertex} */  
  var v = this.vertexJunkyard.pop();
  if (!v) {v = new VVertex(x, y);}
  else {v.set(x,y);}
  this.vertices.push(v);
  return v;
}

//==============================================================================
// VEdge/VHalfEdge methods
//==============================================================================

Voronoi.prototype.createHalfedge = function(edge, lSite, rSite) {
  /** @type {VHalfEdge} */
  return new VHalfEdge(edge, lSite, rSite);
}

Voronoi.prototype.createEdge = function(lSite, rSite, va, vb) {
  /** @type {VEdge} */
  var edge = this.edgeJunkyard.pop();
  if (!edge) {edge = new VEdge(lSite, rSite);}
  else {edge.set(lSite,rSite)}
  this.edges.push(edge);
  if (va) {this.setEdgeStartpoint(edge, lSite, rSite, va);}
  if (vb) {this.setEdgeEndpoint(edge, lSite, rSite, vb);}
  this.cells[lSite.voronoiId].halfedges.push(this.createHalfedge(edge, lSite, rSite));
  this.cells[rSite.voronoiId].halfedges.push(this.createHalfedge(edge, rSite, lSite));
  return edge;
}

Voronoi.prototype.createBorderEdge = function(lSite, va, vb){
  /** @type {VEdge} */
  var edge = this.edgeJunkyard.pop();
  if (!edge){edge = new VEdge(lSite, null);}
  else {edge.set(lSite, null);}
  edge.va = va;
  edge.vb = vb;
  this.edges.push(edge);
  return edge;
}

Voronoi.prototype.setEdgeStartpoint = function(edge, lSite, rSite, vertex){
  if (!edge.va && !edge.vb){edge.va=vertex; edge.lSite=lSite; edge.rSite=rSite;}
  else if (edge.lSite === rSite){edge.vb=vertex;}
  else {edge.va=vertex;}
}
  
Voronoi.prototype.setEdgeEndpoint = function(edge, lSite, rSite, vertex) {
  this.setEdgeStartpoint(edge, rSite, lSite, vertex);
}



//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//>>> REFACTOR PROGRESS A/O END-OF-05/21/23: ABOUT TO PARTITON BEACHLINE
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

// ---------------------------------------------------------------------------
// Beachline methods

// rhill 2011-06-07: For some reasons, performance suffers significantly
// when instanciating a literal object instead of an empty ctor
Voronoi.prototype.Beachsection = function() {
  };

// rhill 2011-06-02: A lot of Beachsection instanciations
// occur during the computation of the Voronoi diagram,
// somewhere between the number of sites and twice the
// number of sites, while the number of Beachsections on the
// beachline at any given time is comparatively low. For this
// reason, we reuse already created Beachsections, in order
// to avoid new memory allocation. This resulted in a measurable
// performance gain.

Voronoi.prototype.createBeachsection = function(site) {
  var beachsection = this.beachsectionJunkyard.pop();
  if (!beachsection) {
      beachsection = new this.Beachsection();
      }
  beachsection.site = site;
  return beachsection;
  };

// calculate the left break point of a particular beach section,
// given a particular sweep line
Voronoi.prototype.leftBreakPoint = function(arc, directrix) {
  // http://en.wikipedia.org/wiki/Parabola
  // http://en.wikipedia.org/wiki/Quadratic_equation
  // h1 = x1,
  // k1 = (y1+directrix)/2,
  // h2 = x2,
  // k2 = (y2+directrix)/2,
  // p1 = k1-directrix,
  // a1 = 1/(4*p1),
  // b1 = -h1/(2*p1),
  // c1 = h1*h1/(4*p1)+k1,
  // p2 = k2-directrix,
  // a2 = 1/(4*p2),
  // b2 = -h2/(2*p2),
  // c2 = h2*h2/(4*p2)+k2,
  // x = (-(b2-b1) + Math.sqrt((b2-b1)*(b2-b1) - 4*(a2-a1)*(c2-c1))) / (2*(a2-a1))
  // When x1 become the x-origin:
  // h1 = 0,
  // k1 = (y1+directrix)/2,
  // h2 = x2-x1,
  // k2 = (y2+directrix)/2,
  // p1 = k1-directrix,
  // a1 = 1/(4*p1),
  // b1 = 0,
  // c1 = k1,
  // p2 = k2-directrix,
  // a2 = 1/(4*p2),
  // b2 = -h2/(2*p2),
  // c2 = h2*h2/(4*p2)+k2,
  // x = (-b2 + Math.sqrt(b2*b2 - 4*(a2-a1)*(c2-k1))) / (2*(a2-a1)) + x1

  // change code below at your own risk: care has been taken to
  // reduce errors due to computers' finite arithmetic precision.
  // Maybe can still be improved, will see if any more of this
  // kind of errors pop up again.
  var site = arc.site,
      rfocx = site.x,
      rfocy = site.y,
      pby2 = rfocy-directrix;
  // parabola in degenerate case where focus is on directrix
  if (!pby2) {
      return rfocx;
      }
  var lArc = arc.rbPrevious;
  if (!lArc) {
      return -Infinity;
      }
  site = lArc.site;
  var lfocx = site.x,
      lfocy = site.y,
      plby2 = lfocy-directrix;
  // parabola in degenerate case where focus is on directrix
  if (!plby2) {
      return lfocx;
      }
  var hl = lfocx-rfocx,
      aby2 = 1/pby2-1/plby2,
      b = hl/plby2;
  if (aby2) {
      return (-b+this.sqrt(b*b-2*aby2*(hl*hl/(-2*plby2)-lfocy+plby2/2+rfocy-pby2/2)))/aby2+rfocx;
      }
  // both parabolas have same distance to directrix, thus break point is midway
  return (rfocx+lfocx)/2;
  };

// calculate the right break point of a particular beach section,
// given a particular directrix
Voronoi.prototype.rightBreakPoint = function(arc, directrix) {
  var rArc = arc.rbNext;
  if (rArc) {
      return this.leftBreakPoint(rArc, directrix);
      }
  var site = arc.site;
  return site.y === directrix ? site.x : Infinity;
  };

Voronoi.prototype.detachBeachsection = function(beachsection) {
  this.detachCircleEvent(beachsection); // detach potentially attached circle event
  this.beachline.rbRemoveNode(beachsection); // remove from RB-tree
  this.beachsectionJunkyard.push(beachsection); // mark for reuse
  };

Voronoi.prototype.removeBeachsection = function(beachsection) {
  var circle = beachsection.circleEvent,
      x = circle.x,
      y = circle.ycenter,
      vertex = this.createVertex(x, y),
      previous = beachsection.rbPrevious,
      next = beachsection.rbNext,
      disappearingTransitions = [beachsection],
      abs_fn = Math.abs;

  // remove collapsed beachsection from beachline
  this.detachBeachsection(beachsection);

  // there could be more than one empty arc at the deletion point, this
  // happens when more than two edges are linked by the same vertex,
  // so we will collect all those edges by looking up both sides of
  // the deletion point.
  // by the way, there is *always* a predecessor/successor to any collapsed
  // beach section, it's just impossible to have a collapsing first/last
  // beach sections on the beachline, since they obviously are unconstrained
  // on their left/right side.

  // look left
  var lArc = previous;
  while (lArc.circleEvent && abs_fn(x-lArc.circleEvent.x)<1e-9 && abs_fn(y-lArc.circleEvent.ycenter)<1e-9) {
      previous = lArc.rbPrevious;
      disappearingTransitions.unshift(lArc);
      this.detachBeachsection(lArc); // mark for reuse
      lArc = previous;
      }
  // even though it is not disappearing, I will also add the beach section
  // immediately to the left of the left-most collapsed beach section, for
  // convenience, since we need to refer to it later as this beach section
  // is the 'left' site of an edge for which a start point is set.
  disappearingTransitions.unshift(lArc);
  this.detachCircleEvent(lArc);

  // look right
  var rArc = next;
  while (rArc.circleEvent && abs_fn(x-rArc.circleEvent.x)<1e-9 && abs_fn(y-rArc.circleEvent.ycenter)<1e-9) {
      next = rArc.rbNext;
      disappearingTransitions.push(rArc);
      this.detachBeachsection(rArc); // mark for reuse
      rArc = next;
      }
  // we also have to add the beach section immediately to the right of the
  // right-most collapsed beach section, since there is also a disappearing
  // transition representing an edge's start point on its left.
  disappearingTransitions.push(rArc);
  this.detachCircleEvent(rArc);

  // walk through all the disappearing transitions between beach sections and
  // set the start point of their (implied) edge.
  var nArcs = disappearingTransitions.length,
      iArc;
  for (iArc=1; iArc<nArcs; iArc++) {
      rArc = disappearingTransitions[iArc];
      lArc = disappearingTransitions[iArc-1];
      this.setEdgeStartpoint(rArc.edge, lArc.site, rArc.site, vertex);
      }

  // create a new edge as we have now a new transition between
  // two beach sections which were previously not adjacent.
  // since this edge appears as a new vertex is defined, the vertex
  // actually define an end point of the edge (relative to the site
  // on the left)
  lArc = disappearingTransitions[0];
  rArc = disappearingTransitions[nArcs-1];
  rArc.edge = this.createEdge(lArc.site, rArc.site, undefined, vertex);

  // create circle events if any for beach sections left in the beachline
  // adjacent to collapsed sections
  this.attachCircleEvent(lArc);
  this.attachCircleEvent(rArc);
  };

Voronoi.prototype.addBeachsection = function(site) {
  var x = site.x,
      directrix = site.y;

  var lArc, rArc,
      dxl, dxr,
      node = this.beachline.root;

  while (node) {
      dxl = this.leftBreakPoint(node,directrix)-x;
      // x lessThanWithEpsilon xl => falls somewhere before the left edge of the beachsection
      if (dxl > 1e-9) {
          // this case should never happen
          // if (!node.rbLeft) {
          //    rArc = node.rbLeft;
          //    break;
          //    }
          node = node.rbLeft;
          }
      else {
          dxr = x-this.rightBreakPoint(node,directrix);
          // x greaterThanWithEpsilon xr => falls somewhere after the right edge of the beachsection
          if (dxr > 1e-9) {
              if (!node.rbRight) {
                  lArc = node;
                  break;
                  }
              node = node.rbRight;
              }
          else {
              // x equalWithEpsilon xl => falls exactly on the left edge of the beachsection
              if (dxl > -1e-9) {
                  lArc = node.rbPrevious;
                  rArc = node;
                  }
              // x equalWithEpsilon xr => falls exactly on the right edge of the beachsection
              else if (dxr > -1e-9) {
                  lArc = node;
                  rArc = node.rbNext;
                  }
              // falls exactly somewhere in the middle of the beachsection
              else {
                  lArc = rArc = node;
                  }
              break;
              }
          }
      }

  var newArc = this.createBeachsection(site);
  this.beachline.rbInsertSuccessor(lArc, newArc);

  if (!lArc && !rArc){return;}

  if (lArc === rArc) {
      this.detachCircleEvent(lArc);
      rArc = this.createBeachsection(lArc.site);
      this.beachline.rbInsertSuccessor(newArc, rArc);
      newArc.edge = rArc.edge = this.createEdge(lArc.site, newArc.site);
      this.attachCircleEvent(lArc);
      this.attachCircleEvent(rArc);
      return;
      }

  if (lArc && !rArc) {
      newArc.edge = this.createEdge(lArc.site,newArc.site);
      return;
      }

  if (lArc !== rArc) {
      this.detachCircleEvent(lArc);
      this.detachCircleEvent(rArc);

      var lSite = lArc.site,
          ax = lSite.x,
          ay = lSite.y,
          bx=site.x-ax,
          by=site.y-ay,
          rSite = rArc.site,
          cx=rSite.x-ax,
          cy=rSite.y-ay,
          d=2*(bx*cy-by*cx),
          hb=bx*bx+by*by,
          hc=cx*cx+cy*cy,
          vertex = this.createVertex((cy*hb-by*hc)/d+ax, (bx*hc-cx*hb)/d+ay);

      this.setEdgeStartpoint(rArc.edge, lSite, rSite, vertex);
      newArc.edge = this.createEdge(lSite, site, undefined, vertex);
      rArc.edge = this.createEdge(site, rSite, undefined, vertex);
      this.attachCircleEvent(lArc);
      this.attachCircleEvent(rArc);
      return;
      }
  };

// ---------------------------------------------------------------------------
// Circle event methods

// rhill 2011-06-07: For some reasons, performance suffers significantly
// when instanciating a literal object instead of an empty ctor
Voronoi.prototype.CircleEvent = function() {
  this.arc = null;
  this.rbLeft = null;
  this.rbNext = null;
  this.rbParent = null;
  this.rbPrevious = null;
  this.rbRed = false;
  this.rbRight = null;
  this.site = null;
  this.x = this.y = this.ycenter = 0;
  };

Voronoi.prototype.attachCircleEvent = function(arc) {
  var lArc = arc.rbPrevious,
      rArc = arc.rbNext;
  if (!lArc || !rArc) {return;} // does that ever happen?
  var lSite = lArc.site,
      cSite = arc.site,
      rSite = rArc.site;

  if (lSite===rSite) {return;}

  var bx = cSite.x,
      by = cSite.y,
      ax = lSite.x-bx,
      ay = lSite.y-by,
      cx = rSite.x-bx,
      cy = rSite.y-by;


  var d = 2*(ax*cy-ay*cx);
  if (d >= -2e-12){return;}

  var ha = ax*ax+ay*ay,
      hc = cx*cx+cy*cy,
      x = (cy*ha-ay*hc)/d,
      y = (ax*hc-cx*ha)/d,
      ycenter = y+by;

  var circleEvent = this.circleEventJunkyard.pop();
  if (!circleEvent) {
      circleEvent = new this.CircleEvent();
      }
  circleEvent.arc = arc;
  circleEvent.site = cSite;
  circleEvent.x = x+bx;
  circleEvent.y = ycenter+this.sqrt(x*x+y*y); // y bottom
  circleEvent.ycenter = ycenter;
  arc.circleEvent = circleEvent;

  var predecessor = null,
      node = this.circleEvents.root;
  while (node) {
      if (circleEvent.y < node.y || (circleEvent.y === node.y && circleEvent.x <= node.x)) {
          if (node.rbLeft) {
              node = node.rbLeft;
              }
          else {
              predecessor = node.rbPrevious;
              break;
              }
          }
      else {
          if (node.rbRight) {
              node = node.rbRight;
              }
          else {
              predecessor = node;
              break;
              }
          }
      }
  this.circleEvents.rbInsertSuccessor(predecessor, circleEvent);
  if (!predecessor) {
      this.firstCircleEvent = circleEvent;
      }
  };

Voronoi.prototype.detachCircleEvent = function(arc) {
  var circleEvent = arc.circleEvent;
  if (circleEvent) {
      if (!circleEvent.rbPrevious) {
          this.firstCircleEvent = circleEvent.rbNext;
          }
      this.circleEvents.rbRemoveNode(circleEvent); // remove from RB-tree
      this.circleEventJunkyard.push(circleEvent);
      arc.circleEvent = null;
      }
  };

// ---------------------------------------------------------------------------
// Diagram completion methods

// connect dangling edges (not if a cursory test tells us
// it is not going to be visible.
// return value:
//   false: the dangling endpoint couldn't be connected
//   true: the dangling endpoint could be connected
Voronoi.prototype.connectEdge = function(edge, bbox) {
  // skip if end point already connected
  var vb = edge.vb;
  if (!!vb) {return true;}

  // make local copy for performance purpose
  var va = edge.va,
      xl = bbox.xl,
      xr = bbox.xr,
      yt = bbox.yt,
      yb = bbox.yb,
      lSite = edge.lSite,
      rSite = edge.rSite,
      lx = lSite.x,
      ly = lSite.y,
      rx = rSite.x,
      ry = rSite.y,
      fx = (lx+rx)/2,
      fy = (ly+ry)/2,
      fm, fb;

  // if we reach here, this means cells which use this edge will need
  // to be closed, whether because the edge was removed, or because it
  // was connected to the bounding box.
  this.cells[lSite.voronoiId].closeMe = true;
  this.cells[rSite.voronoiId].closeMe = true;

  // get the line equation of the bisector if line is not vertical
  if (ry !== ly) {
      fm = (lx-rx)/(ry-ly);
      fb = fy-fm*fx;
      }


  // special case: vertical line
  if (fm === undefined) {
      // doesn't intersect with viewport
      if (fx < xl || fx >= xr) {return false;}
      // downward
      if (lx > rx) {
          if (!va || va.y < yt) {
              va = this.createVertex(fx, yt);
              }
          else if (va.y >= yb) {
              return false;
              }
          vb = this.createVertex(fx, yb);
          }
      // upward
      else {
          if (!va || va.y > yb) {
              va = this.createVertex(fx, yb);
              }
          else if (va.y < yt) {
              return false;
              }
          vb = this.createVertex(fx, yt);
          }
      }

  else if (fm < -1 || fm > 1) {
      // downward
      if (lx > rx) {
          if (!va || va.y < yt) {
              va = this.createVertex((yt-fb)/fm, yt);
              }
          else if (va.y >= yb) {
              return false;
              }
          vb = this.createVertex((yb-fb)/fm, yb);
          }
      // upward
      else {
          if (!va || va.y > yb) {
              va = this.createVertex((yb-fb)/fm, yb);
              }
          else if (va.y < yt) {
              return false;
              }
          vb = this.createVertex((yt-fb)/fm, yt);
          }
      }

  else {
      // rightward
      if (ly < ry) {
          if (!va || va.x < xl) {
              va = this.createVertex(xl, fm*xl+fb);
              }
          else if (va.x >= xr) {
              return false;
              }
          vb = this.createVertex(xr, fm*xr+fb);
          }
      // leftward
      else {
          if (!va || va.x > xr) {
              va = this.createVertex(xr, fm*xr+fb);
              }
          else if (va.x < xl) {
              return false;
              }
          vb = this.createVertex(xl, fm*xl+fb);
          }
      }
  edge.va = va;
  edge.vb = vb;

  return true;
  };

// line-clipping code taken from:
//   Liang-Barsky function by Daniel White
//   http://www.skytopia.com/project/articles/compsci/clipping.html
// Thanks!
// A bit modified to minimize code paths
Voronoi.prototype.clipEdge = function(edge, bbox) {
  var ax = edge.va.x,
      ay = edge.va.y,
      bx = edge.vb.x,
      by = edge.vb.y,
      t0 = 0,
      t1 = 1,
      dx = bx-ax,
      dy = by-ay;
  // left
  var q = ax-bbox.xl;
  if (dx===0 && q<0) {return false;}
  var r = -q/dx;
  if (dx<0) {
      if (r<t0) {return false;}
      if (r<t1) {t1=r;}
      }
  else if (dx>0) {
      if (r>t1) {return false;}
      if (r>t0) {t0=r;}
      }
  // right
  q = bbox.xr-ax;
  if (dx===0 && q<0) {return false;}
  r = q/dx;
  if (dx<0) {
      if (r>t1) {return false;}
      if (r>t0) {t0=r;}
      }
  else if (dx>0) {
      if (r<t0) {return false;}
      if (r<t1) {t1=r;}
      }
  // top
  q = ay-bbox.yt;
  if (dy===0 && q<0) {return false;}
  r = -q/dy;
  if (dy<0) {
      if (r<t0) {return false;}
      if (r<t1) {t1=r;}
      }
  else if (dy>0) {
      if (r>t1) {return false;}
      if (r>t0) {t0=r;}
      }
  // bottom        
  q = bbox.yb-ay;
  if (dy===0 && q<0) {return false;}
  r = q/dy;
  if (dy<0) {
      if (r>t1) {return false;}
      if (r>t0) {t0=r;}
      }
  else if (dy>0) {
      if (r<t0) {return false;}
      if (r<t1) {t1=r;}
      }

  if (t0>0){edge.va = this.createVertex(ax+t0*dx, ay+t0*dy);}

  if (t1<1){edge.vb = this.createVertex(ax+t1*dx, ay+t1*dy);}

  // va and/or vb were clipped, thus we will need to close
  // cells which use this edge.
  if ( t0 > 0 || t1 < 1 ) {
      this.cells[edge.lSite.voronoiId].closeMe = true;
      this.cells[edge.rSite.voronoiId].closeMe = true;
  }

  return true;
  };

// Connect/cut edges at bounding box
Voronoi.prototype.clipEdges = function(bbox) {
  // connect all dangling edges to bounding box
  // or get rid of them if it can't be done
  var edges = this.edges,
      iEdge = edges.length,
      edge,
      abs_fn = Math.abs;

  // iterate backward so we can splice safely
  while (iEdge--) {
      edge = edges[iEdge];
      // edge is removed if:
      //   it is wholly outside the bounding box
      //   it is looking more like a point than a line
      if (!this.connectEdge(edge, bbox) ||
          !this.clipEdge(edge, bbox) ||
          (abs_fn(edge.va.x-edge.vb.x)<1e-9 && abs_fn(edge.va.y-edge.vb.y)<1e-9)) {
          edge.va = edge.vb = null;
          edges.splice(iEdge,1);
          }
      }
  };

// Close the cells.
// The cells are bound by the supplied bounding box.
// Each cell refers to its associated site, and a list
// of halfedges ordered counterclockwise.
Voronoi.prototype.closeCells = function(bbox) {
  var xl = bbox.xl,
      xr = bbox.xr,
      yt = bbox.yt,
      yb = bbox.yb,
      cells = this.cells,
      iCell = cells.length,
      cell,
      iLeft,
      halfedges, nHalfedges,
      edge,
      va, vb, vz,
      lastBorderSegment,
      abs_fn = Math.abs;

  while (iCell--) {
      cell = cells[iCell];
      // prune, order halfedges counterclockwise, then add missing ones
      // required to close cells
      if (!cell.prepareHalfedges()) {
          continue;
          }
      if (!cell.closeMe) {
          continue;
          }
      // find first 'unclosed' point.
      // an 'unclosed' point will be the end point of a halfedge which
      // does not match the start point of the following halfedge
      halfedges = cell.halfedges;
      nHalfedges = halfedges.length;
      // special case: only one site, in which case, the viewport is the cell
      // ...

      // all other cases
      iLeft = 0;
      while (iLeft < nHalfedges) {
          va = halfedges[iLeft].getEndpoint();
          vz = halfedges[(iLeft+1) % nHalfedges].getStartpoint();
          // if end point is not equal to start point, we need to add the missing
          // halfedge(s) up to vz
          if (abs_fn(va.x-vz.x)>=1e-9 || abs_fn(va.y-vz.y)>=1e-9) {

              // rhill 2013-12-02:
              // "Holes" in the halfedges are not necessarily always adjacent.
              // https://github.com/gorhill/Javascript-Voronoi/issues/16

              // find entry point:
              switch (true) {

                  // walk downward along left side
                  case this.equalWithEpsilon(va.x,xl) && this.lessThanWithEpsilon(va.y,yb):
                      lastBorderSegment = this.equalWithEpsilon(vz.x,xl);
                      vb = this.createVertex(xl, lastBorderSegment ? vz.y : yb);
                      edge = this.createBorderEdge(cell.site, va, vb);
                      iLeft++;
                      halfedges.splice(iLeft, 0, this.createHalfedge(edge, cell.site, null));
                      nHalfedges++;
                      if ( lastBorderSegment ) { break; }
                      va = vb;
                      // fall through

                  // walk rightward along bottom side
                  case this.equalWithEpsilon(va.y,yb) && this.lessThanWithEpsilon(va.x,xr):
                      lastBorderSegment = this.equalWithEpsilon(vz.y,yb);
                      vb = this.createVertex(lastBorderSegment ? vz.x : xr, yb);
                      edge = this.createBorderEdge(cell.site, va, vb);
                      iLeft++;
                      halfedges.splice(iLeft, 0, this.createHalfedge(edge, cell.site, null));
                      nHalfedges++;
                      if ( lastBorderSegment ) { break; }
                      va = vb;
                      // fall through

                  // walk upward along right side
                  case this.equalWithEpsilon(va.x,xr) && this.greaterThanWithEpsilon(va.y,yt):
                      lastBorderSegment = this.equalWithEpsilon(vz.x,xr);
                      vb = this.createVertex(xr, lastBorderSegment ? vz.y : yt);
                      edge = this.createBorderEdge(cell.site, va, vb);
                      iLeft++;
                      halfedges.splice(iLeft, 0, this.createHalfedge(edge, cell.site, null));
                      nHalfedges++;
                      if ( lastBorderSegment ) { break; }
                      va = vb;
                      // fall through

                  // walk leftward along top side
                  case this.equalWithEpsilon(va.y,yt) && this.greaterThanWithEpsilon(va.x,xl):
                      lastBorderSegment = this.equalWithEpsilon(vz.y,yt);
                      vb = this.createVertex(lastBorderSegment ? vz.x : xl, yt);
                      edge = this.createBorderEdge(cell.site, va, vb);
                      iLeft++;
                      halfedges.splice(iLeft, 0, this.createHalfedge(edge, cell.site, null));
                      nHalfedges++;
                      if ( lastBorderSegment ) { break; }
                      va = vb;
                      // fall through

                      // walk downward along left side
                      lastBorderSegment = this.equalWithEpsilon(vz.x,xl);
                      vb = this.createVertex(xl, lastBorderSegment ? vz.y : yb);
                      edge = this.createBorderEdge(cell.site, va, vb);
                      iLeft++;
                      halfedges.splice(iLeft, 0, this.createHalfedge(edge, cell.site, null));
                      nHalfedges++;
                      if ( lastBorderSegment ) { break; }
                      va = vb;
                      // fall through

                      // walk rightward along bottom side
                      lastBorderSegment = this.equalWithEpsilon(vz.y,yb);
                      vb = this.createVertex(lastBorderSegment ? vz.x : xr, yb);
                      edge = this.createBorderEdge(cell.site, va, vb);
                      iLeft++;
                      halfedges.splice(iLeft, 0, this.createHalfedge(edge, cell.site, null));
                      nHalfedges++;
                      if ( lastBorderSegment ) { break; }
                      va = vb;
                      // fall through

                      // walk upward along right side
                      lastBorderSegment = this.equalWithEpsilon(vz.x,xr);
                      vb = this.createVertex(xr, lastBorderSegment ? vz.y : yt);
                      edge = this.createBorderEdge(cell.site, va, vb);
                      iLeft++;
                      halfedges.splice(iLeft, 0, this.createHalfedge(edge, cell.site, null));
                      nHalfedges++;
                      if ( lastBorderSegment ) { break; }
                      // fall through

                  default:
                      throw "Voronoi.closeCells() > this makes no sense!";
                  }
              }
          iLeft++;
          }
      cell.closeMe = false;
      }
  };





// ---------------------------------------------------------------------------
// Top-level Fortune loop

// rhill 2011-05-19:
//   Voronoi sites are kept client-side now, to allow
//   user to freely modify content. At compute time,
//   *references* to sites are copied locally.

Voronoi.prototype.compute = function(sites, bbox) {
  // to measure execution time
  var startTime = new Date();

  // init internal state
  this.reset();

  // any diagram data available for recycling?
  // I do that here so that this is included in execution time
  if ( this.toRecycle ) {
      this.vertexJunkyard = this.vertexJunkyard.concat(this.toRecycle.vertices);
      this.edgeJunkyard = this.edgeJunkyard.concat(this.toRecycle.edges);
      this.cellJunkyard = this.cellJunkyard.concat(this.toRecycle.cells);
      this.toRecycle = null;
      }

  // Initialize site event queue
  var siteEvents = sites.slice(0);
  siteEvents.sort(function(a,b){
      var r = b.y - a.y;
      if (r) {return r;}
      return b.x - a.x;
      });

  // process queue
  var site = siteEvents.pop(),
      siteid = 0,
      xsitex, // to avoid duplicate sites
      xsitey,
      cells = this.cells,
      circle;

  // main loop
  for (;;) {
      // we need to figure whether we handle a site or circle event
      // for this we find out if there is a site event and it is
      // 'earlier' than the circle event
      circle = this.firstCircleEvent;

      // add beach section
      if (site && (!circle || site.y < circle.y || (site.y === circle.y && site.x < circle.x))) {
          // only if site is not a duplicate
          if (site.x !== xsitex || site.y !== xsitey) {
              // first create cell for new site
              cells[siteid] = this.createCell(site);
              site.voronoiId = siteid++;
              // then create a beachsection for that site
              this.addBeachsection(site);
              // remember last site coords to detect duplicate
              xsitey = site.y;
              xsitex = site.x;
              }
          site = siteEvents.pop();
          }

      // remove beach section
      else if (circle) {
          this.removeBeachsection(circle.arc);
          }

      // all done, quit
      else {
          break;
          }
      }

  this.clipEdges(bbox);
  this.closeCells(bbox);
  var stopTime = new Date();

  var diagram = new VDiagram();
  diagram.cells = this.cells;
  diagram.edges = this.edges;
  diagram.vertices = this.vertices;
  diagram.execTime = stopTime.getTime()-startTime.getTime();

  this.reset(); // clean up (ah, so it IS called lol)

  return diagram;
  };

/******************************************************************************/

export default Voronoi;