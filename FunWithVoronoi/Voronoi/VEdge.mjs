/*----------------------------------------------------------------------
|>>> Class VEdge : [V]oronoi [Edge]
+-----------------------------------------------------------------------
| Description: Voronoi Edge realization; with refactoring into MJS class
|              with minimized comments and syntax by Steven Eiselen.
| Authors:     > Raymond Hill <rhill@raymondhill.net> (original version)
|              > Steven Eiselen <seiselen.github.io> (minimized and MJS)
+---------------------------------------------------------------------*/

import VVertex from "./VVertex.mjs";
/** @typedef {VVertex} VSite */

/** **VEdge** (**V**oronoi **Edge**) */
class VEdge {

  /** @param {VSite} in_lSite input left site @param {VSite} in_rSite input right site */
  constructor(in_lSite, in_rSite){

    /** @type {VSite} @description left site i.e. vertex of VD */
    this.lSite = in_lSite;

    /** @type {VSite} @description right site i.e. vertex of VD (could be null if closed by bounding box) */    
    this.rSite = in_rSite;

    /** @type {VVertex} @description vertex defining start point of edge */
    this.va = null;

    /** @type {VVertex} @description vertex defining end point of edge */    
    this.vb = null;
  }

  /** 
   * Sets coord components of existing `VVertex`/`VSite` instance.
   * @note  **WARNING:** Will set {@link va} and {@link vb} to `null`!
   * @param {VSite} in_lSite input left site @param {VSite} in_rSite input right site
   */
  set(in_lSite, in_rSite){this.lSite=in_lSite; this.rSite=in_rSite; this.va=this.vb=null;}


}

export default VEdge;