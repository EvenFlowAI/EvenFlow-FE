import React, {useCallback} from 'react';
import {IPackageById} from "../../../../api/types";
import {IconButton, TableBody, TableCell, TableContainer, TableRow, Table} from "@material-ui/core";
import {CheckBoxOutlineBlank, CheckBoxOutlined} from "@material-ui/icons";
import {useTableStyles} from "../../../Modals/SaveRequestToDMS/SaveRequestToDMS";
import {TCellData, TRequestRow} from "../PackageAccordion/PackageAccordion";

type TServiceRequestsProps = {
    packageData: IPackageById | null;
    data: TRequestRow[];
    onCheckboxClick: (item: TCellData, requestId: number) => void;
}

export const ComplimentaryAndOptions: React.FC<TServiceRequestsProps> = (props) => {
    const classes = useTableStyles();

    const getCellClass = useCallback((cellIndex: number, rowIndex: number) => {
        if (props.packageData){
            if (cellIndex === 0) {
                if (props.packageData?.complimentaryServices?.length === 1) {
                    return classes.firstCellLastRow;
                }
                switch (rowIndex) {
                    case 0:
                        return classes.firstCellFirstRow;
                    case props.packageData?.complimentaryServices?.length - 1:
                        return classes.firstCellLastRow;
                    default:
                        return classes.firstCell;
                }
            } else if (cellIndex === 2) {
                if (props.packageData?.complimentaryServices?.length === 1) {
                    return classes.lastCellLastRow;
                }
                switch (rowIndex) {
                    case 0:
                        return classes.lastCellFirstRow;
                    case props.packageData?.complimentaryServices?.length - 1:
                        return classes.lastCellLastRow;
                    default:
                        return classes.lastCell;
                }
            } else {
                if (props.packageData?.complimentaryServices?.length === 1) {
                    return classes.cellLastRow;
                }
                switch (rowIndex) {
                    case 0:
                        return classes.cellFirstRow;
                    case props.packageData?.complimentaryServices?.length - 1:
                        return classes.cellLastRow;
                    default:
                        return classes.cell
                }
            }
        }
    }, [props.packageData])

    return <TableContainer style={{ overflowX: 'unset' }}>
        <Table>
            <TableBody>
                {props.packageData?.complimentaryServices
                    .slice()
                    .sort((a, b) => a.orderIndex - b.orderIndex)
                    .map((request, rowIndex) => {
                    return <TableRow className={rowIndex % 2 === 0 ?  classes.row : classes.rowGrey} key={request.name}>
                        <TableCell className={classes.requestCell} key={`${request.name}_nameCell`}>
                            {request.name}
                        </TableCell>
                        <TableCell className={classes.requestCell} key={`${request.name}_durationInHours`} width={100}>
                            {request.durationInHours}
                        </TableCell>
                        <TableCell className={classes.requestCell} key={`${request.name}_total`} width={100}>
                            ${request.price}
                        </TableCell>
                        <TableCell className={classes.requestCell} key={`${request.name}_partsAmount`} width={100}>
                            ${request.partsAmount}
                        </TableCell>
                        <TableCell className={classes.requestCell} key={`${request.name}_price`} width={100}>
                            ${request.price}
                        </TableCell>
                        <TableCell className={classes.emptyCell} width={16} key="empty"/>

                        {props.data.find(item => item.requestId === request.id)?.cellData
                            .sort((a, b) => a.optionType - b.optionType)
                            .map((item: TCellData, cellIndex) => {
                                return <TableCell className={getCellClass(cellIndex, rowIndex)} align='center' key={item.optionType} width={120}>
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