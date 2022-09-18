function popMean(pop){
  return pop.reduce((preVal,curVal) => preVal + curVal, 0) / pop.length;
} // Ends Function popMean


function popVariance(pop, pMean=undefined){
  let meanVal = (pMean==undefined) ? popMean(pop) : pMean;
  return parseFloat((pop.reduce((preVal,curVal) => preVal + pow(curVal-meanVal,2), 0) / pop.length).toFixed(2));
} // Ends Function popVariance


function popStandardDev(pop, pVari=undefined){
  let variVal = (pVari==undefined) ? popVariance(pop) : pVari;
  return sqrt(variVal);
} // Ends Function popStandardDev