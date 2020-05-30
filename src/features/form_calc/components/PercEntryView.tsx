import React from 'react';
import { RootState } from 'typesafe-actions';
import { connect } from 'react-redux';
import * as actions from '../actions';
import { NumEntryBase, NumEntryProps } from './NumEntryView';

const mapStateToProps = (state: RootState) => ({
});

const dispatchProps = {
  updateNumEntry: actions.updateNumEntry,
};

export interface PercEntryProps extends NumEntryProps {
}

type Props = ReturnType<typeof mapStateToProps> & typeof dispatchProps & PercEntryProps;

export interface NumEntryState {
}

class PercEntryBase extends NumEntryBase {

  static defaultProps = {
    minVal: 0,
    maxVal: 100
  }

  componentDidMount() {
    console.log(`PercEntry Mounted with id: ${this.props.id}`);
  }

  normalizeValue(value: any): number {
    let strVal = ''+value;
    strVal = strVal.replace(/[^0-9\.]/g, '');

    let numVal = parseFloat(strVal);
    if( isNaN(numVal) ) { numVal = 0; }
    if( numVal < this.props.minVal ) { numVal = this.props.minVal; }
    if( numVal > this.props.maxVal ) { numVal = this.props.maxVal; }
    return parseFloat(''+numVal);
  }

  handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const target = event.target;
    this.updateValue(target.value);
  }

  decrementValue() {
    this.props.updateNumEntry(this.props.id, ''+(this.normalizeValue(parseFloat(this.props.value)-0.1)));
  }

  incrementValue() {
    this.props.updateNumEntry(this.props.id, ''+(this.normalizeValue(parseFloat(this.props.value)+0.1)));
  }

  updateValue(value: any) {
    this.props.updateNumEntry(this.props.id, ''+this.normalizeValue(value));
  }

  formattedVal() {
    const numVal = parseFloat(this.props.value).toFixed(2);
    const strVal = numVal.toLocaleString();
    return `${strVal}%`;
  }

}

const PercEntryView = connect(mapStateToProps, dispatchProps)(PercEntryBase);
export { PercEntryView };