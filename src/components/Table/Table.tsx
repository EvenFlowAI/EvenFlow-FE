import React, {useEffect, useMemo} from "react";
import {
    Table as BaseTable,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel,
    useMediaQuery,
    useTheme
} from "@material-ui/core";
import {ITableProps} from "../UI/types";
import {defaultRowsPerPage, defaultRowsPerPageOptions} from "../../config/config";
import {NoData} from "../UI/NoData";
import {Loading} from "../UI/Loading";
import {useStyles} from "./styles";

export function Table<U>({changeRowsPerPageCb, changePageCb, ...props}: ITableProps<U>): JSX.Element {
    const classes = useStyles({
        compact: Boolean(props.compact),
        smallHeaderFont: Boolean(props.smallHeaderFont),
        superCompact: Boolean(props.superCompact),
        borderHeader: Boolean(props.borderHeader),
    });

    const theme = useTheme();
    const isXS = useMediaQuery(theme.breakpoints.down("xs"));

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(defaultRowsPerPage);

    const nPage = useMemo(() => {
        return props.page !== undefined ? props.page : page;
    }, [page, props.page]);
    const nRowsPerPage = useMemo(() => {
        return props.rowsPerPage || rowsPerPage;
    }, [rowsPerPage, props.rowsPerPage]);
    const count = useMemo(() => {
        return props.count || props.data.length
    }, [props.data, props.count])

    const handleChangePage = (e: React.MouseEvent | null, newPage: number) => {
        props.onChangePage ? props.onChangePage(e, newPage) : setPage(newPage);
    };
    const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
        props.onChangeRowsPerPage
            ? props.onChangeRowsPerPage(e)
            : setRowsPerPage(+e.target.value);
        handleChangePage(null, 0);
    }

    useEffect(() => {
        if (changePageCb) {
            changePageCb(page, rowsPerPage);
        } else if (changeRowsPerPageCb) {
            changeRowsPerPageCb(rowsPerPage);
        }
    }, [changePageCb, changeRowsPerPageCb, page, rowsPerPage]);

    if (props.isLoading) return <Loading />;
    if (!props.data.length) return <NoData title={props.noDataTitle} />;

    return <>
        <TableContainer className={classes.root}>
            <BaseTable>
                {!props.hideHeader && <TableHead>
                    <TableRow>
                        {props.startActions ? <TableCell className={classes.tableHead} /> : null}
                        {props.rowData.map((rE, idx) => (
                            isXS && rE.xsHidden ? null : <TableCell
                                key={`t_${idx}`}
                                width={rE.width}
                                align={rE.align || "left"}
                                className={classes.tableHead}>
                                {rE.orderId
                                    ? <TableSortLabel
                                        onClick={props.onSort ? props.onSort({
                                            isAscending: rE.orderId !== props.order || !props.order || (rE.orderId === props.order && !props.isAscending),
                                            orderBy: rE.orderId
                                        }) : undefined}
                                        direction={props.isAscending ? "desc" : "asc"}
                                        active={rE.orderId === props.order}>
                                        {rE.header}
                                    </TableSortLabel>
                                    : rE.header}
                            </TableCell>
                        ))}
                        {(props.actions && !props.viewMode) ? <TableCell className={classes.tableHead} /> : null}
                    </TableRow>
                </TableHead>}
                <TableBody>
                    {props.data.map((row, idx) => {
                        const rIdx = props.index ? row[props.index] : idx;
                        return (
                            <TableRow key={`${rIdx}`} className={classes.tableRow}>
                                {props.startActions
                                    ? <TableCell className={classes.tableCell}>
                                        {props.startActions(row)}
                                    </TableCell>
                                :null}
                                {props.rowData.map((cellData, cIdx) => (
                                    isXS && cellData.xsHidden ? null :
                                    <TableCell
                                        width={cellData.width}
                                        style={{ width: cellData.width}}
                                        align={cellData.align || "left"}
                                        className={classes.tableCell}
                                        key={`${rIdx}_${cIdx}`}>
                                        {cellData.val(row, idx) || '-'}
                                    </TableCell>
                                ))}
                                {(props.actions && !props.viewMode)
                                    ?   <TableCell align="right" className={classes.tableCell}>
                                            {props.actions(row)}
                                        </TableCell>
                                    : null}
                            </TableRow>
                        );
                    })}
                </TableBody>
            </BaseTable>
        </TableContainer>
        {!props.hidePagination ? <TablePagination
            className={classes.pagination}
            classes={{select: classes.select}}
            component="div"
            count={count}
            page={nPage}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
            rowsPerPage={nRowsPerPage}
            rowsPerPageOptions={defaultRowsPerPageOptions}
        /> : null}
    </>
}