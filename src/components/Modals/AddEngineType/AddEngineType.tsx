import React, {useState} from 'react';
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../BaseModal";
import {TextField} from "../../UI/TextField";
import Model from "../AddMakeModel/Model";
import {DialogProps} from "../types";
import {Button, Divider, IconButton} from "@material-ui/core";
import {AddCircleOutline} from "@material-ui/icons";
import {useStyles} from "../AddMakeModel/AddMakeModel";
import {useDispatch, useSelector} from "react-redux";
import {createEngineType} from "../../../store/reducers/vehicleDetails/actions";
import {TCreateEngineType} from "../../../store/reducers/vehicleDetails/types";
import {useException, useSCs} from "../../../utils/hooks";
import {RootState} from "../../../store/rootReducer";

const AddEngineType: React.FC<DialogProps> = (props) => {
    const {engineTypes} = useSelector((state: RootState) => state.vehicleDetails);
    const [newEngineType, setNewEngineType] = useState<string>('');
    const [types, setTypes] = useState<string[]>([]);
    const [formIsChecked, setFormIsChecked] = useState<boolean>(false);
    const {selectedSC} = useSCs();
    const dispatch = useDispatch();
    const showError = useException();
    const classes = useStyles();

    const onCancel = () => {
        setNewEngineType('');
        setFormIsChecked(false);
        setTypes([]);
        props.onClose();
    }

    const onEngineTypeChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setFormIsChecked(true);
        setNewEngineType(e.target.value);
    }

    const onEngineTypeDelete = (el: string) => {
        setFormIsChecked(true);
        setTypes(prev => prev.filter(item => item !== el));
    }

    const addEngineType = ():void => {
        setFormIsChecked(true);
        if (newEngineType) {
            if (types.includes(newEngineType)) {
             return showError(`Mileage "${newEngineType}" already exists`)
            }
            setTypes(prev => [...prev, newEngineType]);
        }
        setNewEngineType('');
    }

    const onKeyDown = (e: React.KeyboardEvent<{}>) => {
        if (e.key === 'Enter') addEngineType();
    }

    const onSave = ():void => {
        setFormIsChecked(true);
        if ((types.length || newEngineType?.length) && selectedSC) {
            const existingTypes = engineTypes.filter(item => types.includes(item.name) || item.name === newEngineType)
            if (existingTypes.length) {
                return showError(`${existingTypes.length > 1 ? 'Mileages' : 'Mileage'} "${existingTypes.map(item => item.name).join(', ')}" already exists`)
            }
            const data: TCreateEngineType = {
                names: types.length ? types : [newEngineType],
                serviceCenterId: selectedSC.id,
            }
            dispatch(createEngineType(data));
            onCancel();
        }
    }

    return (
        <BaseModal {...props} width={540} onClose={onCancel}>
            <DialogTitle onClose={onCancel}>Add Engine Type</DialogTitle>
            <DialogContent>
                {Boolean(types.length) && <div className={classes.modelsWrapper}>
                    {types.map(type => <Model key={type} model={type} onDelete={onEngineTypeDelete}/>)}
                </div>}
                <div className={classes.addModel} role="presentation" onKeyPress={onKeyDown}>
                    <div style={{width: '90%'}}>
                        <TextField
                            fullWidth
                            label='Engine Type'
                            placeholder='Type Engine Type'
                            error={!newEngineType && !types.length && formIsChecked}
                            onChange={onEngineTypeChange}
                            value={newEngineType}/>
                    </div>
                    <IconButton onClick={addEngineType} className={classes.iconPlus}>
                        <AddCircleOutline/>
                    </IconButton>
                </div>
            </DialogContent>
            <Divider style={{ margin: 0 }}/>
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

export default AddEngineType;