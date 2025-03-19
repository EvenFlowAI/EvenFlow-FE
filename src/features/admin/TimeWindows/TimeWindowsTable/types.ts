export type TForm = {
  start: number;
  stop: number;
  duration1: number;
  duration2: number;
};
type TItem = {
  name?: keyof TForm;
  value?: string;
};
export type TRow = {
  label: string;
  items: TItem[];
};
