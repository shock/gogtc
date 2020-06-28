import React, { ReactNode } from 'react'
import { connect } from 'react-redux'
import { Alert } from 'react-bootstrap'
import { RootState } from 'typesafe-actions'
import { Alert as AlertType} from '../types'

import * as actions from '../actions';
import * as selectors from '../selectors';

const mapStateToProps = (state: RootState) => ({
  alerts: state.modals.alerts.alerts
});

const dispatchProps = {
  hide: actions.hideAlert,
  showModal: actions.showGeneralModal
};

interface SharedAlertProps {
}

type Props = ReturnType<typeof mapStateToProps> & typeof dispatchProps & SharedAlertProps;
type State = {
}

class GeneralAlertBase extends React.Component<Props, State> {
  constructor(props:Props) {
    super(props)
  }

  handleClick(alert:AlertType) {
    this.props.hide(alert.id)
    if(alert.details) {
      this.props.showModal(alert.details, 'Error')
    }
  }

  render() {
    const renderedAlerts = this.props.alerts.map((alert) => (
      <Alert key={alert.id} variant={alert.variant} onClick={() => {this.handleClick(alert)}}>
        {alert.message}
      </Alert>
    ));
    return (
      <div style={{position: 'relative'}}>
        <div  style={{position:'absolute', zIndex:1, width:'35%', right:'0'}}>
          <div  style={{margin:'1rem 0 0 auto'}}>
            {renderedAlerts}
          </div>
        </div>
      </div>
    );
  }
}

const GeneralAlert = connect(
  mapStateToProps,
  dispatchProps
)(GeneralAlertBase);

export { GeneralAlert };
