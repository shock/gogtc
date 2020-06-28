import React from 'react'
import { Button } from 'react-bootstrap'
import { BootstrapVariant } from '../types'
function handler(e:any) {}

type Props = {
  onClick:(e: any) => void
  variant:BootstrapVariant
  text:string
}

export class InlineButton extends React.Component<Props> {
  constructor(props:Props) {
    super(props)
  }

  static defaultProps = {
    variant: 'primary',
    onClick: (e:any) => {}
  }

  render() {
    return(
      <Button variant={this.props.variant} onClick={this.props.onClick}>{this.props.text}</Button>
    )
  }
}