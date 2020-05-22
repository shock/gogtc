declare module 'NumEntry' {
  export interface NumEntryProps {
    id: string;
    value: string;
    label: string;
    dispatchUpdateField(id: string, value: string): any;
  }

  export interface NumEntryState {
    percentage: boolean;
  }
}
