/*
  This was a great exercise in learning to build custom interactive components.
  It's fully-functional and decently styled.  However, I'd like to investigate
  replacing it with this 3rd party component: https://www.npmjs.com/package/react-numeric-input
*/
import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import * as actions from '../actions';

export interface NumEntryProps {
  id: string;
  value: string;
  label: string;
  type: string;
  minVal: number;
  maxVal: number;
  updateAction: actions.UpdateIdValueAction;
}

export interface NumEntryState {
}

export class NumEntryView extends Component<NumEntryProps, NumEntryState> {

  static defaultProps = {
    minVal: 0,
    maxVal: 999999,
    type: ''
  }

  readonly initialTimeout = 700;

  timerWindow: number;
  accelerationFactor: number;
  mouseTimer: ReturnType<typeof setTimeout> | null;
  acceleration: number;
  direction: string;

  constructor(props: NumEntryProps) {
    super(props);

    this.mouseTimer = null;
    this.acceleration = 1;
    this.direction = '';
    this.accelerationFactor = 1.04;
    this.timerWindow = 20;

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
    let newValue = parseFloat(this.normalizeValue(this.props.value));
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
    let target = event.target as any;
    switch (target.dataset.type) {
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

  normalizeValue(value: any): string {
    console.log(`id: ${this.props.id}`);
    console.log(`value: ${value}`);
    let strVal = ''+value;
    strVal = strVal.replace(/[^0-9.\-+]/g, '');

    let numVal = parseInt(strVal);
    if( isNaN(numVal) ) { numVal = 0; }
    if( numVal < this.props.minVal ) { numVal = this.props.minVal; }
    if( numVal > this.props.maxVal ) { numVal = this.props.maxVal; }
    return ''+numVal;
  }

  decrementValue() {
    this.props.updateAction(this.props.id, ''+(this.normalizeValue(parseInt(this.props.value)-1)));
  }

  incrementValue() {
    this.props.updateAction(this.props.id, ''+(this.normalizeValue(parseInt(this.props.value)+1)));
  }

  updateValue(value: any) {
    this.props.updateAction(this.props.id, ''+this.normalizeValue(value));
  }

  formattedVal() {
    // const numVal = parseFloat(this.props.value)
    // const strVal = numVal.toLocaleString();
    // return strVal;
    return this.props.value;
  }

  renderWithInsert(insert:any, className='') {
    let label:any = null;
    if( this.props.label !== '' ) {
      label = (
        <label>{this.props.label}</label>
      )
    }
    return (
      <div className={`NumCell ${className}`}>
        {label}
        <div className='nobr inline relative'>
          <Button className="button btn-xs" data-type='dec'
            onMouseDown={this.handleMouseDown}
            onMouseUp={this.handleMouseUp}>–</Button>
          <input id={this.props.id} type="text" className={this.props.type} value={this.formattedVal()} onChange={this.handleChange} />
          {insert}
          <Button className="button btn-xs" data-type='inc'
            onMouseDown={this.handleMouseDown}
            onMouseUp={this.handleMouseUp}>+</Button>
        </div>
      </div>

    );
  }

  render() {
    return this.renderWithInsert(null);
  }
}