import React, {useCallback, useEffect, useState} from 'react';
import {IWaitListSettings} from "../../../../store/reducers/optimizationWindows/types";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {updateWaitListSettings} from "../../../../store/reducers/optimizationWindows/actions";
import {TextField} from "../../../../components/formControls/TextFieldStyled/TextField";
import {Button, Switch} from "@mui/material";
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../../../../components/modals/BaseModal/BaseModal";
import {DialogProps} from "../../../../components/modals/BaseModal/types";
import {SwitcherLabel} from "../styles";
import {useStyles} from "./styles";

import {useMessage} from "../../../../hooks/useMessage/useMessage";
import {useException} from "../../../../hooks/useException/useException";
import {useSCs} from "../../../../hooks/useSCs/useSCs";
import {useSelectedPod} from "../../../../hooks/useSelectedPod/useSelectedPod";

const WaitListSlotSettingsModal: React.FC<React.PropsWithChildren<React.PropsWithChildren<DialogProps>>> = (props) => {
    const {waitListSettings, isWaitListLoading} = useSelector((state: RootState) => state.optimizationWindows);
    const [slotText, setSlotText] = useState<string>('');
    const [slotTextHex, setSlotTextHex] = useState<string>('');
    const [slotTextBoxHex, setSlotTextBoxHex] = useState<string>('');
    const [rolloverDescriptionText, setRolloverDescriptionText] = useState<string>('');
    const [isEnabled, setEnabled] = useState<boolean>(false);
    const [formIsChecked, setFormIsChecked] = useState<boolean>(false);
    const {selectedSC} = useSCs();
    const {selectedPod} = useSelectedPod();
    const dispatch = useDispatch()
    const showError = useException();
    const showMessage = useMessage();
    const { classes  } = useStyles();

    useEffect(() => {
        if (waitListSettings && props.open) {
            setSlotText(waitListSettings.appointmentSlotText ?? '')
            setSlotTextHex(waitListSettings.appointmentSlotTextHex ?? '')
            setSlotTextBoxHex(waitListSettings.appointmentSlotBoxHex ?? '')
            setRolloverDescriptionText(waitListSettings.rolloverDescriptionText ?? '')
            setEnabled(waitListSettings?.isEnabled)
        }
    }, [waitListSettings, props.open])

    const onSuccess = () => {
        showMessage("Waitlist Settings updated")
        onCancel()
    }

    const onSave = () => {
        setFormIsChecked(true)
        if (slotText.trim().length && selectedSC) {
            const data: IWaitListSettings = {
                serviceCenterId: selectedSC.id,
                podId: selectedPod?.id ?? null,
                appointmentSlotText: slotText,
                isEnabled,
            }
            if (slotTextHex.trim().length === 6) {
                data.appointmentSlotTextHex = slotTextHex.trim();
            }
            if (slotTextBoxHex.trim().length === 6) {
                data.appointmentSlotBoxHex = slotTextBoxHex.trim();
            }
            if (rolloverDescriptionText.trim().length) {
                data.rolloverDescriptionText = rolloverDescriptionText.trim()
            }
            dispatch(updateWaitListSettings(data, showError, onSuccess))
        }
    }

    const onSlotTextColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormIsChecked(false);
        if (e.target.value.match(/^[a-zA-Z0-9]*$/)) {
            setSlotTextHex(e.target.value.trim())
        } else {
            showError('Appointment Slot Text Color must consist letters and digits only')
        }
    }

    const onSlotBoxColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormIsChecked(false);
        if (e.target.value.match(/^[a-zA-Z0-9]*$/)) {
            setSlotTextBoxHex(e.target.value.trim())
        } else {
            showError('Appointment Slot Background Color must consist letters and digits only')
        }
    }

    const onSlotTextChange = useCallback((e: React.ChangeEvent<HTMLInputElement>): void  => {
        setFormIsChecked(false);
        setSlotText(e.target.value);
    }, [])

    const onDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormIsChecked(false);
        setRolloverDescriptionText(e.target.value)
    }

    const clearData = () => {
        setSlotText('');
        setSlotTextHex('');
        setSlotTextBoxHex('');
        setRolloverDescriptionText('');
        setEnabled(false);
        setFormIsChecked(false);
    }

    const onCancel = () => {
        clearData();
        props.onClose();
    }

    const handleSwitch = (e: any, value: boolean) => {
        setFormIsChecked(false);
        setEnabled(value)
    }

    return (
        <BaseModal {...props} width={590} onClose={onCancel}>
            <DialogTitle onClose={onCancel}>Edit Waitlist Functionality</DialogTitle>
            <DialogContent>
                <SwitcherLabel
                    control={<Switch
                        onChange={handleSwitch}
                        checked={isEnabled}
                        color="primary"
                    />}
                    disabled={isWaitListLoading}
                    style={{marginBottom: 24}}
                    label="WaitList Functionality"
                    labelPlacement="start"/>
                <div className={classes.inputWrapper}>
                    <TextField
                        fullWidth
                        disabled={isWaitListLoading}
                        label='Appointment Slot Text'
                        placeholder='Waitlist Only'
                        error={formIsChecked && !slotText}
                        onChange={onSlotTextChange}
                        value={slotText}/>
                </div>
                <div className={classes.inputWrapper}>
                    <TextField
                        fullWidth
                        disabled={isWaitListLoading}
                        value={slotTextHex}
                        inputProps={{maxLength: 6}}
                        startAdornment="#"
                        label="Appointment Slot Text Color"
                        placeholder="Enter font color 6 symbols (HEX)"
                        onChange={onSlotTextColorChange}
                    />
                </div>
                <div className={classes.inputWrapper}>
                    <TextField
                        fullWidth
                        disabled={isWaitListLoading}
                        value={slotTextBoxHex}
                        inputProps={{maxLength: 6}}
                        startAdornment="#"
                        label="Appointment Slot Background Color"
                        placeholder="Enter background color 6 symbols (HEX)"
                        onChange={onSlotBoxColorChange}
                    />
                </div>
                <div className={classes.inputWrapper} style={{marginBottom: 20}}>
                    <TextField
                        disabled={isWaitListLoading}
                        fullWidth
                        multiline
                        rows={4}
                        value={rolloverDescriptionText}
                        label="Rollover description text"
                        placeholder="Rollover description text"
                        onChange={onDescriptionChange}
                    />
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel} className={classes.cancelButton} disabled={isWaitListLoading}>
                    Cancel
                </Button>
                <Button onClick={onSave} color="primary" variant="contained" disabled={isWaitListLoading}>
                    Save
                </Button>
            </DialogActions>
        </BaseModal>
    );
};

export default WaitListSlotSettingsModal;