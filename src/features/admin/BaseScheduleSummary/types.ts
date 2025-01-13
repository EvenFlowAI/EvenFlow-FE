export type TSortColumns = 'Role' | 'ServiceBook';

export type TOrder = {
  orderBy: TSortColumns;
  isAscending: boolean;
};
