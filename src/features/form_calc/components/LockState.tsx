import * as React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconDefinition } from '@fortawesome/fontawesome-svg-core'

type LockStateProps = {
  locked: boolean,
  onClick: (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => void
}

const IconForState = {
  locked: 'lock',
  unlocked: 'unlock'
}

export class LockState extends React.Component<LockStateProps> {

  lockState() {
    return this.props.locked ? 'locked' : 'unlocked'
  }

  // chooses the font-awesome icons for the state of the lock
  icon() {
    const icon = IconForState[this.lockState()]
    return icon as unknown as IconDefinition
  }

  renderLock() {
    return <FontAwesomeIcon icon={this.icon()} fixedWidth onClick={this.props.onClick}/>
  }

  render() {
    const classNames = "LockState inline".split(' ')
    classNames.push(this.lockState())
    return (
      <div className={classNames.join(' ')}>{this.renderLock()}</div>
    )
  }
}