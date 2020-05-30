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

  normalizeValue(value: any): string {
    let endsInDecimal = false;
    let strVal = ''+value;
    console.log(`value: ${value}`);
    strVal = strVal.replace(/[^0-9.]/g, '');
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
    // const numVal = parseFloat(this.props.value).toFixed(2);
    // const strVal = numVal.toLocaleString();
    // return `${strVal}%`;
    return this.props.value;
  }

  render() {
    return (
      <div className="NumEntry nobr">
        <label>{this.props.label}</label>
        <div className='nobr inline'>
          <span className="button" data-type='dec'
            onMouseDown={this.handleMouseDown}
            onMouseUp={this.handleMouseUp}>-</span>
          <input type="text" className={this.props.label.split(' ').slice(-1)[0]} value={this.formattedVal()} onChange={this.handleChange} />
          <span className="floatPercent">%</span>
          <span className="button" data-type='inc'
            onMouseDown={this.handleMouseDown}
            onMouseUp={this.handleMouseUp}>-</span>
        </div>
      </div>

    );
  }

}

const PercEntryView = connect(mapStateToProps, dispatchProps)(PercEntryBase);
export { PercEntryView };