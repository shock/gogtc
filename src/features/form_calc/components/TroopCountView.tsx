import React, { Component } from 'react';
import NumericInput from 'react-numeric-input';

import * as actions from '../actions';
import { MTroopDef } from '../models';

export interface TroopCountProps {
  troopDef: MTroopDef;
  label: string;
  type: string;
  minVal: number;
  maxVal: number;
  updateAction: actions.UpdateIdValueAction;
}

export interface TroopCountState {
}

export class TroopCountView extends Component<TroopCountProps, TroopCountState> {

  static defaultProps = {
    minVal: 0,
    maxVal: 999999,
    type: '',
    label: ''
  }

  constructor(props: TroopCountProps) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }

  data() { return this.props.troopDef; }
  id() { return `${this.data().id()}:count`; }

  componentDidMount() {
    console.log(`TroopCount Mounted with id: ${this.id()}`);
  }

  handleChange(numVal:number|null, strVal:string, target:HTMLInputElement) {
    this.updateValue(numVal);
  }

  updateValue(value: any) {
    this.props.updateAction(this.id(), ''+value);
  }

  format(val:number|null) {
    // return `${val} %`;
    return `${val}`;
  }

  parse(strVal:string) {
    return parseFloat(strVal.replace(/[^\d.\-]/,''));
  }

  renderWithInsert(insert:any, className='') {
    let label:any = null;
    if( this.props.label !== '' ) {
      label = (
        <label>{this.props.label}</label>
      )
    }
    return (
      <div className={`TroopCount ${className} inline`}>
        {label}
        <NumericInput
          // step={0.1} precision={2}
          className={this.data().type}
          min={this.props.minVal}
          max={this.props.maxVal}
          value={this.data().count}
          format={this.format}
          parse={this.parse}
          onChange={this.handleChange}
        />
      </div>

    );
  }

  render() {
    return this.renderWithInsert(null, 'NumCell');
  }
}