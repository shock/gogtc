import React from 'react';
import { NumEntryView, NumEntryProps } from './NumEntryView';

export class PercEntryView extends NumEntryView {

  static defaultProps = {
    minVal: 0,
    maxVal: 100,
    type: ''
  }

  constructor(props: NumEntryProps) {
    super(props);
    this.acceleration = 0.01;
    this.accelerationFactor = 1.0;
    this.timerWindow = 50;
  }

  componentDidMount() {
    console.log(`PercEntry Mounted with id: ${this.props.id}`);
  }

  normalizeValue(value: any): string {
    let endsInDecimal = false;
    let strVal = ''+value;
    console.log(`id: ${this.props.id}`);
    console.log(`value: ${value}`);
    strVal = strVal.replace(/[^0-9.\-+]/g, '');
    strVal = strVal.replace(/\.{2,}/, '.');
    endsInDecimal = strVal[strVal.length-1] === '.';

    let numVal = parseFloat(strVal);
    if( isNaN(numVal) ) { numVal = 0; }
    if( numVal < this.props.minVal ) { numVal = this.props.minVal; }
    if( numVal > this.props.maxVal ) { numVal = this.props.maxVal; }

    strVal = ''+numVal;
    let parts = strVal.split('.');
    if( parts[1] ) {
      let fraction = parts[1];
      if( fraction.length > 2) {
        fraction = fraction.slice(0,2);
      }
      parts[1] = fraction;
      strVal = parts.join('.');
    }
    if( endsInDecimal )
      strVal = `${strVal}.`
    return strVal;
  }

  valueTimes100(value:any) {
    return parseInt(''+Math.round(parseFloat(value)*100));
  }

  valueBy100(value:number) {
    return parseFloat((value / 100).toFixed(2));
  }

  decrementValue() {
    let val = this.valueTimes100(this.props.value);
    val -= 1;
    val = this.valueBy100(val);
    this.props.updateAction(this.props.id, this.normalizeValue(val));
  }

  incrementValue() {
    let val = this.valueTimes100(this.props.value);
    val += 1;
    val = this.valueBy100(val);
    this.props.updateAction(this.props.id, this.normalizeValue(val));
  }

  updateValue(value: any) {
    this.props.updateAction(this.props.id, ''+this.normalizeValue(value));
  }

  formattedVal() {
    // const numVal = parseFloat(this.props.value).toFixed(2);
    // const strVal = numVal.toLocaleString();
    // return `${strVal}%`;
    return this.props.value;
  }

  render() {
    return this.renderWithInsert(<span className="floatPercent">%</span>, 'PercEntry');
  }

}