declare module 'FormCalc' {
  export type NumEntry = {
    id: string;
    value: string;
    label: string;
  }

  export type KeyedNumEntry = {
    [key: string]: NumEntry
  }

  export type FormCalc = {
    numEntries: KeyedNumEntry
  }
}
