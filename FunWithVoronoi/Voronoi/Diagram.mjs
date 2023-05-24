/*----------------------------------------------------------------------
|>>> Class VDiagram : [V]oronoi [Diagram]
+-----------------------------------------------------------------------
| Description: Contains data returned from 
| Authors:     > Steven Eiselen <seiselen.github.io> (minimized and MJS)
+---------------------------------------------------------------------*/
import VCell from "./Cell.mjs";
import VEdge from "./Edge.mjs";
import VVertex from "./Vertex.mjs";
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
    /** @type {VCell[]} all VD cells i.e. all I really want/need */
    this.cells=in_cells;
    /** @type {VEdge[]} all **full** i.e. shared edges of all VD cells */
    this.edges=in_edges;
    /** @type {VVertex[]} all vertices of all VD cells/geometry */
    this.vertices=in_verts;
    /** @type {number} time it took to generate VD, in `milliseconds` */
    this.execTime=in_execTime; 
  }
}

export default VDiagram;