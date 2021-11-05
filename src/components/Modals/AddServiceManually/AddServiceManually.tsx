import React, {useEffect, useState} from 'react';
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../BaseModal";
import {DialogProps} from "../types";
import {TextField} from "../../UI/TextField";
import {Button, Input, InputAdornment, InputLabel} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {useDispatch} from "react-redux";
import {TComplimentary} from "../../../store/reducers/complimentary/types";
import {useSCs} from "../../../utils/hooks";
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

const AddServiceManually: React.FC<TAddServiceProps> = (props) => {
    const { title, onClose, editedItem } = props;

    const [description, setDescription] = useState<string>('');
    const [formIsChecked, setFormIsChecked] = useState<boolean>(false);
    const [duration, setDuration] = useState<number>(0);
    const [total, setTotal] = useState<number>(0);
    const dispatch = useDispatch();
    const {selectedSC} = useSCs();
    const classes = useStyles();

    useEffect(() => {
        if (editedItem) {
            setDuration(+editedItem.durationInHours);
            setDescription(editedItem.name);
            setTotal(+editedItem.price);
        }
    }, [editedItem])

    const onDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormIsChecked(false);
        setDescription(e.target.value);
    }

    const onTotalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormIsChecked(false);
        setTotal(+e.target.value);
    }

    const onDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormIsChecked(false);
        setDuration(+e.target.value);
    }

    const onCancel = (): void => {
        setFormIsChecked(false);
        setDescription('');
        setTotal(0);
        setDuration(0);
        onClose();
    }

    const onSave = (): void => {
        setFormIsChecked(true);
        if (description.length && selectedSC) {
            const data: TComplimentary = {
                serviceCenterId: selectedSC.id,
                name: description,
                price: total,
                durationInHours: duration,
            }
            editedItem
                ? dispatch(editComplimentary(editedItem.id, data, () => onCancel()))
                : dispatch(addComplimentaryManually(data, () => onCancel()));
        }
    }

    return (
        <BaseModal {...props} width={460}>
            <DialogTitle onClose={onClose}>{title}</DialogTitle>
            <DialogContent>
                <TextField
                    label='Service Description'
                    placeholder='Type Service Description'
                    error={!description && formIsChecked}
                    onChange={onDescriptionChange}
                    fullWidth
                    style={{ marginBottom: 10 }}
                    value={description}/>
                <InputLabel className={classes.label}>Duration</InputLabel>
                <Input
                    id="duration"
                    value={duration}
                    type="number"
                    className={classes.halfWidth}
                    onChange={onDurationChange}
                    inputProps={{
                        min: 0
                    }}
                />
                <InputLabel className={classes.label}>Total</InputLabel>
                <Input
                    id="outlined-adornment-amount"
                    value={total}
                    type="number"
                    className={classes.halfWidth}
                    onChange={onTotalChange}
                    inputProps={{
                        min: 0
                    }}
                    startAdornment={<InputAdornment position="start">$</InputAdornment>}
                />
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