import React from 'react';
import { RootState } from 'typesafe-actions';
import { connect } from 'react-redux';
import * as actions from '../actions';
import { NumEntryView, NumEntryProps } from './NumEntryView';

export class PercEntryView extends NumEntryView {

  static defaultProps = {
    minVal: 0,
    maxVal: 100,
    type: ''
  }

  componentDidMount() {
    console.log(`PercEntry Mounted with id: ${this.props.id}`);
  }

  normalizeValue(value: any): string {
    let endsInDecimal = false;
    let strVal = ''+value;
    console.log(`id: ${this.props.id}`);
    console.log(`value: ${value}`);
    strVal = strVal.replace(/[^0-9.\-\+]/g, '');
    strVal = strVal.replace(/\.{2,}/, '.');
    endsInDecimal = strVal[strVal.length-1] === '.';

    let numVal = parseFloat(strVal);
    if( isNaN(numVal) ) { numVal = 0; }
    if( numVal < this.props.minVal ) { numVal = this.props.minVal; }
    if( numVal > this.props.maxVal ) { numVal = this.props.maxVal; }
    console.log(`numVal: ${numVal}`);

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
    console.log(`strVal: ${strVal}`);
    return strVal;
  }

  decrementValue() {
    this.props.updateAction(this.props.id, ''+(this.normalizeValue(parseFloat(this.props.value)-0.1)));
  }

  incrementValue() {
    this.props.updateAction(this.props.id, ''+(this.normalizeValue(parseFloat(this.props.value)+0.1)));
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