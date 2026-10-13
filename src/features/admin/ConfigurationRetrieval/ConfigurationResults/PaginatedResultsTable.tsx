import React, { useEffect, useMemo, useState } from 'react';
import { Table } from '../../../../components/tables/Table/Table';
import { defaultRowsPerPage } from '../../../../config/config';
import { TableRowDataTypeResp } from '../../../../types/types';
import { useStyles } from '../styles';

type TPaginatedResultsTableProps<T> = {
  data: T[];
  rowData: TableRowDataTypeResp<T>[];
  index: keyof T;
  noDataTitle: string;
};

export function PaginatedResultsTable<T>({
  data,
  rowData,
  index,
  noDataTitle,
}: TPaginatedResultsTableProps<T>): JSX.Element {
  const [page, setPage] = useState(0);
  const { classes } = useStyles();
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);

  useEffect(() => {
    setPage(0);
  }, [data]);

  const pageData = useMemo(
    () => data.slice(page * rowsPerPage, (page + 1) * rowsPerPage),
    [data, page, rowsPerPage]
  );

  const handleChangeRowsPerPage = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(+e.target.value);
    setPage(0);
  };

  return (
    <div className={classes.resultsTable}>
      <Table<T>
        compact
        borderHeader
        withBorders
        data={pageData}
        rowData={rowData}
        index={index}
        count={data.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onChangePage={(_, newPage) => setPage(newPage)}
        onChangeRowsPerPage={handleChangeRowsPerPage}
        noDataTitle={noDataTitle}
      />
    </div>
  );
}
