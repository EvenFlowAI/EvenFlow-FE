import React, {useState} from 'react';
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../../../../components/modals/BaseModal/BaseModal";
import {TextField} from "../../../../components/formControls/TextFieldStyled/TextField";
import {Chip} from "../../../../components/wrappers/Chip/Chip";
import {DialogProps} from "../../../../components/modals/BaseModal/types";
import {Button, Divider, IconButton} from "@mui/material";
import {AddCircleOutline} from "@mui/icons-material";
import {useStyles} from "../../MakesModels/AddMakeModelModal/styles";
import {useDispatch, useSelector} from "react-redux";
import {createMileage} from "../../../../store/reducers/vehicleDetails/actions";
import {TCreateMileage} from "../../../../store/reducers/vehicleDetails/types";
import {RootState} from "../../../../store/rootReducer";
import {useException} from "../../../../hooks/useException/useException";
import {useSCs} from "../../../../hooks/useSCs/useSCs";

export const AddMileageModal: React.FC<React.PropsWithChildren<React.PropsWithChildren<DialogProps>>> = (props) => {
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

    const onKeyUp = (e: React.KeyboardEvent<{}>) => {
        if (e.key === 'Enter') addMileage();
    }

    const onSave = ():void => {
        setFormIsChecked(true);
        if ((mileages.length || newMileage?.length) && selectedSC) {
            const existingMileage = mileage.find(item => mileages.includes(`${item.value}`) || item.value === +newMileage)
            if (existingMileage) {
                return showError(`Mileage ${newMileage} already exists`)
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
                {Boolean(mileages.length) && <div className={classes.modelsWrapper}>
                    {mileages.map(mileage => <Chip key={mileage} name={mileage} onDelete={onMileageDelete}/>)}
                </div>}
                <div className={classes.addModel} role="presentation" onKeyUp={onKeyUp}>
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
                    <IconButton onClick={addMileage} className={classes.iconPlus} size="large">
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