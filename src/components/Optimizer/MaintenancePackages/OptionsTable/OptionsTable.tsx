import React from 'react';
import {
    IconButton,
    makeStyles,
    Table as BaseTable,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@material-ui/core";
import {IPackageOptionDetailed} from "../../../../api/types";
import {CheckBoxOutlineBlank, CheckBoxOutlined} from "@material-ui/icons";
import {TCellData, TRequestRow} from "../PackageAccordion/PackageAccordion";

type TProps = {
    withHeader?: boolean;
    data: TRequestRow[];
    options: IPackageOptionDetailed[];
    onCheckboxClick: (item: TCellData, requestId: number) => void;
    isEdit: boolean;
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
        padding: 5.8,
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
// TODO change it to dynamic option names from back end
const MaintenanceOptions = {
    0: 'Base',
    1: 'Value',
    2: 'Preferred'
}

export const OptionsTable: React.FC<TProps> = ({ data, withHeader, options, onCheckboxClick, isEdit }) => {
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

    return <TableContainer className={classes.container}>
        <BaseTable>
            {withHeader && <TableHead className={classes.tableHeader}>
              <TableRow>
                  {options.map((option: IPackageOptionDetailed) => (
                      <TableCell align='center' className={classes.headerCell} key={option.type}>
                          {MaintenanceOptions[option.type]}
                      </TableCell>
                  ))}
              </TableRow>
            </TableHead>}

            {withHeader && <div style={{width: '100%', height: 19}}/>}

            <TableBody className={classes.tableBody}>
                {data.map((request, index) => (
                    <TableRow className={getClassNameByIndex(index)} key={request.requestId}>
                        {request.cellData.map((item: TCellData) => {
                            return <TableCell className={classes.tableCell} align='center' key={item.optionType}>
                                <IconButton onClick={() => onCheckboxClick(item, request.requestId)} disabled={!isEdit}>
                                    {item.isSelected
                                    ? <CheckBoxOutlined htmlColor={isEdit ? "#3855FE" : "rgba(0, 0, 0, 0.54)"}/>
                                    : <CheckBoxOutlineBlank htmlColor="#DADADA"/>
                                    }
                                </IconButton>
                            </TableCell>
                        })}
                    </TableRow>
                ))}
            </TableBody>
        </BaseTable>
    </TableContainer>
};