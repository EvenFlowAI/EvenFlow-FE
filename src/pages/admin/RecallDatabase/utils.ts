import { IGlobalRecall, OrderByField } from './types';

export const initialOrder = {
  orderBy: String(OrderByField.ReportedDate),
  isAscending: false,
};

export const sortById = (a: IGlobalRecall, b: IGlobalRecall): number => {
  return a.id - b.id;
};
