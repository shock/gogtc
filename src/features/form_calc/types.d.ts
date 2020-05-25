declare module 'FormCalc' {
  export type NumEntry = {
    id: string;
    value: string;
  }

  export type KeyedNumEntry = {
    [key: string]: NumEntry
  }

  export type FormCalc = {
    numEntries: KeyedNumEntry
  }
}
