import React, {useEffect, useState} from 'react';
import {DialogTitle, DialogContent, BaseModal} from "../BaseModal";
import {DialogProps} from "../types";
import {ITimeRangeAndCapacity} from "../../../store/reducers/capacityServiceValet/types";
import moment from "moment";
import {Grid} from "@material-ui/core";
import {AccessTime} from "@material-ui/icons";
import {TimePicker} from "../../UI/DateTimePickers";
import {ParsableDate} from "@material-ui/pickers/constants/prop-types";
import {useException} from "../../../utils/hooks";
import {TextField} from "../../UI/TextField";

type TProps = DialogProps & {
    editingElement: ITimeRangeAndCapacity;
}

const EditTimeRangeAndCapacity: React.FC<TProps> = ({onClose, open, editingElement}) => {
    const [pickUpMin, setPickUpMin] = useState<moment.Moment|null>(null)
    const [pickUpMax, setPickUpMax] = useState<moment.Moment|null>(null)
    const [dropOffMin, setDropOffMin] = useState<moment.Moment|null>(null)
    const [dropOffMax, setDropOffMax] = useState<moment.Moment|null>(null)
    const [dailyCapacity, setDailyCapacity] = useState<number|string>('')
    const showError = useException();

    useEffect(() => {
        if (editingElement.pickUpMin !== '-') setPickUpMin(moment(editingElement.pickUpMin))
        if (editingElement.pickUpMax !== '-') setPickUpMax(moment(editingElement.pickUpMax))
        if (editingElement.dropOffMin !== '-') setDropOffMin(moment(editingElement.dropOffMin))
        if (editingElement.dropOffMax !== '-') setDropOffMax(moment(editingElement.dropOffMax))
        if (editingElement.dailyCapacity) setDailyCapacity(editingElement.dailyCapacity)
    }, [editingElement])

    const handleChangePickUpMin = (date: ParsableDate) => {
        setPickUpMin(moment(date))
    }

    const handleChangePickUpMax = (date: ParsableDate) => {
        if (moment(pickUpMin).diff(moment(date)) > 0) {
            setPickUpMax(moment(date))
        } else {
            showError('Pick Up Max Value must be more than Pick Up Min Value')
        }
    }

    const handleChangeDropOffMin = (date: ParsableDate) => {
        setDropOffMin(moment(date))
    }

    const handleChangeDropOffMax = (date: ParsableDate) => {
        if (moment(dropOffMin).diff(moment(date)) > 0) {
            setDropOffMax(moment(date))
        } else {
            showError('Drop Off Max Value must be more than Drop Off Min Value')
        }
    }

    const handleChangeDailyCapacity = ({target: {value}}: React.ChangeEvent<HTMLInputElement>) => {
        setDailyCapacity(value ? +value : '');
    }

    return (
        <BaseModal onClose={onClose} open={open} width={575}>
            <DialogTitle onClose={onClose}>Edit Time Ranges & Capacity of
                <span style={{color: '#7898FF'}}> {moment(editingElement.dayOfWeek).format('dddd').toUpperCase()}
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
                                endAdornment: <AccessTime color="primary" />
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
                                endAdornment: <AccessTime color="primary" />
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
                                endAdornment: <AccessTime color="primary" />
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
                                endAdornment: <AccessTime color="primary" />
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
        </BaseModal>
    );
};

export default EditTimeRangeAndCapacity;