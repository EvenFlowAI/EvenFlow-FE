import React, {useEffect, useState, Dispatch, SetStateAction, useCallback} from 'react';
import {BaseModal, DialogContent, DialogTitle} from "../BaseModal";
import {DialogProps} from "../types";
import {IPackageById, IPackageOptionDetailed, TExtendedService} from "../../../api/types";
import {TableContainer, TableRow, Table, TableHead, TableCell, TableBody, IconButton, Button} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {CheckBoxOutlineBlank, CheckBoxOutlined, Close} from "@material-ui/icons";

type TSaveRequestModalProps = DialogProps & {
    packageData: IPackageById | null;
    setPackageData: Dispatch<SetStateAction<IPackageById | null>>;
    onSave: (packageData: IPackageById) => void;
};

const baseCellStyles = {
    backgroundColor: 'white',
    border: "none",
}

const border = '1px solid #E0E2E8';

export const useTableStyles = makeStyles(() => ({
    wrapper: {
        marginBottom: 20,
        padding: 10,
        background: 'white',
        boxShadow: '0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)'
    },
    headerCell: {
        ...baseCellStyles,
        color: "#9DA8B5",
        fontWeight: 'bold',
        justifyContent: 'left',
    },
    headerCellBlack: {
        width: 110,
        color: 'white',
        fontWeight: 'bold',
        backgroundColor: 'black',
        border: '1px solid black',
    },
    rowGrey: {
        background: '#F2F3F7',
    },
    row: {
        background: 'white',
    },
    emptyRow: {
        background: 'white',
        height: 16,
    },
    emptyCell: {
        ...baseCellStyles,
        padding: 0,
    },
    firstCellFirstRow: {
        ...baseCellStyles,
        borderTop: border,
        borderLeft: border,
    },
    firstCellLastRow: {
        ...baseCellStyles,
        borderBottom: border,
        borderLeft: border,
    },
    firstCell: {
        ...baseCellStyles,
        borderLeft: border,
    },
    lastCellFirstRow: {
        ...baseCellStyles,
        borderTop: border,
        borderRight: border,
    },
    lastCellLastRow: {
        ...baseCellStyles,
        borderRight: border,
        borderBottom: border,
    },
    lastCell: {
        ...baseCellStyles,
        borderRight: border,
    },
    cellFirstRow: {
        ...baseCellStyles,
        borderTop: border,
    },
    cellLastRow: {
        ...baseCellStyles,
        borderBottom: border,
    },
    cell: {
        ...baseCellStyles,
    },
    requestCell: {
        border:"none",
        background: "transparent",
    },
    saveButton: {
        background: '#7898FF',
        color: 'white',
        border: '1px solid #7898FF',
        outline: 'none',
        '&:hover': {
            color: '#7898FF'
        }
    },
    buttonsWrapper: {
        display: 'flex',
        justifyContent: "flex-end",
        alignItems: 'center',
    },
    cancelButton: {
        color: '#9FA2B4',
        marginRight: 20,
        border: 'none',
        outline: 'none',
    },
}));

