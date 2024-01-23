import React, {useEffect, useState} from 'react';
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../../../../components/modals/BaseModal/BaseModal";
import {Button, Divider, IconButton} from "@mui/material";
import {DialogProps} from "../../../../components/modals/BaseModal/types";
import {AddCircleOutline} from "@mui/icons-material";
import {TextField} from "../../../../components/formControls/TextFieldStyled/TextField";
import {Chip} from "../../../../components/wrappers/Chip/Chip";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {createMake, setCurrentMake, updateMake} from "../../../../store/reducers/vehicleDetails/actions";
import {ICreateMake} from "../../../../store/reducers/vehicleDetails/types";
import {IMake} from "../../../../api/types";
import {useStyles} from "./styles";
import {useException} from "../../../../hooks/useException/useException";

type TAddMakeModalProps = DialogProps & {
    isEditing?: boolean;
};

export const AddMakeModelModal:React.FC<React.PropsWithChildren<React.PropsWithChildren<TAddMakeModalProps>>> = ({ isEditing, onClose, ...props}) => {
    const { currentMake, makes } = useSelector((state: RootState) => state.vehicleDetails);
    const { selectedSC } = useSelector((state: RootState) => state.serviceCenters);
    const [formIsChecked, setFormIsChecked] = useState<boolean>(false);
    const [make, setMake] = useState<string>('');
    const [models, setModels] = useState<string[]>([]);
    const [newModel, setNewModel] = useState<string>('');
    const classes = useStyles();
    const showError = useException();
    const dispatch = useDispatch();

    useEffect(() => {
        if (isEditing && currentMake) {
            setMake(currentMake?.name);
            setModels(currentMake?.models);
        }
    }, [isEditing, currentMake])

    const onCancel = () => {
        currentMake && dispatch(setCurrentMake(null));
        setModels([]);
        setMake('');
        setNewModel('');
        setFormIsChecked(false);
        onClose();
    }

    const onSave = () => {
        setFormIsChecked(true);
        const modelsList: string[] = newModel?.length ? [...models, newModel] : models;
        if (make && modelsList.length) {
            if (isEditing && currentMake?.id) {
                const data: IMake = {
                    name: make,
                    models: modelsList,
                }
                dispatch(updateMake(currentMake.id, data));
            } else {
                if (selectedSC) {
                    if (makes.find(item => item.name.toUpperCase() === make.toUpperCase())) {
                        return showError('This make already exists')
                    }
                    const data: ICreateMake = {
                        name: make,
                        models: modelsList,
                        serviceCenterId: selectedSC.id
                    }
                    dispatch(createMake(data))
                }
            }
            onCancel();
        } else {
            showError('Please enter make and models names')
        }
    }

    const addModel = () => {
        if (newModel.length) {
            if (!models.map(item => item.toUpperCase()).includes(newModel.toUpperCase())) {
                setModels(prev => [...prev, newModel]);
                setNewModel('');
            } else {
                showError('This Chip already exists')
            }
        }
    }

    const onMakeChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setFormIsChecked(false);
        setMake(e.target.value);
    }
    const onModelChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setFormIsChecked(false);
        setNewModel(e.target.value);
    }

    const onModelDelete = (model: string) => {
        setModels(prev => prev.filter(item => item !== model));
    }

    const onKeyUp = (e: React.KeyboardEvent<{}>) => {
        if (e.key === 'Enter') addModel();
    }

    return (
        <BaseModal {...props} width={540} onClose={onCancel}>
            <DialogTitle onClose={onCancel}>{isEditing ? 'Edit': 'Add'} Make and Model</DialogTitle>
            <DialogContent>
                    <TextField
                        fullWidth
                        label='Make'
                        placeholder='Type Make'
                        error={formIsChecked && (!make || !!makes.find(item => item.name.toUpperCase() === make.toUpperCase()))}
                        onChange={onMakeChange}
                        value={make}/>
                {Boolean(models.length) && <div className={classes.modelsWrapper}>
                    {models.map(model => <Chip key={model} name={model} onDelete={onModelDelete}/>)}
                </div>}
                <div className={classes.addModel} role="presentation" onKeyUp={onKeyUp}>
                    <div style={{width: '90%'}}>
                    <TextField
                        fullWidth
                        label='Model'
                        placeholder='Type Model'
                        error={formIsChecked && (!models.length || !newModel)}
                        onChange={onModelChange}
                        value={newModel}/>
                    </div>
                    <IconButton onClick={addModel} className={classes.iconPlus} size="large">
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