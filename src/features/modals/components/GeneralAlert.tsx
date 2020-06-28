import React, { ReactNode } from 'react'
import { connect } from 'react-redux'
import { Alert } from 'react-bootstrap'
import { RootState } from 'typesafe-actions'

import * as actions from '../actions';
import * as selectors from '../selectors';

const mapStateToProps = (state: RootState) => ({
  alerts: state.modals.alerts.alerts
});

const dispatchProps = {
  hide: actions.removeAlert
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

  render() {
    const renderedAlerts = this.props.alerts.map((alert) => (
      <Alert key={alert.id} variant={alert.variant} onClick={() => {this.props.hide(alert.id)}}>
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
