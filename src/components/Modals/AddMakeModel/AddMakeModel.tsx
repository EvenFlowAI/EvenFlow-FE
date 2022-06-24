import React, {useEffect, useState} from 'react';
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../BaseModal";
import {Button, Divider, IconButton} from "@material-ui/core";
import {DialogProps} from "../types";
import {makeStyles} from "@material-ui/core/styles";
import {AddCircleOutline} from "@material-ui/icons";
import {TextField} from "../../UI/TextField";
import Model from "./Model";
import {useException} from "../../../utils/hooks";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {createMake, setCurrentMake, updateMake} from "../../../store/reducers/vehicleDetails/actions";
import {ICreateMake} from "../../../store/reducers/vehicleDetails/types";
import {IMake} from "../../../api/types";

type TAddMakeModalProps = DialogProps & {
    isEditing?: boolean;
};

export const useStyles = makeStyles(() => ({
    wrapper: {
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
    addModel: {
        display: "flex",
        alignItems: 'flex-end',
        margin: '20px 0',
    },
    iconPlus: {
        '& .MuiSvgIcon-root': {
            fill: '#7898FF',
        }
    },
    modelsWrapper: {
        height: 124,
        display: 'flex',
        alignItems: 'start',
        alignContent: 'start',
        justifyContent: 'stretch',
        flexWrap: 'wrap',
        overflowY: 'auto',
        margin: '16px 0',
        background: '#F7F8FB',
        color: '#B8B9BF',
        padding: '6px 12px',
    },
}))

const AddMakeModel:React.FC<TAddMakeModalProps> = ({ isEditing, onClose, ...props}) => {
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
        const modelsList: string[] = newModel ? [...models, newModel] : models;
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
        if (!models.map(item => item.toUpperCase()).includes(newModel.toUpperCase())) {
            setModels(prev => [...prev, newModel]);
            setNewModel('');
        } else {
            showError('This Model has been added already')
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

    const onKeyDown = (e: React.KeyboardEvent<{}>) => {
        if (e.key === 'Enter') addModel();
    }

    return (
        <BaseModal {...props} width={540} onClose={onCancel}>
            <DialogTitle onClose={onCancel}>{isEditing ? 'Edit': 'Add'} MAKE AND MODEL</DialogTitle>
            <DialogContent>
                    <TextField
                        fullWidth
                        label='Make'
                        placeholder='Type Make'
                        error={formIsChecked && (!make || !!makes.find(item => item.name.toUpperCase() === make.toUpperCase()))}
                        onChange={onMakeChange}
                        value={make}/>
                {Boolean(models.length) && <div className={classes.modelsWrapper}>
                    {models.map(model => <Model key={model} model={model} onDelete={onModelDelete}/>)}
                </div>}
                <div className={classes.addModel} role="presentation" onKeyPress={onKeyDown}>
                    <div style={{width: '90%'}}>
                    <TextField
                        fullWidth
                        label='Model'
                        placeholder='Type Model'
                        error={formIsChecked && (!models.length || !newModel)}
                        onChange={onModelChange}
                        value={newModel}/>
                    </div>
                    <IconButton onClick={addModel} className={classes.iconPlus}>
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

export default AddMakeModel;