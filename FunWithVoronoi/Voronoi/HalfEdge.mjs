/*----------------------------------------------------------------------
|>>> Class VHalfEdge : [V]oronoi [Half] [Edge]
+-----------------------------------------------------------------------
| Description: Voronoi Half-Edge realization; with refactoring into MJS 
|              class of minimized comments and syntax by Steven Eiselen.
| Authors:     > Raymond Hill <rhill@raymondhill.net> (original version)
|              > Steven Eiselen <seiselen.github.io> (minimized and MJS)
+---------------------------------------------------------------------*/
import VEdge from "./Edge.mjs";

/** **VHalfEdge** (**V**oronoi **Half Edge**) */
class VHalfEdge {

  /** @param {VEdge} in_edge input edge @param {VSite} in_lSite input left site @param {VSite} in_rSite input right site */
  constructor(in_edge, in_lSite, in_rSite) {

    /** @type {VSite} one of two vertices whose border this half-edge realizes */
    this.site = in_lSite;

    /** @type {VEdge} the edge associated with this half-edge; s.t. it has a counterpart shared with the other site */
    this.edge = in_edge;

    /** @type {number} angle composing this halfedge s.t. counterpart will be `180` degrees hereof */
    this.angle;

    if (in_rSite){this.angle = Math.atan2(in_rSite.y-in_lSite.y, in_rSite.x-in_lSite.x);}
    else {this.angle = (this.edge.lSite === in_lSite) ? Math.atan2(this.edge.vb.x-this.edge.va.x, this.edge.va.y-this.edge.vb.y) : Math.atan2(this.edge.va.x-this.edge.vb.x, this.edge.vb.y-this.edge.va.y);}
  };

  getStartpoint(){return this.edge.lSite === this.site ? this.edge.va : this.edge.vb;}

  getEndpoint(){return this.edge.lSite === this.site ? this.edge.vb : this.edge.va;}
  
}


export default VHalfEdge;