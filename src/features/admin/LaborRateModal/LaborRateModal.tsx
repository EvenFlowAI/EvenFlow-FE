import React, {useEffect, useState} from 'react';
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../../../components/modals/BaseModal/BaseModal";
import {Button, TableBody, TableHead} from "@mui/material";
import {TextField} from "../../../components/formControls/TextFieldStyled/TextField";
import {DialogProps} from "../../../components/modals/BaseModal/types";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {loadLaborRate, updateLaborRate} from "../../../store/reducers/serviceCenters/actions";
import {ILaborRate} from "../../../store/reducers/serviceCenters/types";
import {Loading} from "../../../components/wrappers/Loading/Loading";
import {DemandTable} from "../../../components/styled/DemandTable";
import {TableRow} from "../../../components/styled/TableRow";
import {TableCell} from "../../../components/styled/TableCell";
import {useStyles} from "./styles";

import {useMessage} from "../../../hooks/useMessage/useMessage";
import {useException} from "../../../hooks/useException/useException";

const fixedToTwo = /(^-?\d*\.?\d{1,2}?)$/;

const LaborRateModal: React.FC<React.PropsWithChildren<DialogProps>> = (props) => {
    const {laborRate, selectedSC, predictionParamsLoading} = useSelector((state: RootState) => state.serviceCenters);
    const [customerPay, setCustomerPay] = useState<string>('0');
    const [warranty, setWarranty] = useState<string>('0');
    const [internal, setInternal] = useState<string>('0');

    const classes = useStyles();
    const dispatch = useDispatch();
    const showError = useException()
    const showMessage = useMessage();

    useEffect(() => {
        selectedSC && dispatch(loadLaborRate(selectedSC.id))
    }, [selectedSC])

    useEffect(() => {
        if (props.open && laborRate) {
            setCustomerPay(laborRate.customerPay.toString());
            setWarranty(laborRate.warranty.toString());
            setInternal(laborRate.internal.toString());
        }
    }, [laborRate, props.open])

    const onCancel = () => {
        setCustomerPay(laborRate.customerPay.toString());
        setWarranty(laborRate.warranty.toString());
        setInternal(laborRate.internal.toString());
        props.onClose();
    }

    const onSuccess = () => {
        showMessage('Labor Rate updated')
        onCancel();
    }

    const onError = (err: string) => {
        showError(err);
    }

    const onSave = () => {
        if (customerPay.match(fixedToTwo)
            && warranty.match(fixedToTwo)
            && internal.match(fixedToTwo)) {
            const data: ILaborRate = {
                customerPay: Number(customerPay),
                warranty: Number(warranty),
                internal: Number(internal),
            }
            if (selectedSC) dispatch(updateLaborRate(selectedSC.id, data, onError, onSuccess))
        } else {
            showError('Each value can contain only two digits after coma');
        }
    }

    const handleChangeCustomerPay = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (Number(e.target.value) >= 0) setCustomerPay(e.target.value)
    }

    const handleChangeWarranty = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (Number(e.target.value) >= 0) setWarranty(e.target.value)
    }

    const handleChangeInternal = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (Number(e.target.value) >= 0) setInternal(e.target.value)
    }

    return (
        <BaseModal {...props} width={600} onClose={onCancel}>
            <DialogTitle onClose={onCancel}>Service Center Labor Rates</DialogTitle>
            <DialogContent>
                {predictionParamsLoading
                    ? <Loading/>
                    : <DemandTable>
                        <TableHead>
                            <TableRow>
                                <TableCell>Job Type</TableCell>
                                <TableCell style={{textTransform: 'none'}}>LABOR RATE ($ per hour)</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell>Customer Pay</TableCell>
                                <TableCell>
                                    <TextField
                                        type="number"
                                        error={!customerPay.match(fixedToTwo)}
                                        inputProps={{
                                            min: 0,
                                        }}
                                        value={customerPay}
                                        onChange={handleChangeCustomerPay}
                                    />
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Warranty</TableCell>
                                <TableCell>
                                    <TextField
                                        type="number"
                                        error={!warranty.match(fixedToTwo)}
                                        inputProps={{
                                            min: 0,
                                        }}
                                        value={warranty}
                                        onChange={handleChangeWarranty}
                                    />
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Internal</TableCell>
                                <TableCell>
                                    <TextField
                                        type="number"
                                        error={!internal.match(fixedToTwo)}
                                        inputProps={{
                                            min: 0,
                                        }}
                                        value={internal}
                                        onChange={handleChangeInternal}
                                    />
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </DemandTable>
                }
            </DialogContent>
            <DialogActions>
                <div className={classes.actionsWrapper}>
                    <div className={classes.buttonsWrapper}>
                        <Button
                            disabled={predictionParamsLoading}
                            onClick={onCancel}
                            className={classes.cancelButton}>
                            Cancel
                        </Button>
                        <Button
                            onClick={onSave}
                            disabled={predictionParamsLoading}
                            className={classes.saveButton}>
                            Save
                        </Button>
                    </div>
                </div>
            </DialogActions>
        </BaseModal>
    );
};

export default LaborRateModal;