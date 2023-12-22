import React, {useCallback, useEffect, useState} from 'react';
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../../../../components/BaseModal/BaseModal";
import {DialogProps} from "../../../../components/BaseModal/types";
import {TextField} from "../../../../components/formControls/TextFieldStyled/TextField";
import {Button, InputAdornment} from "@material-ui/core";
import {useDispatch} from "react-redux";
import {TComplimentary} from "../../../../store/reducers/complimentary/types";
import {addComplimentaryManually, editComplimentary} from "../../../../store/reducers/complimentary/actions";
import {IComplimentaryServiceByQuery} from "../../../../store/reducers/packages/types";
import {useStyles} from "./styles";

import {useMessage} from "../../../../hooks/useMessage/useMessage";
import {useException} from "../../../../hooks/useException/useException";
import {useSCs} from "../../../../hooks/useSCs/useSCs";

type TAddServiceProps = DialogProps & {
  title: string;
  editedItem: IComplimentaryServiceByQuery | undefined;
};

const AddServiceManually: React.FC<TAddServiceProps> = ({ title, onClose, editedItem, ...props}) => {
    const [description, setDescription] = useState<string>('');
    const [formIsChecked, setFormIsChecked] = useState<boolean>(false);
    const [duration, setDuration] = useState<number | string>('');
    const [total, setTotal] = useState<number | string>('');
    const dispatch = useDispatch();
    const showError = useException();
    const showMessage = useMessage();
    const {selectedSC} = useSCs();
    const classes = useStyles();

    useEffect(() => {
        if (editedItem) {
            setDuration(+editedItem.durationInHours);
            setDescription(editedItem.name);
            setTotal(editedItem.price.toFixed(2));
        }
    }, [editedItem])

    const onDescriptionChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setFormIsChecked(false);
        setDescription(e.target.value);
    }, [])

    const onTotalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTotal(e.target.value);
        setFormIsChecked(false);
    }

    const onDurationChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setDuration(+e.target.value);
        setFormIsChecked(false);
    }, [])

    const onCancel = useCallback((): void => {
        setFormIsChecked(false);
        setDescription('');
        setTotal('');
        setDuration('');
        onClose();
    }, [])

    const onSuccess = () => {
        showMessage(editedItem ? 'Ops Code updated' : '1 Ops Code added')
        onCancel()
    }

    const onSave = useCallback((): void => {
        setFormIsChecked(true);
        if (description.length && selectedSC) {
            const data: TComplimentary = {
                serviceCenterId: selectedSC.id,
                name: description,
                price: +total,
                durationInHours: +duration,
            }
            editedItem
                ? dispatch(editComplimentary(editedItem.id, data, onSuccess, showError))
                : dispatch(addComplimentaryManually(data, onSuccess, showError));
        }
    }, [description, selectedSC, duration, total, editedItem])

    return (
        <BaseModal {...props} width={460} onClose={onCancel}>
            <DialogTitle onClose={onCancel}>{title}</DialogTitle>
            <DialogContent>
                <TextField
                    label='Service Description'
                    placeholder='Type Service Description'
                    error={!description && formIsChecked}
                    onChange={onDescriptionChange}
                    fullWidth
                    style={{ marginBottom: 10 }}
                    value={description}/>
                <TextField
                    type="number"
                    label='Duration'
                    placeholder='Duration'
                    value={duration}
                    inputProps={{min: 0}}
                    className={classes.halfWidth}
                    onChange={onDurationChange}/>
                <TextField
                    type="number"
                    label='Total'
                    placeholder='Total'
                    inputProps={{min: 1, step: 0.01}}
                    value={total}
                    className={classes.halfWidth}
                    onChange={onTotalChange}
                    startAdornment={<InputAdornment position="start">$</InputAdornment>}/>
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

export default AddServiceManually;