import React from 'react';
import { RootState } from 'typesafe-actions';
import { connect } from 'react-redux';
import * as selectors from '../selectors';
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

  constructor(props: Props) {
    super(props);
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
    const numVal = parseFloat(this.props.value);
    const strVal = numVal.toLocaleString();
    return `${strVal}%`;
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