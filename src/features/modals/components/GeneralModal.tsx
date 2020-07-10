import React from 'react'
import { connect } from 'react-redux'
import { Modal, Button } from 'react-bootstrap'
import { RootState } from 'typesafe-actions'

import * as actions from '../actions'
import * as selectors from '../selectors'

const mapStateToProps = (state: RootState) => ({
  generalModal: selectors.getGeneralModal(state)
})

const dispatchProps = {
  hide: actions.hideGeneralModal
}

interface GeneralModalProps {
}

type Props = ReturnType<typeof mapStateToProps> & typeof dispatchProps & GeneralModalProps
type State = {
}

class GeneralModalBase extends React.Component<Props, State> {
  constructor(props:Props) {
    super(props)
    this.handleClose = this.handleClose.bind(this)
  }

  handleClose(e:any) {
    this.props.hide()
  }

  render() {
    return (
      <Modal show={this.props.generalModal.show} onHide={this.handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title style={{textAlign:'center', width:'100%'}}>{this.props.generalModal.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body><pre>{this.props.generalModal.body}</pre></Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={this.handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }
}

const GeneralModal = connect(
  mapStateToProps,
  dispatchProps
)(GeneralModalBase)

export { GeneralModal }
