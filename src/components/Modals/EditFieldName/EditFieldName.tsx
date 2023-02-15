import React, {useEffect, useState} from 'react';
import {DialogProps} from "../types";
import {useDispatch} from "react-redux";
import {useException, useSCs} from "../../../utils/hooks";
import {updateEngineTypeFieldName} from "../../../store/reducers/vehicleDetails/actions";
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../BaseModal";
import {Button, Divider} from "@material-ui/core";
import {useStyles} from "../AddMakeModel/AddMakeModel";
import {TextField} from "../../UI/TextField";

const EditFieldName:React.FC<DialogProps> = (props) => {
    const [fieldName, setFieldName] = useState<string>('');
    const [formIsChecked, setFormIsChecked] = useState<boolean>(false);
    const {selectedSC} = useSCs();
    const dispatch = useDispatch()
    const showError = useException();
    const classes = useStyles();

    useEffect(() => {
        if (selectedSC?.engineTypeFieldName) setFieldName(selectedSC.engineTypeFieldName);
    }, [selectedSC])

    const onCancel = (): void => {
        setFieldName(selectedSC?.engineTypeFieldName ?? '');
        setFormIsChecked(false);
        props.onClose();
    }

    const onFieldNameChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setFormIsChecked(false);
        setFieldName(e.target.value);
    }

    const onSave = ():void => {
        setFormIsChecked(true);
        if (selectedSC) dispatch(updateEngineTypeFieldName(fieldName, selectedSC.id, onCancel, showError))
    }

    return (
        <BaseModal {...props} width={540} onClose={onCancel}>
            <DialogTitle onClose={onCancel}>Edit Field Name</DialogTitle>
            <DialogContent>
                <TextField
                    fullWidth
                    label='Field Name'
                    placeholder='Type Field Name'
                    error={formIsChecked && !fieldName.length}
                    onChange={onFieldNameChange}
                    value={fieldName}/>
            </DialogContent>
            <Divider style={{ margin: '16px 0' }}/>
            <DialogActions>
                <div className={classes.wrapper}>
                    <div className={classes.buttonsWrapper}>
                        <Button
                            onClick={onCancel}
                            className={classes.cancelButton}>
                            Cancel
                        </Button>
                        <Button
                            onClick={onSave}
                            className={classes.saveButton}>
                            Save
                        </Button>
                    </div>
                </div>
            </DialogActions>
        </BaseModal>
    );
};

export default EditFieldName;