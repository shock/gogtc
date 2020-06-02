export const formatCount = (val:number|null) => {
  let strVal = '';
  if( val !== null )
    strVal = parseInt(''+val).toLocaleString();
  return strVal;
}

export const parseCount = (strVal:string) => {
  return parseInt(strVal.replace(/[^\d.]/,''));
}

export const formatPercent = (val:number|null) => {
  return `${val} %`;
}

export const parsePercent = (strVal:string) => {
  return parseFloat(strVal.replace(/[^\d.]/,''));
}
