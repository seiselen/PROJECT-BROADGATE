/*----------------------------------------------------------------------
|>>> Class VVertex : [V]oronoi [Vertex]
+-----------------------------------------------------------------------
| Description: Voronoi Vertex realization; refactored into MJS class of
|              minimized comments and syntax by Steven Eiselen.
| Authors:     > Raymond Hill <rhill@raymondhill.net> (original version)
|              > Steven Eiselen <seiselen.github.io> (minimized and MJS)
+-----------------------------------------------------------------------
|# Implementation Note:
|  o Not calling `set(in_x,in_y)` within the constructor for now; as I'm
|    unsure if such will make VSCode lose association with `{x,y}` i.e.
|    as I'd be moving the new `@type` lines thereto as well. So TODOish?
|  o This will DBA `Site` aka `VSite` for the purpose of JSDoc, and <vs>
|    making a standalone definition thereof xor using p5.Vector; as the
|    only properties a 'Site' has is `x` and `y` as described below.
+---------------------------------------------------------------------*/

/** **VVertex** (**V**oronoi **Vertex**) ⯇AKA/DBA⯈ **VSite** (**V**oronoi **Site**) */
class VVertex {

  /** @param {number} in_x input `X` Axis coord component @param {number} in_y input `Y` Axis coord component */
  constructor(in_x, in_y){

    /** @type {number} `X` Axis coord component */
    this.x = in_x;

    /** @type {number} `Y` Axis coord component */
    this.y = in_y;
  }

  /** 
   * Sets coord components of existing `VVertex`/`VSite` instance; similar to `p5.Vector.set()`
   * @param {number} new_x new `X` Axis coord component 
   * @param {number} new_y new `Y` Axis coord component 
   */
  set(new_x, new_y){
    this.x = new_x;
    this.y = new_y;
  }

}

export default VVertex;