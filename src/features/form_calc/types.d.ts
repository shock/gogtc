declare module 'FormCalc' {
  export type NumEntry = {
    id: string;
    value: string;
  }

  export type FormCalc = {
    numEntries: {
      [key: string]: NumEntry
    }
  }
}
