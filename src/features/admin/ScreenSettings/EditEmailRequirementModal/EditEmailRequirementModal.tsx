import React, {useEffect, useState} from 'react';
import {Loading} from "../../../../components/Loading/Loading";
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../../../../components/BaseModal/BaseModal";
import {Button, TableBody, TableHead} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {DialogProps} from "../../../../components/BaseModal/types";
import {RadioButtonChecked, RadioButtonUnchecked} from "@material-ui/icons";
import {TEmailRequirement} from "../../../../store/reducers/screenSettings/types";
import {updateEmailRequirement} from "../../../../store/reducers/screenSettings/actions";
import {useStyles} from "./styles";
import {DemandTable} from "../../../../components/styled/DemandTable";
import {TableRow} from "../../../../components/styled/TableRow";
import {TableCellWithPadding} from "../../../../components/styled/TableCellWithPadding";

import {useMessage} from "../../../../hooks/useMessage/useMessage";
import {useException} from "../../../../hooks/useException/useException";
import {useSCs} from "../../../../hooks/useSCs/useSCs";

export const EditEmailRequirementModal: React.FC<DialogProps> = ({onClose, ...props}) => {
    const {emailRequirement, isEmailRequirementLoading} = useSelector((state: RootState) => state.screenSettingsBooking);
    const [data, setData] = useState<TEmailRequirement|null>(null);
    const {selectedSC} = useSCs();
    const dispatch = useDispatch();
    const classes = useStyles();
    const showError = useException();
    const showMessage = useMessage();

    useEffect(() => {
        setData(emailRequirement)
    }, [emailRequirement])

    const onCancel = () => {
        setData(emailRequirement);
        onClose();
    }

    const onChange = (field: keyof TEmailRequirement, checked: boolean) => {
        setData(prev => {
            if (prev) {
                return {...prev, [field]: checked}
            }
            return null;
        })
    }

    const onSuccess = () => {
        showMessage("Email Requirements Updated");
        onCancel();
    }

    const onSave = () => {
        if (selectedSC && data) {
            dispatch(updateEmailRequirement(selectedSC.id, data, showError, onSuccess))
        }
    }

    return (
        <BaseModal {...props} width={550} onClose={onCancel}>
            <DialogTitle
                onClose={onCancel}
                style={{textTransform: 'uppercase', color: "#575757", padding: '16px 48px'}}>
                Email Address Requirement on Appointment Confirmation Page
            </DialogTitle>
            <DialogContent>
                {isEmailRequirementLoading
                    ? <Loading/>
                    : <DemandTable>
                        <TableHead>
                            <TableRow>
                                <TableCellWithPadding style={{color: "#9FA2B4", fontSize: 12}} align="left">Booking Flow</TableCellWithPadding>
                                <TableCellWithPadding style={{color: "#9FA2B4", fontSize: 12}} align="center">Off</TableCellWithPadding>
                                <TableCellWithPadding style={{color: "#9FA2B4", fontSize: 12}} align="center">On</TableCellWithPadding>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCellWithPadding>Call Center & Service Advisor</TableCellWithPadding>
                                <TableCellWithPadding align="center">
                                    {!data?.adminAndEmployeesEnabled
                                        ? <RadioButtonChecked
                                            htmlColor="#3855F3"
                                            cursor="pointer"/>
                                        : <RadioButtonUnchecked
                                            htmlColor="#DADADA"
                                            cursor="pointer"
                                            onClick={() => onChange("adminAndEmployeesEnabled", false)}/>}
                                </TableCellWithPadding>
                                <TableCellWithPadding align="center">
                                    {data?.adminAndEmployeesEnabled
                                        ? <RadioButtonChecked
                                            htmlColor="#3855F3"
                                            cursor="pointer"/>
                                        : <RadioButtonUnchecked
                                            htmlColor="#DADADA"
                                            cursor="pointer"
                                            onClick={() => onChange("adminAndEmployeesEnabled", true)}/>}
                                </TableCellWithPadding>
                            </TableRow>
                            <TableRow>
                                <TableCellWithPadding>Customer Self Service</TableCellWithPadding>
                                <TableCellWithPadding align="center">
                                    {!data?.customerSelfServiceEnabled
                                        ? <RadioButtonChecked
                                            htmlColor="#3855F3"
                                            cursor="pointer"/>
                                        : <RadioButtonUnchecked
                                            htmlColor="#DADADA"
                                            cursor="pointer"
                                            onClick={() => onChange("customerSelfServiceEnabled", false)}/>}
                                </TableCellWithPadding>
                                <TableCellWithPadding align="center">
                                    {data?.customerSelfServiceEnabled
                                        ? <RadioButtonChecked
                                            htmlColor="#3855F3"
                                            cursor="pointer"/>
                                        : <RadioButtonUnchecked
                                            htmlColor="#DADADA"
                                            cursor="pointer"
                                            onClick={() => onChange("customerSelfServiceEnabled", true)}/>}
                                </TableCellWithPadding>
                            </TableRow>
                        </TableBody>
                    </DemandTable>}
            </DialogContent>
            <DialogActions>
                <div className={classes.actionsWrapper}>
                    <div className={classes.buttonsWrapper}>
                        <Button
                            disabled={isEmailRequirementLoading}
                            onClick={onCancel}
                            className={classes.cancelButton}>
                            Cancel
                        </Button>
                        <Button
                            onClick={onSave}
                            disabled={isEmailRequirementLoading}
                            className={classes.saveButton}>
                            Save
                        </Button>
                    </div>
                </div>
            </DialogActions>
        </BaseModal>
    );
};