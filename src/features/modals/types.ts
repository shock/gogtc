import { BootstrapVariant } from '../../types'

export type TitleBody = {
  title: string,
  body: string
}

export type Alert = {
  id:number,
  message:string,
  variant:BootstrapVariant,
  timeout:number,
  details:string|undefined
}
