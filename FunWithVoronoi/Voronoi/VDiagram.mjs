/*----------------------------------------------------------------------
|>>> Class VDiagram : [V]oronoi [Diagram]
+-----------------------------------------------------------------------
| Description: Contains data returned from 
| Authors:     > Steven Eiselen <seiselen.github.io> (minimized and MJS)
+---------------------------------------------------------------------*/
import VCell from "./VCell.mjs";
import VEdge from "./VEdge.mjs";
import VVertex from "./VVertex.mjs";
import Voronoi from "./Voronoi.mjs";

/**
 * **VDiagram** (**V**oronoi **Diagram**)
 * @description Contains data returned from call of Voronoi Diagram generator.
 * @see {@link Voronoi.compute}
 * @author Steven Eiselen <http://seiselen.github.io> (WRT docu'd class)
 */
class VDiagram {
  /** @param {VCell[]} in_cells @param {VEdge[]} in_edges @param {VVertex[]} in_verts @param {number[]} in_execTime */
  constructor(in_cells, in_edges, in_verts, in_execTime){
    /** @type {VCell[]} @description array of all VD cells encompassing the VD; i.e. all I really want/need @note elements within might have empty array of halfedges; which implies no Voronoi cell could be computed. */
    this.cells=in_cells;
    /** @type {VEdge[]} @description array of unordered, unique `VEdge` objects encompassing the VD */
    this.edges=in_edges;
    /** @type {VVertex[]} @description array of unordered, unique `VVertex` objects encompassing the VD */
    this.vertices=in_verts;
    /** @type {number} @description time it took to generate VD, in `milliseconds` */
    this.execTime=in_execTime; 
  }





}

export default VDiagram;