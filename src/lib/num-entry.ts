export const formatInteger = (val:number|null) => {
  let strVal = '';
  if( val !== null ) {
    // strVal = parseInt(''+val).toLocaleString();
    strVal = parseInt(''+val).toString();
  }
  return strVal;
}

export const parseInteger = (strVal:string) => {
  return parseInt(strVal.replace(/[^\d.]/,''));
}

export const formatPercent = (val:number|null) => {
  return `${val} %`;
}

export const parsePercent = (strVal:string) => {
  let sVal = strVal.replace(/[^\d.]/,'');
  sVal = sVal.replace(/\.{2,}/,'.');
  return parseFloat(sVal);
}
