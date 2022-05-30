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


const LaborRate: React.FC<DialogProps> = (props) => {
    const {laborRate, selectedSC} = useSelector((state: RootState) => state.serviceCenters);
    const [customerPay, setCustomerPay] = useState<number>(0);
    const [warranty, setWarranty] = useState<number>(0);
    const [internal, setInternal] = useState<number>(0);

    const classes = useStyles();
    const dispatch = useDispatch();
    const showError = useException()
    const showMessage = useMessage();

    useEffect(() => {
        selectedSC && dispatch(loadLaborRate(selectedSC.id))
    }, [selectedSC])

    useEffect(() => {
        setCustomerPay(laborRate.laborRatePerHour);
        setWarranty(laborRate.warranty);
        setInternal(laborRate.internal);
    }, [laborRate])

    const onCancel = () => {
        setCustomerPay(laborRate.laborRatePerHour);
        setWarranty(laborRate.warranty);
        setInternal(laborRate.internal);
        props.onClose();
    }

    const onSuccess = () => {
        showMessage('Labor Rate Updated Successfully')
        props.onClose();
    }

    const onError = (err: string) => {
        showError(err);
    }

    const onSave = () => {
        const data: ILaborRate = {
            laborRatePerHour: customerPay,
            warranty,
            internal,
        }
        if (selectedSC) dispatch(updateLaborRate(selectedSC.id, data, onError, onSuccess))
    }

    const handleChangeCustomerPay = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCustomerPay(Number(e.target.value))
    }

    const handleChangeWarranty = (e: React.ChangeEvent<HTMLInputElement>) => {
        setWarranty(Number(e.target.value))
    }

    const handleChangeInternal = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInternal(Number(e.target.value))
    }

    return (
        <BaseModal {...props} width={600} onClose={onCancel}>
            <DialogTitle onClose={onCancel}>Service Center Labor Rates</DialogTitle>
            <DialogContent>
                <DemandTable>
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
            </DialogContent>
            <DialogActions>
                <div className={classes.actionsWrapper}>
                    <div className={classes.buttonsWrapper}>
                        <Button
                            // disabled={remindersLoading}
                            onClick={onCancel}
                            className={classes.cancelButton}>
                            Cancel
                        </Button>
                        <Button
                            onClick={onSave}
                            // disabled={remindersLoading}
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