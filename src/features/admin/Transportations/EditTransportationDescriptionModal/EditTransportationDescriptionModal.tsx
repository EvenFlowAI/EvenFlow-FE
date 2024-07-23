import React, {useEffect, useState} from 'react';
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../../../../components/modals/BaseModal/BaseModal";
import {DialogProps} from "../../../../components/modals/BaseModal/types";
import {
    ITransportationOptionFull
} from "../../../../store/reducers/transportationNeeds/types";
import {TextField} from "../../../../components/formControls/TextFieldStyled/TextField";
import {Button} from "@mui/material";
import {useDispatch} from "react-redux";
import {updateTransportationDescription} from "../../../../store/reducers/transportationNeeds/actions";
import {useStyles} from "./styles";
import {useException} from "../../../../hooks/useException/useException";
import {FileInput} from "../../../../components/formControls/FileInput/FileInput";
import {IIconState} from "../../ServiceCategories/AddServiceCategoryModal/types";

const initialFileState = {file: null, dataUrl: undefined};

export const EditTransportationDescriptionModal: React.FC<React.PropsWithChildren<React.PropsWithChildren<DialogProps & {editingElement: ITransportationOptionFull|null}>>> = (props) => {
    const [description, setDescription] = useState<string>('')
    const [formIsChecked, setFormIsChecked] = useState<boolean>(false);
    const [orderIndex, setOrderIndex] = useState<string>('');
    const [fileState, setFileState] = useState<IIconState>(initialFileState);
    const { classes  } = useStyles();
    const dispatch = useDispatch();
    const showError = useException();

    useEffect(() => {
        if (props.editingElement && props.open) {
            props.editingElement.description && setDescription(props.editingElement.description)
            props.editingElement.orderIndex && setOrderIndex(props.editingElement.orderIndex.toString())
        }
    }, [props.editingElement, props.open])

    const onCancel = () => {
        setFormIsChecked(false);
        setDescription('');
        setOrderIndex('');
        props.onClose();
    }

    const onDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setFormIsChecked(false);
        setDescription(e.target.value)
    }

    const onOrderChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setFormIsChecked(false);
        setOrderIndex(e.target.value)
    }

    const onSave = () => {
        setFormIsChecked(true);
        if (props.editingElement) {
            if (description.trim().length) {
                dispatch(updateTransportationDescription(
                    props.editingElement.id,
                    {...props.editingElement, description: description.trim()},
                    onCancel
                ))
            } else {
                showError('"Description" must not be empty')
            }
        }
    }

    return (
        <BaseModal {...props} width={600} onClose={onCancel}>
            <DialogTitle onClose={onCancel}>Manage Option</DialogTitle>
            <DialogContent>
                <div className={classes.upperRowWrapper}>
                    <div>
                        <TextField
                        fullWidth
                        type="number"
                        label='Booking Flow Order Index'
                        placeholder='Type Booking Flow Order Index'
                        error={formIsChecked && +orderIndex <= 0}
                        onChange={onOrderChange}
                        value={orderIndex}/>
                    </div>
                    <FileInput
                        setState={setFileState}
                        label={`${fileState.file || props.editingElement?.iconPath ? 'Update' : 'Upload' } Transportation Icon`}
                    />
                </div>
                <TextField
                    fullWidth
                    label='Description'
                    placeholder='Type Description'
                    error={formIsChecked && !description.length}
                    onChange={onDescriptionChange}
                    value={description}/>
            </DialogContent>
            <DialogActions>
                <div className={classes.actionsWrapper}>
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