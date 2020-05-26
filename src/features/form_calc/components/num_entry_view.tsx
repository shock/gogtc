import { RootState } from 'typesafe-actions';
import React from 'react';
import { connect } from 'react-redux';

import * as selectors from '../selectors';
import * as actions from '../actions';
import { Component } from 'react';

const mapStateToProps = (state: RootState) => ({
  formCalc: selectors.getNumEntries(state.formCalc)
});

const dispatchProps = {
  incNumEntry: actions.incNumEntry,
  decNumEntry: actions.decNumEntry,
  updateNumEntry: actions.updateNumEntry,
};

export interface NumEntryProps {
  id: string;
  value: string;
  label: string;
}

type Props = ReturnType<typeof mapStateToProps> & typeof dispatchProps & NumEntryProps;

export interface NumEntryState {
  percentage: boolean;
}

class NumEntryBase extends Component<Props, NumEntryState> {
  constructor(props: Props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDecrement = this.handleDecrement.bind(this);
    this.handleIncrement = this.handleIncrement.bind(this);
  }

  componentDidMount() {
    console.log(`NumEntry Mounted with id: ${this.props.id}`);
  }

  handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.updateValue(event.target.value);
  }

  handleDecrement(event: React.MouseEvent) {
    event.preventDefault();
    this.props.decNumEntry(this.props.id);
  }

  handleIncrement(event: React.MouseEvent) {
    event.preventDefault();
    this.props.incNumEntry(this.props.id);
  }

  normalizeValue(value: any): number {
    let val = parseFloat(value);
    if (this.state && this.state.percentage) {

    }
    if( isNaN(val) ) { val = 0; }
    if( val < 0 ) { val = 0; }
    return val;
  }

  updateValue(value: any) {
    this.props.updateNumEntry(this.props.id, ''+this.normalizeValue(value));
  }

  handleSubmit(event: Event) {
    alert('A name was submitted: ' + this.props.value);
    event.preventDefault();
  }

  render() {
    // console.log(this.props);
    return (
      <div className="NumEntry">
        <label>{this.props.label}</label>
        <span className="button" onClick={this.handleDecrement}>-</span>
        <input type="text" value={this.props.value} onChange={this.handleChange} />
        <span className="button" onClick={this.handleIncrement}>+</span>
      </div>

    );
  }
}

const NumEntryView = connect(mapStateToProps, dispatchProps)(NumEntryBase);
export { NumEntryView };