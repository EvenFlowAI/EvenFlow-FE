import React, {useEffect, useState} from 'react';
import {DialogTitle, DialogContent, BaseModal, DialogActions} from "../BaseModal";
import {DialogProps} from "../types";
import {ITimeRangeAndCapacity} from "../../../store/reducers/capacityServiceValet/types";
import moment from "moment";
import {Button, Divider, Grid} from "@material-ui/core";
import {AccessTime} from "@material-ui/icons";
import {TimePicker} from "../../UI/DateTimePickers";
import {ParsableDate} from "@material-ui/pickers/constants/prop-types";
import {useException, useSCs} from "../../../utils/hooks";
import {TextField} from "../../UI/TextField";
import {useStyles} from "../AddMakeModel/AddMakeModel";
import {useDispatch} from "react-redux";
import {createTimeRange, updateTimeRange} from "../../../store/reducers/capacityServiceValet/actions";

type TProps = DialogProps & {
    editingElement: ITimeRangeAndCapacity;
}

export const inputTimeFormat = 'HH:mm:ss';
export const outTimeFormat = 'h:mm:ss';
export const outputTimeFormat = 'h:mm A';

const EditTimeRangeAndCapacity: React.FC<TProps> = ({onClose, open, editingElement}) => {
    const [pickUpMin, setPickUpMin] = useState<moment.Moment|null>(null)
    const [pickUpMax, setPickUpMax] = useState<moment.Moment|null>(null)
    const [dropOffMin, setDropOffMin] = useState<moment.Moment|null>(null)
    const [dropOffMax, setDropOffMax] = useState<moment.Moment|null>(null)
    const [dailyCapacity, setDailyCapacity] = useState<number|string>('')
    const [formIsChecked, setFormIsChecked] = useState<boolean>(false)
    const {selectedSC} = useSCs();
    const showError = useException();
    const classes = useStyles();
    const dispatch = useDispatch();

    useEffect(() => {
        if (open && editingElement) {
            if (editingElement.pickUpMin !== '-') setPickUpMin(moment(editingElement.pickUpMin, inputTimeFormat))
            if (editingElement.pickUpMax !== '-') setPickUpMax(moment(editingElement.pickUpMax, inputTimeFormat))
            if (editingElement.dropOffMin !== '-') setDropOffMin(moment(editingElement.dropOffMin, inputTimeFormat))
            if (editingElement.dropOffMax !== '-') setDropOffMax(moment(editingElement.dropOffMax, inputTimeFormat))
            if (editingElement.capacity) setDailyCapacity(editingElement.capacity)
        }
    }, [editingElement, open])

    const onCancel = () => {
        setFormIsChecked(false)
        setPickUpMin(null)
        setPickUpMax(null)
        setDropOffMax(null)
        setDropOffMin(null)
        setDailyCapacity('')
        onClose()
    }

    const handleChangePickUpMin = (date: ParsableDate) => {
        setFormIsChecked(false)
        setPickUpMin(moment(date))
    }

    const handleChangePickUpMax = (date: ParsableDate) => {
        setFormIsChecked(false)
        if (moment(pickUpMin).diff(moment(date)) <= 0) {
            setPickUpMax(moment(date))
        } else {
            showError('Pick Up Max Value must be more than Pick Up Min Value')
        }
    }

    const handleChangeDropOffMin = (date: ParsableDate) => {
        setFormIsChecked(false)
        setDropOffMin(moment(date))
    }

    const handleChangeDropOffMax = (date: ParsableDate) => {
        setFormIsChecked(false)
        if (moment(dropOffMin).diff(moment(date)) <= 0) {
            setDropOffMax(moment(date))
        } else {
            showError('Drop Off Max Value must be more than Drop Off Min Value')
        }
    }

    const handleChangeDailyCapacity = ({target: {value}}: React.ChangeEvent<HTMLInputElement>) => {
        setFormIsChecked(false)
        setDailyCapacity(value ? +value : '');
    }

    const checkIsValid = (): boolean => {
        return Boolean(pickUpMin) && Boolean(pickUpMax) && Boolean(dropOffMin) && Boolean(dropOffMax) && (+dailyCapacity > 0);
    }

    const onSave = () => {
        setFormIsChecked(true)
        if (selectedSC && checkIsValid()) {
            const data: ITimeRangeAndCapacity = {
                serviceCenterId: selectedSC.id,
                pickUpMin: moment(pickUpMin).format(outTimeFormat),
                pickUpMax: moment(pickUpMax).format(outTimeFormat),
                dropOffMin: moment(dropOffMin).format(outTimeFormat),
                dropOffMax: moment(dropOffMax).format(outTimeFormat),
                capacity: +dailyCapacity,
            }
            if (editingElement.id) {
                dispatch(updateTimeRange(selectedSC.id, editingElement.id, data, showError, onCancel))
            } else {
                data.dayOfWeek = editingElement.dayOfWeek;
                dispatch(createTimeRange(selectedSC.id, data, showError, onCancel))
            }
        }
    }

    return (
        <BaseModal onClose={onCancel} open={open} width={575}>
            <DialogTitle onClose={onCancel}>Edit Time Ranges & Capacity of
                <span style={{color: '#7898FF'}}> {editingElement.dayOfWeek ? moment().set('day', editingElement.dayOfWeek).format('dddd').toUpperCase() : ''}
                </span></DialogTitle>
            <DialogContent style={{padding: '16px 120px'}}>
                <Grid container spacing={4}>
                    <Grid item xs={12} sm={6}>
                        <TimePicker
                            key="pickUpMin"
                            value={pickUpMin}
                            clearable
                            fullWidth
                            style={{cursor: "pointer"}}
                            InputProps={{
                                endAdornment: <AccessTime color="primary" />,
                                error: formIsChecked && !pickUpMin,
                            }}
                            name="pickUpMin"
                            label="Pick Up Min"
                            onChange={handleChangePickUpMin}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TimePicker
                            key="pickUpMax"
                            value={pickUpMax}
                            clearable
                            fullWidth
                            style={{cursor: "pointer"}}
                            InputProps={{
                                endAdornment: <AccessTime color="primary" />,
                                error: formIsChecked && !pickUpMax,
                            }}
                            name="pickUpMax"
                            label="Pick Up Max"
                            onChange={handleChangePickUpMax}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TimePicker
                            key="dropOffMin"
                            value={dropOffMin}
                            clearable
                            fullWidth
                            style={{cursor: "pointer"}}
                            InputProps={{
                                endAdornment: <AccessTime color="primary" />,
                                error: formIsChecked && !dropOffMin,
                            }}
                            name="dropOffMin"
                            label="Drop Off Min"
                            onChange={handleChangeDropOffMin}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TimePicker
                            key="dropOffMax"
                            value={dropOffMax}
                            clearable
                            fullWidth
                            style={{cursor: "pointer"}}
                            InputProps={{
                                endAdornment: <AccessTime color="primary" />,
                                error: formIsChecked && !dropOffMax,
                            }}
                            name="dropOffMax"
                            label="Drop Off Max"
                            onChange={handleChangeDropOffMax}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label={"Daily Capacity"}
                            name="dailyCapacity"
                            type="number"
                            error={formIsChecked && (+dailyCapacity < 0 || !dailyCapacity.toString().length)}
                            inputProps={{
                                min: 0,

                            }}
                            value={dailyCapacity}
                            onChange={handleChangeDailyCapacity}
                            fullWidth
                            id="dailyCapacity"
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <Divider style={{marginBottom: 0}}/>
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

export default EditTimeRangeAndCapacity;