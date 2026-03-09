import React, { useEffect, useMemo } from 'react';
import {
  Table as BaseTable,
  TableBody,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Loading } from '../../wrappers/Loading/Loading';
import { StyledTableCell, StyledTableHead, TStyleProps, useStyles } from './styles';
import { ITableProps } from '../../../types/types';
import { usersRowsPerPage, usersRowsPerPageOptions } from '../../../config/config';

export function UsersTable<U>({
  changeRowsPerPageCb,
  changePageCb,
  ...props
}: ITableProps<U>): JSX.Element {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(usersRowsPerPage);

  const { classes } = useStyles();
  const theme = useTheme();
  const isXS = useMediaQuery(theme.breakpoints.down('sm'));

  const nPage = useMemo(() => {
    return props.page !== undefined ? props.page : page;
  }, [page, props.page]);
  const nRowsPerPage = useMemo(() => {
    return props.rowsPerPage || rowsPerPage;
  }, [rowsPerPage, props.rowsPerPage]);
  const count = useMemo(() => {
    return props.count || props.data.length;
  }, [props.data, props.count]);

  const styleProps: TStyleProps = useMemo(
    () => ({
      compact: Boolean(props.compact),
      smallHeaderFont: Boolean(props.smallHeaderFont),
      superCompact: Boolean(props.superCompact),
      borderHeader: Boolean(props.borderHeader),
      withBorders: Boolean(props.withBorders),
      compactBodyPadding: Boolean(props.compactBodyPadding),
      verticalAlign: props.verticalAlign,
      verticalPadding: props.verticalPadding,
    }),
    [props]
  );

  const handleChangePage = (e: React.MouseEvent | null, newPage: number) => {
    if (props.onChangePage) {
      props.onChangePage(e, newPage);
    } else {
      setPage(newPage);
    }
  };

  const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (props.onChangeRowsPerPage) {
      props.onChangeRowsPerPage(e);
    } else {
      setRowsPerPage(+e.target.value);
    }
    handleChangePage(null, 0);
  };

  useEffect(() => {
    if (changePageCb) {
      changePageCb(page, rowsPerPage);
    } else if (changeRowsPerPageCb) {
      changeRowsPerPageCb(rowsPerPage);
    }
  }, [changePageCb, changeRowsPerPageCb, page, rowsPerPage]);

  if (props.isLoading) return <Loading />;
  if (!props.data.length)
    return (
      <>
        <p style={{ margin: 0, fontSize: '16px', textAlign: 'center' }}>No users were found.</p>
        <p style={{ margin: 0, fontSize: '16px', textAlign: 'center' }}>
          Please try changing the filters or search criteria
        </p>
      </>
    );

  return (
    <>
      <TableContainer
        className={classes.root}
        style={props.withoutOverflow ? { overflowX: 'unset' } : {}}
      >
        <BaseTable>
          {!props.hideHeader && (
            <TableHead>
              <TableRow>
                {props.startActions ? <StyledTableHead {...styleProps} /> : null}
                {props.rowData.map((rE, idx) =>
                  rE.hide ? null : isXS && rE.xsHidden ? null : (
                    <StyledTableHead
                      {...styleProps}
                      key={`t_${idx}`}
                      width={rE.width}
                      align={rE.align || 'left'}
                    >
                      {rE.orderId ? (
                        <TableSortLabel
                          onClick={
                            props.onSort
                              ? props.onSort({
                                  isAscending:
                                    rE.orderId !== props.order ||
                                    !props.order ||
                                    (rE.orderId === props.order && !props.isAscending),
                                  orderBy: rE.orderId,
                                })
                              : undefined
                          }
                          direction={props.isAscending ? 'desc' : 'asc'}
                          active={rE.orderId === props.order}
                        >
                          {rE.header}
                        </TableSortLabel>
                      ) : (
                        rE.header
                      )}
                    </StyledTableHead>
                  )
                )}
                {props.actions && !props.viewMode ? <StyledTableHead {...styleProps} /> : null}
              </TableRow>
            </TableHead>
          )}
          <TableBody>
            {props.data.map((row, idx) => {
              let rIdx = props.index ? row[props.index] : idx;
              if (props.getKey) rIdx = +props.getKey(row);
              return (
                <TableRow key={`${rIdx}`} className={classes.tableRow}>
                  {props.startActions ? (
                    <StyledTableCell {...styleProps}>{props.startActions(row)}</StyledTableCell>
                  ) : null}
                  {props.rowData.map((cellData, cIdx) =>
                    cellData.hide ? null : isXS && cellData.xsHidden ? null : (
                      <StyledTableCell
                        {...styleProps}
                        width={cellData.width}
                        style={{ width: cellData.width }}
                        verticalAlign={cellData.verticalAlign || 'middle'}
                        align={cellData.align || 'left'}
                        key={`${rIdx}_${cIdx}`}
                      >
                        {cellData.val(row, idx) || '-'}
                      </StyledTableCell>
                    )
                  )}
                  {props.actions && !props.viewMode ? (
                    <StyledTableCell align={props.actionsAlign ?? 'right'} {...styleProps}>
                      {props.actions(row)}
                    </StyledTableCell>
                  ) : null}
                </TableRow>
              );
            })}
          </TableBody>
        </BaseTable>
      </TableContainer>
      {!props.hidePagination ? (
        <TablePagination
          className={classes.pagination}
          classes={{ select: classes.select }}
          component="div"
          count={count}
          page={nPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPage={nRowsPerPage}
          rowsPerPageOptions={usersRowsPerPageOptions}
        />
      ) : null}
    </>
  );
}
