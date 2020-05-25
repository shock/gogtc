declare module 'FormCalc' {
  export type NumEntry = {
    id: string;
    value: string;
  }

  export type FormCalcState = {
    [key: string]: NumEntry
  }
}
