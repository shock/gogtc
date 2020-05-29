import { RootState } from 'typesafe-actions';
import React from 'react';
import { connect } from 'react-redux';
import * as selectors from '../selectors';
import * as actions from '../actions';
import { Component } from 'react';
import $ from 'jquery';

const mapStateToProps = (state: RootState) => ({
});

const dispatchProps = {
  updateNumEntry: actions.updateNumEntry,
};

export interface NumEntryProps {
  id: string;
  value: string;
  label: string;
  minVal: number;
  maxVal: number;
}

type Props = ReturnType<typeof mapStateToProps> & typeof dispatchProps & NumEntryProps;

export interface NumEntryState {
  percentage: boolean;
}

class NumEntryBase extends Component<Props, NumEntryState> {

  static defaultProps = {
    minVal: 0,
    maxVal: 999999
  }

  readonly initialTimeout = 700;
  readonly timerWindow = 20;
  readonly accelerationFactor = 1.04;

  mouseTimer: ReturnType<typeof setTimeout> | null;
  acceleration: number;
  direction: string;

  constructor(props: Props) {
    super(props);

    this.mouseTimer = null;
    this.acceleration = 1;
    this.direction = '';
    this.handleChange = this.handleChange.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.timerHandler = this.timerHandler.bind(this);
  }

  cancelTimer() {
    if( this.mouseTimer != null ) {
      clearTimeout(this.mouseTimer);
    }
  }

  setupTimer(timeout: number) {
    this.cancelTimer();
    this.mouseTimer = setTimeout( this.timerHandler, timeout);
  }

  resetTimer() {
    this.acceleration = 1;
    this.cancelTimer();
    this.setupTimer(this.initialTimeout);
  }

  timerHandler() {
    let newValue = this.normalizeValue(this.props.value);
    this.acceleration *= this.accelerationFactor;
    switch(this.direction) {
      case 'dec':
        newValue -= this.acceleration;
        break;
      case 'inc':
        newValue += this.acceleration;
        break;
    }
    this.updateValue(newValue);
    this.setupTimer(this.timerWindow);
  }

  componentDidMount() {
    console.log(`NumEntry Mounted with id: ${this.props.id}`);
  }

  handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.updateValue(event.target.value);
  }

  handleMouseDown(event: React.MouseEvent) {
    event.preventDefault();
    let target = $(event.target);
    switch (target.data('type')) {
      case 'dec':
        this.direction = 'dec';
        this.decrementValue();
        this.resetTimer();
        break;
      case 'inc':
        this.direction = 'inc';
        this.incrementValue();
        this.resetTimer();
        break;
    }
  }

  handleMouseUp(event: React.MouseEvent) {
    event.preventDefault();
    this.cancelTimer();
  }

  normalizeValue(value: any): number {
    let strVal = ''+value;
    strVal = strVal.replace(/[^0-9\.]/g, '');

    let numVal = parseFloat(strVal);
    if (this.state && this.state.percentage) {

    }
    if( isNaN(numVal) ) { numVal = 0; }
    if( numVal < this.props.minVal ) { numVal = this.props.minVal; }
    if( numVal > this.props.maxVal ) { numVal = this.props.maxVal; }
    return parseInt(''+numVal);
  }

  decrementValue() {
    this.props.updateNumEntry(this.props.id, ''+(this.normalizeValue(parseInt(this.props.value)-1)));
  }

  incrementValue() {
    this.props.updateNumEntry(this.props.id, ''+(this.normalizeValue(parseInt(this.props.value)+1)));
  }

  updateValue(value: any) {
    this.props.updateNumEntry(this.props.id, ''+this.normalizeValue(value));
  }

  formattedVal() {
    const numVal = parseFloat(this.props.value)
    const strVal = numVal.toLocaleString();
    return strVal;
  }

  render() {
    return (
      <div className="NumEntry">
        <label>{this.props.label}</label>
        <div className='nobr'>
          <span className="button" data-type='dec'
            onMouseDown={this.handleMouseDown}
            onMouseUp={this.handleMouseUp}>-</span>
          <input type="text" value={this.formattedVal()} onChange={this.handleChange} />
          <span className="button" data-type='inc'
            onMouseDown={this.handleMouseDown}
            onMouseUp={this.handleMouseUp}>-</span>

        </div>
      </div>

    );
  }
}

const NumEntryView = connect(mapStateToProps, dispatchProps)(NumEntryBase);
export { NumEntryView };