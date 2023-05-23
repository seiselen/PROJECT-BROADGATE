/*----------------------------------------------------------------------
|>>> Class VCell : [V]oronoi [Cell]
+-----------------------------------------------------------------------
| Description: Voronoi Cell realization; with refactoring into MJS class
|              with minimized comments and syntax by Steven Eiselen.
| Authors:     > Raymond Hill <rhill@raymondhill.net> (original version)
|              > Steven Eiselen <seiselen.github.io> (minimized and MJS)
+---------------------------------------------------------------------*/

import VHalfEdge from "./HalfEdge.mjs";
import VVertex from "./Vertex.mjs";
/** @typedef {VVertex} VSite */

/** **VCell** (**V**oronoi **Cell**) */
class VCell{
  /** @param {VSite} in_site input site */
  constructor(in_site){this.init(in_site);}

  init(site){
    /** @type {VSite} site i.e. vertex of VD encompassing this Voronoi cell. */
    this.site = site;

    /** @type {VHalfEdge[]} half edges encompassing this Voronoi cell. */
    this.halfedges = [];

    this.closeMe = false;

    return this;
  }

  prepareHalfedges = function(){
    let halfedges=this.halfedges,iHalfedge=halfedges.length,edge;
    while (iHalfedge--){
      edge = halfedges[iHalfedge].edge;
      if (!edge.vb || !edge.va){halfedges.splice(iHalfedge,1);}
    }
    halfedges.sort(function(a,b){return b.angle-a.angle;});
    return halfedges.length;
  }
  

  /**
   * @returns List of the neighbor Ids
   */
getNeighborIds(){
    var neighbors=[],
        iHalfedge = this.halfedges.length,
        edge;
    while (iHalfedge--){
        edge = this.halfedges[iHalfedge].edge;
        if (edge.lSite !== null && edge.lSite.voronoiId != this.site.voronoiId) {
            neighbors.push(edge.lSite.voronoiId);
            }
        else if (edge.rSite !== null && edge.rSite.voronoiId != this.site.voronoiId){
            neighbors.push(edge.rSite.voronoiId);
            }
        }
    return neighbors;
    };
  
  // Compute bounding box
  //
getBbox(){
    var halfedges = this.halfedges,
        iHalfedge = halfedges.length,
        xmin = Infinity,
        ymin = Infinity,
        xmax = -Infinity,
        ymax = -Infinity,
        v, vx, vy;
    while (iHalfedge--) {
        v = halfedges[iHalfedge].getStartpoint();
        vx = v.x;
        vy = v.y;
        if (vx < xmin) {xmin = vx;}
        if (vy < ymin) {ymin = vy;}
        if (vx > xmax) {xmax = vx;}
        if (vy > ymax) {ymax = vy;}
        // we dont need to take into account end point,
        // since each end point matches a start point
        }
    return {
        x: xmin,
        y: ymin,
        width: xmax-xmin,
        height: ymax-ymin
        };
    }
  
  // Return whether a point is inside, on, or outside the cell:
  //   -1: point is outside the perimeter of the cell
  //    0: point is on the perimeter of the cell
  //    1: point is inside the perimeter of the cell
  //

  pointIntersection(x, y){
    // Check if point in polygon. Since all polygons of a Voronoi
    // diagram are convex, then:
    // http://paulbourke.net/geometry/polygonmesh/
    // Solution 3 (2D):
    //   "If the polygon is convex then one can consider the polygon
    //   "as a 'path' from the first vertex. A point is on the interior
    //   "of this polygons if it is always on the same side of all the
    //   "line segments making up the path. ...
    //   "(y - y0) (x1 - x0) - (x - x0) (y1 - y0)
    //   "if it is less than 0 then P is to the right of the line segment,
    //   "if greater than 0 it is to the left, if equal to 0 then it lies
    //   "on the line segment"
    var halfedges = this.halfedges,
        iHalfedge = halfedges.length,
        halfedge,
        p0, p1, r;
    while (iHalfedge--) {
        halfedge = halfedges[iHalfedge];
        p0 = halfedge.getStartpoint();
        p1 = halfedge.getEndpoint();
        r = (y-p0.y)*(p1.x-p0.x)-(x-p0.x)*(p1.y-p0.y);
        if (!r) {
            return 0;
            }
        if (r > 0) {
            return -1;
            }
        }
    return 1;
    }


} // Ends Class VCell

export default VCell;