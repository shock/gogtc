import React from 'react';
import { Button } from 'react-bootstrap';
import { ActionCreators as UndoActionCreators } from 'redux-undo'
import { RootState } from 'typesafe-actions';
import { connect} from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type cH = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
type bT = () => boolean;

const mapStateToProps = (state:RootState) => {
  return {
    canUndo: state.formCalc.past.length > 0,
    canRedo: state.formCalc.future.length > 0
  }
}

const mapDispatchToProps = (dispatch:any) => {
  return {
    onUndo: () => dispatch(UndoActionCreators.undo()),
    onRedo: () => dispatch(UndoActionCreators.redo())
  }
}

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

class _UndoRedo extends React.Component<Props> {
  render () {
    const undoDisabled = !this.props.canUndo ? 'disabled' : '';
    const redoDisabled = !this.props.canUndo ? 'disabled' : '';
    return (
      <p>
        <button className='icon-button' onClick={this.props.onUndo} disabled={!this.props.canUndo}>
          <FontAwesomeIcon
            icon={'undo-alt'}
            fixedWidth
          />
        </button>
        &nbsp;
        <button className='icon-button' onClick={this.props.onRedo} disabled={!this.props.canRedo}>
          <FontAwesomeIcon
            icon={'redo-alt'}
            fixedWidth
          />
        </button>
      </p>
    );
  }
}

// let UndoRedo = (canUndo:bT, canRedo:bT, onUndo:cH, onRedo:cH) => (
//   <p>
//     <Button onClick={onUndo} disabled={!canUndo}>
//       Undo
//     </Button>
//     <Button onClick={onRedo} disabled={!canRedo}>
//       Redo
//     </Button>
//   </p>
// )

const UndoRedo = connect(mapStateToProps, mapDispatchToProps)(_UndoRedo)

export default UndoRedo;
