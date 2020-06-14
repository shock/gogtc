import * as React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import cuid from 'cuid';

type Placement = import('react-overlays/usePopper').Placement;

const showDelay = 1200;
const hideDelay = 200;

export const renderTooltip = (content:string, props?:any) => {
  return (
    <Tooltip id={cuid} ref={React.createRef()} {...props}>
      {content}
    </Tooltip>
  );
}

type Blah = ReturnType<typeof renderTooltip>;

export const renderWithTooltip = (children:any, tip:any, placement:Placement='top') => {
  return (
    <OverlayTrigger
      placement={placement}
      delay={{ show: showDelay, hide: hideDelay }}
      overlay={renderTooltip(tip)}
    >
      {children}
    </OverlayTrigger>
  )
}

type EasyToolTipProps = {
  tip:string,
  placement?:Placement
  show?:boolean,
}

export default class EasyToolTip extends React.Component<EasyToolTipProps> {
  static defaultProps = {
    placement: 'top',
    show: true
  }

  render() {
    if( this.props.show ) {
      return (
        <OverlayTrigger
          placement={this.props.placement}
          delay={{ show: showDelay, hide: hideDelay }}
          overlay={renderTooltip(this.props.tip)}
        >
          {this.props.children}
        </OverlayTrigger>
      );
    } else {
      return (
        <>
          {this.props.children}
        </>
      );
    }
  }
}