const SaveRequestToDms: React.FC<TSaveRequestModalProps> = ({ packageData, setPackageData, onSave, ...props}) => {
    const [newRequests, setNewRequests] = useState<TExtendedService[]>([]);
    const [temporaryData, setTemporaryData] = useState<IPackageById | null>(null);
    const classes = useTableStyles();

    useEffect(() => {
        setTemporaryData(packageData)
    }, [packageData])

    useEffect(() => {
        setNewRequests(prev => {
            if (temporaryData) {
                return temporaryData.serviceRequests;
            }
            return prev;
        })
    }, [temporaryData])

    const getCellClass = useCallback((cellIndex: number, rowIndex: number) => {
        if (cellIndex === 0) {
            switch (rowIndex) {
                case 0:
                    return classes.firstCellFirstRow;
                case newRequests.length - 1:
                    return classes.firstCellLastRow;
                default:
                    return classes.firstCell;
            }
        }
        if (cellIndex === 2) {
            switch (rowIndex) {
                case 0:
                    return classes.lastCellFirstRow;
                case newRequests.length - 1:
                    return classes.lastCellLastRow;
                default:
                    return classes.lastCell;
            }
        }
        switch (rowIndex) {
            case 0:
                return classes.cellFirstRow;
            case newRequests.length - 1:
                return classes.cellLastRow;
            default:
                return classes.cell
        }
    }, [newRequests, classes])

    const onCheckboxClick = useCallback((option: IPackageOptionDetailed, requestId: number): void => {
        setTemporaryData(prev => {
            if (prev) {
                const optionToUpdate = prev.options.find(item => item.type === option.type);
                if (optionToUpdate) {
                    const request = optionToUpdate.serviceRequests.find(item => item.serviceRequestId === requestId)
                    if (request) {
                        const updatedRequest = {...request, isSendToDMS: !request.isSendToDMS};
                        const updatedOption = {
                            ...optionToUpdate,
                            serviceRequests: optionToUpdate.serviceRequests
                                .filter(item => item.serviceRequestId !== requestId)
                                .concat(updatedRequest)
                        };
                        const newOptions = prev.options
                            .filter(item => item.type !== updatedOption.type)
                            .concat(updatedOption)
                            .sort((a, b) => a.type - b.type);
                        return {...prev, options: newOptions};
                    } else {
                        return prev;
                    }
                } else {
                    return prev;
                }
            }
            return prev;
        })
    }, [])

    const onCancel = (): void => {
        props.onClose();
    }

    const onSaveRequest = async () => {
        if (temporaryData) {
            await setPackageData(temporaryData);
            await onSave(temporaryData);
        }
    }

    return (
        <BaseModal {...props} style={{ minWidth: 1000 }}>
            <DialogTitle onClose={props.onClose}>Choose Service Requests to send to DMS</DialogTitle>
            <DialogContent>
                <div className={classes.wrapper}>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell className={classes.headerCell} key="first">
                                        Service Request
                                    </TableCell>
                                    {temporaryData?.options
                                        .slice()
                                        .sort((a, b) => a.type - b.type)
                                        .map(option => (
                                        <TableCell className={classes.headerCellBlack} align="center" key={option.name}>
                                            {option.name}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow className={classes.emptyRow} key="empty"/>
                                {newRequests
                                    .slice()
                                    .sort((a, b) => a.orderIndex - b.orderIndex)
                                    .map((request, rowIndex) => {
                                    return <TableRow className={rowIndex % 2 === 0 ?  classes.row : classes.rowGrey} key={request.code}>
                                        <TableCell className={classes.requestCell} key={request.description}>{request.description}</TableCell>
                                        {temporaryData?.options
                                            .slice()
                                            .sort((a, b) => a.type - b.type)
                                            .map((option, cellIndex) => {
                                            const requestInOption = option.serviceRequests.find(req => req.serviceRequestId === request.id);

                                            return <TableCell
                                                className={getCellClass(cellIndex, rowIndex)}
                                                key={option.type}
                                                align="center">
                                                <IconButton onClick={() => onCheckboxClick(option, request.id)}>
                                                    {requestInOption ?
                                                        requestInOption?.isSendToDMS
                                                            ? <CheckBoxOutlined htmlColor="#3855FE"/>
                                                            : <CheckBoxOutlineBlank htmlColor="#DADADA"/>
                                                        : <Close htmlColor="#DADADA"/>
                                                    }
                                                </IconButton>
                                            </TableCell>
                                        })}
                                    </TableRow>
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
                <div className={classes.buttonsWrapper}>
                    <Button
                        onClick={onCancel}
                        className={classes.cancelButton}>
                        Cancel
                    </Button>
                    <Button
                        onClick={onSaveRequest}
                        className={classes.saveButton}>
                        save
                    </Button>
                </div>
            </DialogContent>
        </BaseModal>
    );
};

export default SaveRequestToDms;