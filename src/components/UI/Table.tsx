import React from "react";
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


const useStyles = makeStyles({
    root: {},
    pagination: {
        flexShrink: 0,
        width: "100%",
    },
    select: {
        background: "transparent",
        border: "none"
    }
});


export function Table<U>(props: ITableProps<U>): JSX.Element {
    const classes = useStyles();

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(defaultRowsPerPage);

    const handleChangePage = (e: React.MouseEvent | null, newPage: number) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+e.target.value);
        setPage(0);
    }

    return <>
        <TableContainer className={classes.root}>
            <BaseTable>
                <TableHead>
                    <TableRow>
                        {props.rowData.map((rE, idx) => (
                            <TableCell key={`t_${idx}`}>
                                {rE.header}
                            </TableCell>
                        ))}
                        {props.actions ? <TableCell /> : null}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.data.map((row, idx) => {
                        const rIdx = props.index ? row[props.index] : idx;
                        return (
                            <TableRow key={`${rIdx}`}>
                                {props.rowData.map((cellData, cIdx) => (
                                    <TableCell key={`${rIdx}_${cIdx}`}>{cellData.val(row)}</TableCell>
                                ))}
                                {props.actions ? <TableCell align="right">{props.actions(row)}</TableCell> : null}
                            </TableRow>
                        );
                    })}
                </TableBody>
            </BaseTable>
        </TableContainer>
        <TablePagination
            className={classes.pagination}
            classes={{select: classes.select}}
            component="div"
            count={props.data.length}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={defaultRowsPerPageOptions}
        />
    </>
}