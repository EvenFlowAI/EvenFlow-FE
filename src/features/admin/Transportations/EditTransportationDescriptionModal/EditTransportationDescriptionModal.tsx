import React, {useEffect, useState} from 'react';
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../../../../components/modals/BaseModal/BaseModal";
import {DialogProps} from "../../../../components/modals/BaseModal/types";
import {
    ETransportColumn,
    ITransportationOptionFull
} from "../../../../store/reducers/transportationNeeds/types";
import {autocompleteRender} from "../../../../utils/autocompleteRenders";
import { Autocomplete } from '@mui/material';
import {TextField} from "../../../../components/formControls/TextFieldStyled/TextField";
import {Button} from "@mui/material";
import {useDispatch} from "react-redux";
import {updateTransportationDescription} from "../../../../store/reducers/transportationNeeds/actions";
import {useStyles} from "./styles";
import {TOption} from "../types";
import {useException} from "../../../../hooks/useException/useException";

const initialColumn = {name: "Yes", value: ETransportColumn.Yes}

export const EditTransportationDescriptionModal: React.FC<React.PropsWithChildren<React.PropsWithChildren<DialogProps & {editingElement: ITransportationOptionFull|null}>>> = (props) => {
    const [description, setDescription] = useState<string>('')
    const [column, setColumn] = useState<TOption>(initialColumn);
    const [formIsChecked, setFormIsChecked] = useState<boolean>(false);
    const { classes  } = useStyles();
    const columnOptions = Object.keys(ETransportColumn).filter(key => Number.isNaN(+key)).map((op, index) => ({name: op, value: index}));
    const dispatch = useDispatch();
    const showError = useException();

    useEffect(() => {
        if (props.editingElement && props.open) {
            props.editingElement.description && setDescription(props.editingElement.description)
            const selected = columnOptions.find(el => el.value === props.editingElement?.column)
            if (selected) setColumn(selected)
        }
    }, [props.editingElement, props.open])

    const onCancel = () => {
        setFormIsChecked(false);
        setColumn(initialColumn);
        setDescription('');
        props.onClose();
    }

    const onColumnChange = (e: React.ChangeEvent<{}>, value: TOption | null): void => {
        setFormIsChecked(false);
        setColumn(value ?? initialColumn);
    }

    const onDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setFormIsChecked(false);
        setDescription(e.target.value)
    }

    const onSave = () => {
        setFormIsChecked(true);
        if (props.editingElement) {
            if (description.trim().length) {
                dispatch(updateTransportationDescription(
                    props.editingElement.id,
                    {...props.editingElement, column: column.value, description: description.trim()},
                    onCancel
                ))
            } else {
                showError('"Description" must not be empty')
            }
        }
    }

    return (
        <BaseModal {...props} width={500} onClose={onCancel}>
            <DialogTitle onClose={onCancel}>Manage Option</DialogTitle>
            <DialogContent>
                <Autocomplete
                    fullWidth
                    style={{ marginBottom: 20 }}
                    getOptionLabel={option => option.name}
                    options={columnOptions}
                    disableClearable
                    isOptionEqualToValue={(option, value) => option.name === ETransportColumn[+value]}
                    value={column}
                    onChange={onColumnChange}
                    renderInput={autocompleteRender({
                        label: 'Booking Flow Column',
                        placeholder: 'Select Booking Flow Column',
                    })}
                />
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