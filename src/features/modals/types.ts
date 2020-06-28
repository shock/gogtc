export type TitleBody = {
  title: string,
  body: string
}

export type Variant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'dark'
  | 'light';

export type Alert = {
  id:number,
  message:string,
  variant:Variant
}
