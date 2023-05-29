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
 * @author Steven Eiselen <http://seiselen.github.io>
 */
class VDiagram {
  /** @param {VCell[]} in_cells @param {VEdge[]} in_edges @param {VVertex[]} in_verts @param {number[]} in_execTime */
  constructor(in_cells, in_edges, in_verts, in_execTime){
    /** 
     * Array of all VD cells, **including** their respective sites.
     * @note Elements herein might have empty array of halfedges; which implies no Voronoi cell could be computed.
     * @type {VCell[]}
     */
    this.cells=in_cells;

    /** 
     * Unordered array of unique `VEdge` objects encompassing the VD
     * @type {VEdge[]}
     */
    this.edges=in_edges;

    /** 
     * Unordered array of unique `VVertex` objects encompassing the VD
     * @type {VVertex[]} @description
     */
    this.vertices=in_verts;

    /** @type {number} @description time it took to generate VD, in `milliseconds` */
    this.execTime=in_execTime; 
  }
}

export default VDiagram;