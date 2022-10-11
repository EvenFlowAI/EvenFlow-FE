import React, {useCallback, useEffect, useState} from 'react';
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../BaseModal";
import {DialogProps} from "../types";
import {TextField} from "../../UI/TextField";
import {Button, InputAdornment} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {useDispatch} from "react-redux";
import {TComplimentary} from "../../../store/reducers/complimentary/types";
import {useException, useSCs} from "../../../utils/hooks";
import {addComplimentaryManually, editComplimentary} from "../../../store/reducers/complimentary/actions";
import {IComplimentaryServiceByQuery} from "../../../store/reducers/packages/types";

type TAddServiceProps = DialogProps & {
  title: string;
  editedItem: IComplimentaryServiceByQuery | undefined;
};

const useStyles = makeStyles(() => ({
    label: {
        fontWeight: 'bold',
        textTransform: 'uppercase',
        fontSize: 12,
        marginBottom: 10,
        color: 'black',
    },
    buttonsWrapper: {
        display: 'flex',
        justifyContent: "space-between",
        alignItems: 'center',
    },
    wrapper: {
        display: 'flex',
        justifyContent: 'flex-end',
        paddingTop: 14,
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
    halfWidth: {
        width: '50%',
        marginBottom: 10,
        '&:before': {
          borderBottom: 'none',
        }
    },
}))

const AddServiceManually: React.FC<TAddServiceProps> = ({ title, onClose, editedItem, ...props}) => {
    const [description, setDescription] = useState<string>('');
    const [formIsChecked, setFormIsChecked] = useState<boolean>(false);
    const [duration, setDuration] = useState<number | string>('');
    const [total, setTotal] = useState<number | string>('');
    const dispatch = useDispatch();
    const showError = useException();
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
        setTotal(+e.target.value);
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
                ? dispatch(editComplimentary(editedItem.id, data, () => onCancel(), showError))
                : dispatch(addComplimentaryManually(data, () => onCancel(), showError));
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
                    inputProps={{min: 0, step: 0.01}}
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