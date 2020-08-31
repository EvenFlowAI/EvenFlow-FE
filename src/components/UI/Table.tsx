import React, {useEffect, useMemo} from "react";
import {
    TableContainer,
    Table as BaseTable,
    TableBody,
    TableHead,
    TableRow,
    TableCell,
    TablePagination
} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {ITableProps} from "./types";
import {defaultRowsPerPage, defaultRowsPerPageOptions} from "../../config/config";
import { NoData } from "./NoData";
import { Loading } from "./Loading";

const cellPadding = 16;
const compactPadding = "5px 15px"
const useStyles = makeStyles(theme => ({
    root: {
        maxWidth: theme.breakpoints.values.lg
    },
    tableCell: (compact: boolean) => ({
        fontSize: compact ? 14 : 16,
        border: "none",
        // borderBottomColor: "#000000",
        padding: compact ? compactPadding : cellPadding
    }),
    tableHead: (compact: boolean) => ({
        fontSize: compact ? 14 : 16,
        border: "none",
        // borderBottomColor: "#9DA8B5",
        padding: compact ? compactPadding : cellPadding,
        fontWeight: "bold",
        color: "#9DA8B5"
    }),
    pagination: {
        flexShrink: 0,
        width: "100%",
    },
    tableRow: {
        "&:nth-of-type(odd)": {
            background: "#FFFFFF"
        },
        "&:nth-of-type(even)": {
            background: "#F2F3F7"
        }
    },
    select: {
        background: "transparent",
        border: "none"
    }
}));


export function Table<U>({changeRowsPerPageCb, changePageCb, ...props}: ITableProps<U>): JSX.Element {
    const classes = useStyles(!!props.compact);

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
        console.log('call');
    }, [changePageCb, changeRowsPerPageCb, page, rowsPerPage]);

    if (props.isLoading) return <Loading />;
    if (!props.data.length) return <NoData title={props.noDataTitle} />;

    return <>
        <TableContainer className={classes.root}>
            <BaseTable>
                <TableHead>
                    <TableRow>
                        {props.startActions ? <TableCell className={classes.tableHead} /> : null}
                        {props.rowData.map((rE, idx) => (
                            <TableCell key={`t_${idx}`} align={rE.align || "left"} className={classes.tableHead}>
                                {rE.header}
                            </TableCell>
                        ))}
                        {props.actions ? <TableCell className={classes.tableHead} /> : null}
                    </TableRow>
                </TableHead>
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
                                    <TableCell
                                        align={cellData.align || "left"}
                                        className={classes.tableCell}
                                        key={`${rIdx}_${cIdx}`}>
                                        {cellData.val(row) || '-'}
                                    </TableCell>
                                ))}
                                {props.actions
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