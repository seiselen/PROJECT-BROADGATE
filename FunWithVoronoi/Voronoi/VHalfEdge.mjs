/*----------------------------------------------------------------------
|>>> Class VHalfEdge : [V]oronoi [Half] [Edge]
+-----------------------------------------------------------------------
| Description: Voronoi Half-Edge realization; with refactoring into MJS 
|              class of minimized comments and syntax by Steven Eiselen.
| Authors:     > Raymond Hill <rhill@raymondhill.net> (original version)
|              > Steven Eiselen <seiselen.github.io> (minimized and MJS)
+-----------------------------------------------------------------------
| # HalfEdge.angle: Used to properly sort halfsegments counterclockwise.
|   By convention, defined as the angle of the line defined by the 'site
|   to the left' to the 'site to the right'. However, border edges have 
|   no 'site to the right': thus instead use angle of line perpendicular
|   to halfsegment (should have both end points defined in such cases.)
+---------------------------------------------------------------------*/
import VEdge from "./VEdge.mjs";

/** **VHalfEdge** (**V**oronoi **Half Edge**) */
class VHalfEdge {

  /** @param {VEdge} in_edge input edge @param {VSite} in_lSite input left site @param {VSite} in_rSite input right site */
  constructor(in_edge, in_lSite, in_rSite) {

    /** @type {VSite} @description one of two vertices whose border this half-edge realizes; AKA the site which 'owns' this half edge */
    this.site = in_lSite;

    /** @type {VEdge} @description the unique edge associated with this half-edge; s.t. it has a counterpart shared with the other site */
    this.edge = in_edge;

    /** @type {number} @description angle composing this halfedge s.t. counterpart will be `180` degrees hereof */
    this.angle;

    if (in_rSite){this.angle = Math.atan2(in_rSite.y-in_lSite.y, in_rSite.x-in_lSite.x);}
    else {this.angle = (this.edge.lSite === in_lSite) ? Math.atan2(this.edge.vb.x-this.edge.va.x, this.edge.va.y-this.edge.vb.y) : Math.atan2(this.edge.va.x-this.edge.vb.x, this.edge.vb.y-this.edge.va.y);}
  };

  /** @description Returns `VEdge` for halfedge start point. Note that halfedges are always countercockwise. */
  getStartpoint(){return this.edge.lSite === this.site ? this.edge.va : this.edge.vb;}

  /** @description Returns `VEdge` for halfedge end point. Note that halfedges are always countercockwise. */  
  getEndpoint(){return this.edge.lSite === this.site ? this.edge.vb : this.edge.va;}
  
}


export default VHalfEdge;