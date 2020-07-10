import React from 'react'
import { ActionCreators as UndoActionCreators } from 'redux-undo'
import { RootState } from 'typesafe-actions'
import { connect} from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import TT from '../../../components/tooltips'

const mapStateToProps = (state:RootState) => {
  return {
    canUndo: state.formCalc.formCalcs.past.length > 0,
    canRedo: state.formCalc.formCalcs.future.length > 0
  }
}

const mapDispatchToProps = (dispatch:any) => {
  return {
    onUndo: () => dispatch(UndoActionCreators.undo()),
    onRedo: () => dispatch(UndoActionCreators.redo())
  }
}

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>

class _UndoRedo extends React.Component<Props> {
  render () {
    const undoDisabled = !this.props.canUndo
    const redoDisabled = !this.props.canRedo
    return (
      <p>
        <TT tip='Undo' show={!undoDisabled}>
          <button className='icon-button' onClick={this.props.onUndo} disabled={undoDisabled}>
            <FontAwesomeIcon
              icon={'undo-alt'}
              fixedWidth
            />
          </button>
        </TT>
        &nbsp;
        <TT tip='Redo' show={!redoDisabled}>
          <button className='icon-button' onClick={this.props.onRedo} disabled={redoDisabled}>
            <FontAwesomeIcon
              icon={'redo-alt'}
              fixedWidth
            />
          </button>
        </TT>
      </p>
    )
  }
}

const UndoRedo = connect(mapStateToProps, mapDispatchToProps)(_UndoRedo)

export default UndoRedo
