import React from "react";
import {TableContainer, Table as BaseTable, TableBody, TableHead, TableRow, TableCell} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {ITableProps} from "./types";


const useStyles = makeStyles({
    root: {

    }
});


export function Table<U> (props: ITableProps<U>): JSX.Element {
    const classes = useStyles();

    return <TableContainer className={classes.root}>
        <BaseTable>
            <TableHead>
                <TableRow>
                    {props.rowData.map((rE, idx) => (
                        <TableCell key={`t_${idx}`}>
                            {rE.header}
                        </TableCell>
                    ))}
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
                        </TableRow>
                    );
                })}
            </TableBody>
        </BaseTable>
    </TableContainer>
}