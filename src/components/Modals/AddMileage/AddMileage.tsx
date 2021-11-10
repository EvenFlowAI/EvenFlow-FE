import React, {useState} from 'react';
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../BaseModal";
import {TextField} from "../../UI/TextField";
import Model from "../AddMakeModel/Model";
import {DialogProps} from "../types";
import {Button, IconButton} from "@material-ui/core";
import {AddCircleOutline} from "@material-ui/icons";
import {useStyles} from "../AddMakeModel/AddMakeModel";

type TAddMakeModalProps = DialogProps;

const AddMileage: React.FC<TAddMakeModalProps> = (props) => {
    const [newMileage, setNewMileage] = useState<string>('');
    const [mileages, setMileages] = useState<string[]>([]);
    const [formIsChecked, setFormIsChecked] = useState<boolean>(false);
    const classes = useStyles();

    const onCancel = () => {
        setNewMileage('');
        setFormIsChecked(false);
        setMileages([]);
        props.onClose();
    }

    const onMileageChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setNewMileage(e.target.value);
    }

    const onMileageDelete = (el: string) => {
        setMileages(prev => prev.filter(item => item !== el));
    }

    const addMileage = ():void => {
        if (newMileage) setMileages(prev => [...prev, newMileage]);
        setNewMileage('');
    }

    const onKeyDown = (e: React.KeyboardEvent<{}>) => {
        if (e.key === 'Enter') addMileage();
    }

    const onSave = ():void => {
        // todo request
        onCancel();
    }

    return (
        <BaseModal {...props} width={540} onClose={onCancel}>
            <DialogTitle onClose={onCancel}>Add Mileage</DialogTitle>
            <DialogContent>
                {!!mileages.length && <div className={classes.modelsWrapper}>
                    {mileages.map(mileage => <Model key={mileage} model={mileage} onDelete={onMileageDelete}/>)}
                </div>}
                <div className={classes.addModel} role="presentation" onKeyPress={onKeyDown}>
                    <div style={{width: '90%'}}>
                        <TextField
                            fullWidth
                            label='Estimated Mileage'
                            placeholder='Type Mileage'
                            error={!newMileage && formIsChecked}
                            onChange={onMileageChange}
                            value={newMileage}/>
                    </div>
                    <IconButton onClick={addMileage} className={classes.iconPlus}>
                        <AddCircleOutline/>
                    </IconButton>
                </div>
            </DialogContent>
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

export default AddMileage;