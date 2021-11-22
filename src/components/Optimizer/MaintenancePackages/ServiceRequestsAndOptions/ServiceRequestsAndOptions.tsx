import React, {useCallback} from 'react';
import {IPackageById, IPackageOptionDetailed} from "../../../../api/types";
import {IconButton, TableBody, TableCell, TableContainer, TableHead, TableRow, Table, Input} from "@material-ui/core";
import {CheckBoxOutlineBlank, CheckBoxOutlined} from "@material-ui/icons";
import {useTableStyles} from "../../../Modals/SaveRequestToDMS/SaveRequestToDMS";
import {useOptionsTableStyles} from "../OptionsTable/OptionsTable";
import {useException} from "../../../../utils/hooks";
import {TCellData, TRequestRow} from "../PackageAccordion/PackageAccordion";

type TServiceRequestsProps = {
    packageData: IPackageById | null;
    onCheckboxClick: (item: TCellData, requestId: number) => void;
    onOptionNameChange: (option: IPackageOptionDetailed, name: string) => void;
    editingOption: IPackageOptionDetailed | null;
    setEditingOption: React.Dispatch<React.SetStateAction<IPackageOptionDetailed | null>>;
    data: TRequestRow[];
}

export const ServiceRequestsWithOptions: React.FC<TServiceRequestsProps> = (props) => {
    const classes = useTableStyles();
    const optionsClasses = useOptionsTableStyles();
    const showError = useException();

    const getCellClass = useCallback((cellIndex: number, rowIndex: number) => {
        if (props.packageData){
            if (cellIndex === 0) {
                switch (rowIndex) {
                    case 0:
                        return classes.firstCellFirstRow;
                    case props.packageData?.serviceRequests?.length - 1:
                        return classes.firstCellLastRow;
                    default:
                        return classes.firstCell;
                }
            }
            if (cellIndex === 2) {
                switch (rowIndex) {
                    case 0:
                        return classes.lastCellFirstRow;
                    case props.packageData?.serviceRequests?.length - 1:
                        return classes.lastCellLastRow;
                    default:
                        return classes.lastCell;
                }
            }
            switch (rowIndex) {
                case 0:
                    return classes.cellFirstRow;
                case props.packageData?.serviceRequests?.length - 1:
                    return classes.cellLastRow;
                default:
                    return classes.cell
            }
        }
    }, [props.packageData])

    const onOptionNameClick = (option: IPackageOptionDetailed): void => {
        props.setEditingOption(option);
    }

    const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (props.editingOption && props.onOptionNameChange) {
            if (e.target.value && !e.target.value.match(/^[A-Za-z0-9 \s\-_]*[A-Za-z0-9][A-Za-z0-9 \s\-_]*$/)) {
                showError('Please use only letters, digits, and whitespaces')
            } else {
                props.onOptionNameChange(props.editingOption, e.target?.value);
            }
        }
    }

    return <TableContainer style={{ overflowX: 'unset' }}>
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell className={classes.headerCell} key="1">
                        Included in Package
                    </TableCell>
                    <TableCell className={classes.headerCell} align="center" width={110} key="2">
                        Labor Hours
                    </TableCell>
                    <TableCell className={classes.headerCell} align="center" width={110} key="3">
                        Labor Amount
                    </TableCell>
                    <TableCell className={classes.headerCell} align="center" width={110} key="4">
                        Parts Amount
                    </TableCell>
                    <TableCell className={classes.headerCell} align="center" width={110} key="5">
                        Total
                    </TableCell>
                    <TableCell className={classes.emptyCell} width={16} key="6"/>

                    {props.packageData?.options.map((option: IPackageOptionDetailed) => (
                        <TableCell align='center' className={optionsClasses.headerCell} key={option.type}>
                            {props.editingOption && props.editingOption.type === option.type ?
                                <Input
                                    value={option.name}
                                    onChange={onNameChange}
                                    className={optionsClasses.optionName}/>
                                : <div className={optionsClasses.optionName}
                                       onClick={() => onOptionNameClick(option)}>
                                    {option.name}
                                </div>
                            }
                        </TableCell>
                    ))}
                </TableRow>
            </TableHead>
            <TableBody>
                <TableRow className={classes.emptyRow} key="empty"/>
                {props.packageData?.serviceRequests.map((request, rowIndex) => {
                    return <TableRow className={rowIndex % 2 === 0 ?  classes.row : classes.rowGrey} key={request.code}>
                        <TableCell className={classes.requestCell} key="1">{request.description}</TableCell>
                        <TableCell className={classes.requestCell} key="2" align="center" width={100}>{request.durationInHours}</TableCell>
                        <TableCell className={classes.requestCell} key="3" align="center" width={100}>${request.laborAmount}</TableCell>
                        <TableCell className={classes.requestCell} key="4" align="center" width={100}>${request.partsAmount}</TableCell>
                        <TableCell className={classes.requestCell} key="5" align="center" width={100}>${request.laborAmount + request.partsAmount}</TableCell>
                        <TableCell className={classes.emptyCell} width={16} key="6"/>

                        {props.data.find(item => item.requestId === request.id)?.cellData
                            .sort((a, b) => a.optionType - b.optionType)
                            .map((item: TCellData, cellIndex) => {
                                return <TableCell className={getCellClass(cellIndex, rowIndex)} align='center' key={item.optionType}>
                                    <IconButton onClick={() => props.onCheckboxClick(item, request.id)}>
                                        {item.isSelected
                                            ? <CheckBoxOutlined htmlColor="#3855FE"/>
                                            : <CheckBoxOutlineBlank htmlColor="#DADADA"/>
                                        }
                                    </IconButton>
                                </TableCell>
                            })}
                    </TableRow>
                })}
            </TableBody>
        </Table>
    </TableContainer>
}