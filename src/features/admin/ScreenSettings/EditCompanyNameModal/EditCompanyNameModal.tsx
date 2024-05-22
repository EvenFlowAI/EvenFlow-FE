import React, {useEffect, useState} from 'react';
import {Loading} from "../../../../components/wrappers/Loading/Loading";
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../../../../components/modals/BaseModal/BaseModal";
import {Button, TableBody, TableHead} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {DialogProps} from "../../../../components/modals/BaseModal/types";
import {RadioButtonChecked, RadioButtonUnchecked} from "@mui/icons-material";
import {useStyles} from "./styles";
import {DemandTable} from "../../../../components/styled/DemandTable";
import {TableRow} from "../../../../components/styled/TableRow";
import {TableCellWithPadding} from "../../../../components/styled/TableCellWithPadding";
import {useMessage} from "../../../../hooks/useMessage/useMessage";
import {useException} from "../../../../hooks/useException/useException";
import {useSCs} from "../../../../hooks/useSCs/useSCs";

export const EditCompanyNameModal: React.FC<React.PropsWithChildren<React.PropsWithChildren<DialogProps>>> = ({onClose, ...props}) => {
    const {companyName, companyNameIsLoading} = useSelector((state: RootState) => state.screenSettingsBooking);
    const [isCompanyNameActive, setCompanyNameActive] = useState<boolean>(false);
    const {selectedSC} = useSCs();
    const dispatch = useDispatch();
    const { classes  } = useStyles();
    const showError = useException();
    const showMessage = useMessage();

    useEffect(() => {
        setCompanyNameActive(companyName)
    }, [companyName])

    const onCancel = () => {
        setCompanyNameActive(companyName)
        onClose();
    }

    const onChange = (checked: boolean) => {
        setCompanyNameActive(checked)
    }

    const onSuccess = () => {
        showMessage("Company Name Settings Updated");
        onCancel();
    }

    const onSave = () => {
        if (selectedSC) {

        }
    }

    return (
        <BaseModal {...props} width={700} onClose={onCancel}>
            <DialogTitle
                onClose={onCancel}
                style={{padding: '18px 48px 28px 48px'}}>
                Display Setting Of Company Name
            </DialogTitle>
            <DialogContent>
                {companyNameIsLoading
                    ? <Loading/>
                    : <DemandTable>
                        <TableHead>
                            <TableRow>
                                <TableCellWithPadding style={{color: "#9FA2B4", textTransform: 'capitalize'}} align="left">
                                    Appointment Confirmation Page
                                </TableCellWithPadding>
                                <TableCellWithPadding style={{color: "#9FA2B4", textTransform: 'capitalize'}} align="center">
                                    Off
                                </TableCellWithPadding>
                                <TableCellWithPadding style={{color: "#9FA2B4", textTransform: 'capitalize'}} align="center">
                                    On
                                </TableCellWithPadding>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCellWithPadding>Company Name</TableCellWithPadding>
                                <TableCellWithPadding align="center">
                                    {!isCompanyNameActive
                                        ? <RadioButtonChecked
                                            htmlColor="#3855F3"
                                            cursor="pointer"/>
                                        : <RadioButtonUnchecked
                                            htmlColor="#DADADA"
                                            cursor="pointer"
                                            onClick={() => onChange( false)}/>}
                                </TableCellWithPadding>
                                <TableCellWithPadding align="center">
                                    {isCompanyNameActive
                                        ? <RadioButtonChecked
                                            htmlColor="#3855F3"
                                            cursor="pointer"/>
                                        : <RadioButtonUnchecked
                                            htmlColor="#DADADA"
                                            cursor="pointer"
                                            onClick={() => onChange(true)}/>}
                                </TableCellWithPadding>
                            </TableRow>
                        </TableBody>
                    </DemandTable>}
            </DialogContent>
            <DialogActions>
                <div className={classes.actionsWrapper}>
                    <div className={classes.buttonsWrapper}>
                        <Button
                            disabled={companyNameIsLoading}
                            onClick={onCancel}
                            style={{marginRight: 12}}
                            color="info">
                            Cancel
                        </Button>
                        <Button
                            onClick={onSave}
                            disabled={companyNameIsLoading}
                            className={classes.saveButton}>
                            Save
                        </Button>
                    </div>
                </div>
            </DialogActions>
        </BaseModal>
    );
};