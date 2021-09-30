import React, {useEffect, useState} from 'react';
import {
    makeStyles,
    Table as BaseTable,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@material-ui/core";
import {TServiceRequestShort} from "../ServiceRequests/ServiceRequests";
import {IPackageOptionDetailed} from "../../../../api/types";
import { Checkbox } from '@material-ui/core';

type TProps = {
    withHeader?: boolean;
    options: IPackageOptionDetailed[];
    requests: TServiceRequestShort[];
}

type TCellData = {
    isSelected: boolean;
    optionType: number;
}

type TRequestRow = {
    id: number;
    cellData: TCellData[];
}

const borderRule = '1px solid #E0E2E8';

const defaultBorder = {
    borderLeft: borderRule,
    borderRight: borderRule,
}

const useStyles = makeStyles(theme => ({
    container: {
        overflowX: 'unset',
    },
    tableCell: {
        padding: 5.5,
        border: 'none',
        width: 100,
    },
    tableBody: {
        padding: 2,
    },
    headerCell: {
        background: 'black',
        color: 'white',
        fontWeight: 'bold',
        padding: 8,
        width: 100,
    },
    tableHeader: {
        marginBottom: 10,
    },
    firstRow: {
        borderTop: borderRule,
       ...defaultBorder,
    },
    lastRow: {
        borderBottom: borderRule,
        ...defaultBorder,
    },
    row: {
        ...defaultBorder,
    },
    checkbox: {
        color: '#DADADA',
        background: 'white',
        '&.Mui-checked': {
            color: '#3855FE',
        },
    }
}))

const MaintenanceOptions = {
    0: 'Base',
    1: 'Value',
    2: 'Preferred'
}

export const OptionsTable: React.FC<TProps> = ({ options, requests, withHeader }) => {
    const [data, setData] = useState<TRequestRow[]>([]);
    const classes = useStyles();

    const getClassNameByIndex = (index: number) => {
        switch (index) {
            case 0:
                return classes.firstRow;
            case data.length - 1:
                return classes.lastRow;
            default:
                return classes.row;
        }
    }

    useEffect(() => {
        const rows = requests.map((request) => ({
                id: request.id,
                cellData: options.map((option: IPackageOptionDetailed)  => ({ optionType: option.type, isSelected: option.serviceRequests.includes(request.id)}))
            }))
        setData(rows);
    }, [options, requests])

    return <TableContainer className={classes.container}>
        <BaseTable>
            {withHeader && <TableHead className={classes.tableHeader}>
              <TableRow>
                  {options.map((option: IPackageOptionDetailed) => (
                      <TableCell align='center' className={classes.headerCell}>
                          {MaintenanceOptions[option.type]}
                      </TableCell>
                  ))}
              </TableRow>
            </TableHead>}
            <div style={{ width: '100%', height: 19}}/>
            <TableBody className={classes.tableBody}>
                {data.map((request, index) => (
                    <TableRow className={getClassNameByIndex(index)}>
                        {request.cellData.map((item: TCellData) => {
                            return <TableCell className={classes.tableCell} align='center'>
                                <Checkbox checked={item.isSelected} className={classes.checkbox} />
                            </TableCell>
                        })}
                    </TableRow>
                ))}
            </TableBody>
        </BaseTable>
    </TableContainer>
};