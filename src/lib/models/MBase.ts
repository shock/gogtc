import cuid from 'cuid'

class MBase {
  key:string = cuid()
  changed:boolean = false

  markForUpdate() {
    this.key = cuid()
    this.changed = true
  }

  isChanged () {
    return this.changed
  }

  clearChanged() { this.changed = false }

}

export default MBase