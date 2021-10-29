import React, {useEffect, useState, Dispatch, SetStateAction} from 'react';
import {BaseModal, DialogContent, DialogTitle} from "../BaseModal";
import {DialogProps} from "../types";
import {TEditedRequest} from "../../Optimizer/MaintenancePackages/PackageAccordion/PackageAccordion";
import {IPackageById, IPackageOptionDetailed, TExtendedService} from "../../../api/types";
import {TableContainer, TableRow, Table, TableHead, TableCell, TableBody, IconButton, Button} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {CheckBoxOutlineBlank, CheckBoxOutlined} from "@material-ui/icons";

type TSaveRequestModalProps = DialogProps & {
    editedRequests: TEditedRequest[];
    packageData: IPackageById | null;
    setPackageData: Dispatch<SetStateAction<IPackageById | null>>;
    onSave: () => void;
};

const useStyles = makeStyles(() => ({
    headerCell: {

    },
    headerCellBlack: {

    },
    rowGrey: {

    },
    row: {

    },
    firstCellFirstRow: {},
    firstCellLastRow: {},
    firstCell: {},
    lastCellFirstRow: {
    },
    lastCellLastRow: {},
    lastCell: {},
    cellFirstRow: {

    },
    cellLastRow: {

    },
    cell: {

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

const SaveRequestToDms: React.FC<TSaveRequestModalProps> = (props) => {
    const [newRequests, setNewRequests] = useState<TExtendedService[]>([]);
    const [temporaryData, setTemporaryData] = useState<IPackageById | null>(null);
    const classes = useStyles();

    useEffect(() => {
        setTemporaryData(props.packageData)
    }, [props.packageData])

    useEffect(() => {
        setNewRequests(prev => {
            if (temporaryData) {
                return temporaryData.serviceRequests.filter(item => !!props.editedRequests.find(el => el.requestId === item.id));
            }
            return prev;
        })
    }, [temporaryData, props.editedRequests])

    const getCellClass = (cellIndex: number, rowIndex: number) => {
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
    }

    const onCheckboxClick = (option: IPackageOptionDetailed, requestId: number): void => {
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
    }

    const onCancel = (): void => {
        props.onClose();
    }

    const onSave = async () => {
        await props.setPackageData(temporaryData);
        await props.onSave();
    }

    return (
        <BaseModal {...props} width={1000}>
            <DialogTitle onClose={props.onClose}>Choose Service Requests To Send To DMS</DialogTitle>
            <DialogContent>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell className={classes.headerCell}>
                                    Service Request
                                </TableCell>
                                {temporaryData?.options.map(option => (
                                    <TableCell className={classes.headerCellBlack}>
                                        {option.name}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {newRequests.map((request, rowIndex) => {
                                return <TableRow className={rowIndex % 2 === 0 ?  classes.row : classes.rowGrey}>
                                    <TableCell>{request.description}</TableCell>
                                    {temporaryData?.options.map((option, cellIndex) => {
                                        const requestInOption = option.serviceRequests.find(req => req.serviceRequestId === request.id);
                                        const requestWasEdited = props.editedRequests
                                            .find(item => item.requestId === request.id && option.type === item.optionType);

                                        return <TableCell className={getCellClass(cellIndex, rowIndex)}>
                                            <IconButton
                                                onClick={() => onCheckboxClick(option, request.id)}
                                                disabled={!requestWasEdited}>
                                                {requestInOption?.isSendToDMS
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
                <div className={classes.buttonsWrapper}>
                    <Button
                        onClick={onCancel}
                        className={classes.cancelButton}>
                        Cancel
                    </Button>
                    <Button
                        onClick={onSave}
                        className={classes.saveButton}>
                        save
                    </Button>
                </div>
            </DialogContent>
        </BaseModal>
    );
};

export default SaveRequestToDms;