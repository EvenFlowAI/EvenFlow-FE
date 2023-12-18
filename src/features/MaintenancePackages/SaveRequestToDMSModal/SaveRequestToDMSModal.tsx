import React, {useEffect, useState, Dispatch, SetStateAction, useCallback} from 'react';
import {BaseModal, DialogContent, DialogTitle} from "../../../components/Modals/BaseModal";
import {DialogProps} from "../../../components/Modals/types";
import {IPackageById, IPackageOptionDetailed, TExtendedService, TIntervalUpsellForPackage} from "../../../api/types";
import {TableContainer, TableRow, Table, TableHead, TableCell, TableBody, IconButton, Button} from "@material-ui/core";
import {CheckBoxOutlineBlank, CheckBoxOutlined, Close} from "@material-ui/icons";
import {useTableStyles} from "./styles";

type TSaveRequestModalProps = DialogProps & {
    packageData: IPackageById | null;
    setPackageData: Dispatch<SetStateAction<IPackageById | null>>;
    onSave: (packageData: IPackageById) => void;
};

const SaveRequestToDMSModal: React.FC<TSaveRequestModalProps> = ({ packageData, setPackageData, onSave, ...props}) => {
    const [newRequests, setNewRequests] = useState<TExtendedService[]>([]);
    const [newUpsellRequests, setNewUpsellRequests] = useState<TIntervalUpsellForPackage[]>([]);
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
        setNewUpsellRequests(prev => {
            if (temporaryData?.intervalUpsells) {
                return temporaryData.intervalUpsells;
            }
            return prev;
        })
    }, [temporaryData])

    const getCellClass = useCallback((cellIndex: number, rowIndex: number) => {
        if (cellIndex === 0) {
            if (newRequests.length === 1) {
                return classes.firstCellLastRow;
            }
            switch (rowIndex) {
                case 0:
                    return classes.firstCellFirstRow;
                case newRequests.length - 1:
                    return classes.firstCellLastRow;
                default:
                    return classes.firstCell;
            }
        } else if (cellIndex === 2) {
            if (newRequests.length === 1) {
                return classes.lastCellLastRow;
            }
            switch (rowIndex) {
                case 0:
                    return classes.lastCellFirstRow;
                case newRequests.length - 1:
                    return classes.lastCellLastRow;
                default:
                    return classes.lastCell;
            }
        } else {
            if (newRequests.length === 1) {
                return classes.cellLastRow;
            }
            switch (rowIndex) {
                case 0:
                    return classes.cellFirstRow;
                case newRequests.length - 1:
                    return classes.cellLastRow;
                default:
                    return classes.cell
            }
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

    const onUpsellCheckboxClick = useCallback((option: IPackageOptionDetailed, requestId: number): void => {
        setTemporaryData(prev => {
            if (prev) {
                const optionToUpdate = prev.options.find(item => item.type === option.type);
                if (optionToUpdate) {
                    const request = optionToUpdate.intervalUpsells.find(item => item.serviceRequestId === requestId)
                    if (request) {
                        const updatedRequest = {...request, isSendToDMS: !request.isSendToDMS};
                        const updatedOption = {
                            ...optionToUpdate,
                            intervalUpsells: optionToUpdate.intervalUpsells
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
                                        Included in Package Service Requests
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
                            <TableHead>
                                <TableRow>
                                    <TableCell className={classes.headerCell} key="first">
                                        Service Interval Upsells
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow className={classes.emptyRow} key="empty"/>
                                {newUpsellRequests
                                    .slice()
                                    .sort((a, b) => a.orderIndex - b.orderIndex)
                                    .map((request, rowIndex) => {
                                        return <TableRow className={rowIndex % 2 === 0 ?  classes.row : classes.rowGrey} key={request.code}>
                                            <TableCell className={classes.requestCell} key={request.description}>{request.description}</TableCell>
                                            {temporaryData?.options
                                                .slice()
                                                .sort((a, b) => a.type - b.type)
                                                .map((option, cellIndex) => {
                                                    const requestInOption = option.intervalUpsells.find(req => req.serviceRequestId === request.id);

                                                    return <TableCell
                                                        className={getCellClass(cellIndex, rowIndex)}
                                                        key={option.type}
                                                        align="center">
                                                        <IconButton onClick={() => onUpsellCheckboxClick(option, request.id)}>
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

export default SaveRequestToDMSModal;