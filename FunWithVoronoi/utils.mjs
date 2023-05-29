/**
 * @todo ADD THESE AND {@link EisBBox} AND {@link FrameCooldown} TO BG/GENERAL `utils.js` (VIA NEW VERSION IN MICHAEL JACKSON SCRIPT?)
 */


/**
 * Returns `true` IFF input value is `null` xor `undefined`.
 * @param {*} in_val input value to be tested
 * @see {@link notNullish} for negation counterpart function
 * @returns {boolean} `true` IFF `null` xor `undefined`; `false` otherwise
 */
function nullish(in_val){return in_val===null||in_val===undefined}

/**
 * Returns `true` IFF input value is **NOT** `null` xor `undefined`. Syntactic sugar of {@link nullish}.
 * @param {*} in_val input value to be tested
 * @see {@link nullish} for negation counterpart function
 * @returns {boolean} `true` IFF **NOT** `null` xor `undefined`; `false` otherwise
 */
function notNullish(in_val){return !nullish(in_val)}

/**
 * Returns `true` IFF input value is "falsy" via MDN ref linked below; sans the `document.all` case as it's now deprecated.
 * @see https://developer.mozilla.org/en-US/docs/Glossary/Falsy
 * @see {@link truthy} for negation counterpart function
 * @param {*} in_val input value to be tested
 * @returns {boolean} `true` IFF **falsy**; else *(ironically)* `false`
 */
function falsy(in_val){return nullish(in_val)||in_val===false||in_val===NaN||in_val===""||in_val===0||in_val===-0||in_val===0n}

/**
 * Returns `true` IFF input value is **NOT** "falsy". Syntactic sugar of {@link falsy} whose docu has more info on qualifiers.
 * @see {@link falsy} for negation counterpart function
 * @param {*} in_val input value to be tested
 * @returns {boolean} `true` IFF **truthy**; else `false` if *falsy*
 */
function truthy(in_val){return !falsy(in_val)}




const FrameCooldown = {
  frameOff: 4,
  curFrame: 0,
  active(){return this.curFrame==0},
  update(){this.curFrame=(this.curFrame+1)%this.frameOff}
}






/**
 * I've written this sequence of calls for as long and as many times as
 * I've written for loops... it's time to encapsulate it within a util.
 * @note **!!! EXPERIMENTAL !!!**
 * @param {PColor|undefined|null} vFill
 * @param {PColor|undefined|null} vStrk 
 * @param {number|undefined|null} vSwgt 
 */
function setStyle(vFill,vStrk,vSwgt){

  switch(!!vFill){case true: fill(vFill); break; case false: noFill();}
  switch(!!vStrk){case true: stroke(vStrk); break; case false: noStroke();}
  switch(!!vSwgt){case true: strokeWeight(vSwgt); break; case false: break;}   
}





function distLessThan(va,vb,dist){
  return ((vb.x-va.x) * (vb.x-va.x)) + ((vb.y-va.y) * (vb.y-va.y)) <= (dist*dist);
}


/**
 * 
 * @syntaxsugar via calling negation of {@link distLessThan}
 * @returns if dist is **STRICTLY** greater (as consequence of its call returning `a-b<=dist`)
 */
function distGreaterThan(va,vb,dist){
  return !distLessThan(va,vb,dist);
}



function distSq(x1,y1,x2,y2){
  let dx=x2-x1; let dy=y2-y1; return (dx*dx)+(dy*dy);
} // Ends Function distSq

function vertsEqual(v1,v2){
  return (abs(v1.x-v2.x)<0.01)&&(abs(v1.y-v2.y)<0.01);
}

export {
  distSq,
  vertsEqual,
  distLessThan,
  distGreaterThan,
  setStyle,
  nullish,
  notNullish,
  truthy,
  falsy, 
}