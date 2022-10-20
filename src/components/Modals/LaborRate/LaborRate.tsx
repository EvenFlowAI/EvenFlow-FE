import React, {useEffect, useState} from 'react';
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../BaseModal";
import {DemandTable, TableCell, TableRow} from "../../Optimizer/AppointmentAllocation/UI";
import {Button, TableBody, TableHead} from "@material-ui/core";
import {TextField} from "../../UI/TextField";
import {DialogProps} from "../types";
import {makeStyles} from "@material-ui/core/styles";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {useException, useMessage} from "../../../utils/hooks";
import {loadLaborRate, updateLaborRate} from "../../../store/reducers/serviceCenters/actions";
import {ILaborRate} from "../../../store/reducers/serviceCenters/types";
import {Loading} from "../../UI/Loading";

const useStyles = makeStyles(() => ({
    actionsWrapper: {
        display: 'flex',
        justifyContent: 'flex-end',
        paddingTop: 14,
    },
    buttonsWrapper: {
        display: 'flex',
        justifyContent: "space-between",
        alignItems: 'center',
    },
    cancelButton: {
        color: '#9FA2B4',
        marginRight: 20,
        border: 'none',
        outline: 'none',
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
}))

const fixedToTwo = /(^-?\d*\.?\d{1,2}?)$/;

const LaborRate: React.FC<DialogProps> = (props) => {
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
                                <TableCell>Labor Rate, $</TableCell>
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

export default LaborRate;