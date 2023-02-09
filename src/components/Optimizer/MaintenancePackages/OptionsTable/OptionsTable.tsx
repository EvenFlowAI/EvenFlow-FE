import React from 'react';
import {
    IconButton, Input,
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
import {useException} from "../../../../utils/hooks";

type TProps = {
    withHeader?: boolean;
    data: TRequestRow[];
    options: IPackageOptionDetailed[];
    onCheckboxClick: (item: TCellData, requestId: number) => void;
    onOptionNameChange?: (option: IPackageOptionDetailed, name: string) => void;
    editingOption?: IPackageOptionDetailed | null;
    setEditingOption?: React.Dispatch<React.SetStateAction<IPackageOptionDetailed | null>>;
}

const borderRule = '1px solid #E0E2E8';

const defaultBorder = {
    borderLeft: borderRule,
    borderRight: borderRule,
}

export const useOptionsTableStyles = makeStyles(() => ({
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
    },
    optionName: {
        width: 100,
        background: "black",
        color: 'white',
        fontWeight: 'bold',
        fontSize: 12,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        minHeight: 14,

        '& > input': {
            padding: 3,
            fontSize: 12,
        }
    }
}))

export const MaintenanceOptions = {
    0: 'Base',
    1: 'Value',
    2: 'Preferred'
}

export const OptionsTable: React.FC<TProps> = ({ editingOption, setEditingOption, onOptionNameChange, data, withHeader, options, onCheckboxClick }) => {
    const classes = useOptionsTableStyles();
    const showError = useException();

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

    const onOptionNameClick = (option: IPackageOptionDetailed): void => {
        setEditingOption && setEditingOption(option);
    }

    const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (editingOption && onOptionNameChange) {
            if (e.target.value && !e.target.value.match(/^[A-Za-z0-9 \s\-_]*[A-Za-z0-9][A-Za-z0-9 \s\-_]*$/)) {
                showError('Please use only letters, digits, and whitespaces')
            } else {
                onOptionNameChange(editingOption, e.target?.value);
            }
        }
    }

    return <TableContainer className={classes.container}>
        <BaseTable>
            {withHeader && <TableHead className={classes.tableHeader}>
              <TableRow>
                  {options.map((option: IPackageOptionDetailed) => (
                      <TableCell align='center' className={classes.headerCell} key={option.type}>
                          {editingOption && editingOption.type === option.type ?
                          <Input
                              value={option.name}
                              onChange={onNameChange}
                              className={classes.optionName}/>
                              : <div className={classes.optionName}
                                  onClick={() => onOptionNameClick(option)}>
                                  {option.name}
                          </div>
                          }
                      </TableCell>
                  ))}
              </TableRow>
            </TableHead>}

            {withHeader && <div style={{width: '100%', height: 19}}/>}

            <TableBody className={classes.tableBody}>
                {data.map((request, index) => (
                    <TableRow className={getClassNameByIndex(index)} key={request.requestId}>
                        {request.cellData.sort((a, b) => a.optionType - b.optionType)
                            .map((item: TCellData) => {
                            return <TableCell className={classes.tableCell} align='center' key={item.optionType}>
                                <IconButton onClick={() => onCheckboxClick(item, request.requestId)}>
                                    {item.isSelected
                                    ? <CheckBoxOutlined htmlColor="#3855FE"/>
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