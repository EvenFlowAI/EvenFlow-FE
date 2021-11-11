import React, {useState} from 'react';
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../BaseModal";
import {TextField} from "../../UI/TextField";
import Model from "../AddMakeModel/Model";
import {DialogProps} from "../types";
import {Button, IconButton} from "@material-ui/core";
import {AddCircleOutline} from "@material-ui/icons";
import {useStyles} from "../AddMakeModel/AddMakeModel";
import {useDispatch, useSelector} from "react-redux";
import {createMileage} from "../../../store/reducers/vehicleDetails/actions";
import {TCreateMileage} from "../../../store/reducers/vehicleDetails/types";
import {useException, useSCs} from "../../../utils/hooks";
import {RootState} from "../../../store/rootReducer";

type TAddMakeModalProps = DialogProps;

const AddMileage: React.FC<TAddMakeModalProps> = (props) => {
    const {mileage} = useSelector((state: RootState) => state.vehicleDetails);
    const [newMileage, setNewMileage] = useState<string>('');
    const [mileages, setMileages] = useState<string[]>([]);
    const [formIsChecked, setFormIsChecked] = useState<boolean>(false);
    const {selectedSC} = useSCs();
    const dispatch = useDispatch();
    const showError = useException();
    const classes = useStyles();

    const onCancel = () => {
        setNewMileage('');
        setFormIsChecked(false);
        setMileages([]);
        props.onClose();
    }

    const onMileageChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setFormIsChecked(true);
        setNewMileage(e.target.value);
    }

    const onMileageDelete = (el: string) => {
        setFormIsChecked(true);
        setMileages(prev => prev.filter(item => item !== el));
    }

    const addMileage = ():void => {
        setFormIsChecked(true);
        if (newMileage) setMileages(prev => [...prev, newMileage]);
        setNewMileage('');
    }

    const onKeyDown = (e: React.KeyboardEvent<{}>) => {
        if (e.key === 'Enter') addMileage();
    }

    const onSave = ():void => {
        setFormIsChecked(true);
        if ((mileages.length || newMileage) && selectedSC) {
            if (mileage.find(item => mileages.includes(`${item.value}`) || item.value === +newMileage)) {
                return showError('Some mileage value already exists!')
            }
            const data: TCreateMileage = {
                values: mileages.length ? mileages.map(item => +item) : [+newMileage],
                serviceCenterId: selectedSC.id,
            }
            dispatch(createMileage(data));
            onCancel();
        }
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
                            type="number"
                            inputProps={{min: 0}}
                            label='Estimated Mileage'
                            placeholder='Type Mileage'
                            error={!newMileage && !mileages.length && formIsChecked}
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