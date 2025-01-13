import { TForm, TRow } from './types';

export const defaultForm: TForm = {
  start: 0,
  stop: 0,
  duration1: 0,
  duration2: 0,
};
export const rows: TRow[] = [
  {
    label: 'Start (hours)',
    items: [{ value: '0' }, { name: 'start' }, { name: 'stop' }],
  },
  {
    label: 'Duration (hours)',
    items: [{ name: 'duration1' }, { name: 'duration2' }, { value: '' }],
  },
];
