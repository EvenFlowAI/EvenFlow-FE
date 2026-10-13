import type React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { changePageData } from '../../../../../store/reducers/enhancedCustomerSearch/actions';
import { ICustomerWithPhones } from '../../../../../store/reducers/enhancedCustomerSearch/types';
import { IPageRequest } from '../../../../../types/types';
import { usePagination } from '../../../../../hooks/usePaginations/usePaginations';
import { initialColumnOffset } from '../constants';
import { TColumn, TOffset, TSortColumn, TSortOrder } from '../types';
import { getOrderedColumns, getSortOrderDifference, sortByColumn } from './helpers';

type TParams = {
  customers: ICustomerWithPhones[];
  pageData: IPageRequest;
  selectedColumns: TColumn[];
};

const useCustomerTableState = ({ customers, pageData, selectedColumns }: TParams) => {
  const [data, setData] = useState<ICustomerWithPhones[]>([]);
  const [sorting, setSorting] = useState<TSortOrder>({ isAscending: true, order: null });
  const [offset, setOffset] = useState<TOffset>(initialColumnOffset);
  const { changeRowsPerPage, changePage } = usePagination(
    state => state.customers.pageData,
    changePageData
  );

  const orderedColumns = useMemo(() => getOrderedColumns(selectedColumns), [selectedColumns]);
  const [currentFirstItemIndex, currentLastItemIndex] = useMemo(
    () => [pageData.pageIndex * pageData.pageSize, (pageData.pageIndex + 1) * pageData.pageSize],
    [pageData]
  );

  useEffect(() => {
    setOffset({ secondColumn: 124, thirdColumn: 274 });
  }, []);

  useEffect(() => {
    setData(customers.map((customer, index) => ({ ...customer, sortOrder: index })));
  }, [customers]);

  const resetData = () => {
    setData(customers.slice().sort(getSortOrderDifference));
  };

  const onSort = (order: TSortColumn) => {
    setData(currentData =>
      [...currentData].sort((first, second) =>
        sortByColumn(first, second, order, sorting.isAscending)
      )
    );
    setSorting(currentSorting => ({
      isAscending: !currentSorting.isAscending,
      order,
    }));
  };

  const handleChangePage = (
    event: React.MouseEvent<Element, MouseEvent> | null,
    pageNumber: number
  ) => {
    changePage(event, pageNumber);
  };

  const handleChangeRows = (event: React.ChangeEvent<HTMLInputElement>) => {
    changeRowsPerPage(event);
  };

  return {
    data,
    sorting,
    offset,
    orderedColumns,
    currentFirstItemIndex,
    currentLastItemIndex,
    resetData,
    onSort,
    handleChangePage,
    handleChangeRows,
  };
};

export default useCustomerTableState;
