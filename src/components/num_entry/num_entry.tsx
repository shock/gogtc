import * as React from 'react';
import { connect } from 'react-redux';
import { updateNumEntry } from '../../state/actions/num_entry_actions';


import { NumEntryProps, NumEntryState } from 'NumEntry';

class NumEntryBase extends React.Component<NumEntryProps, NumEntryState> {
  constructor(props: NumEntryProps) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDecrement = this.handleDecrement.bind(this);
    this.handleIncrement = this.handleIncrement.bind(this);
  }

  componentDidMount() {
    console.log(`NumEntry Mounted with id: ${this.props.id}`);
    // this.updateValue('0');
  }

  handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.updateValue(event.target.value);
  }

  handleDecrement(event: React.MouseEvent) {
    this.updateValue(this.normalizeValue(this.props.value)-1);
  }

  handleIncrement(event: React.MouseEvent) {
    this.updateValue(this.normalizeValue(this.props.value)+1);
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
    this.props.dispatchUpdateField(this.props.id, ''+this.normalizeValue(value));
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
const mapDispatchToProps = (dispatch) => ({
  dispatchUpdateField: (id,value) => dispatch(updateNumEntry(id,value))
});

const NumEntry = connect(null, mapDispatchToProps)(NumEntryBase);
export { NumEntry };