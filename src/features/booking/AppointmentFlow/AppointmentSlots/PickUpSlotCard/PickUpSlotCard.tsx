import React, {useEffect, useState} from 'react';
import {IServiceValetAppointment} from "../../../../../store/reducers/appointment/types";
import {TArgCallback} from "../../../../../types/types";
import moment from "moment";
import {useTranslation} from "react-i18next";
import {CheckCircleOutlined, HighlightOff, RadioButtonChecked, RadioButtonUnchecked} from "@mui/icons-material";
import {useSelector} from "react-redux";
import {RootState} from "../../../../../store/rootReducer";
import {mockSlotTime} from "../constants";
import {PickUpWrapper, useStyles} from "./styles";

type TProps = {
    timeSlot: IServiceValetAppointment|null;
    selected: boolean;
    onSelect: TArgCallback<IServiceValetAppointment|null>;
    date: moment.Moment|null;
}

export const PickUpSlotCard: React.FC<React.PropsWithChildren<React.PropsWithChildren<TProps>>> =({timeSlot, onSelect, selected, date}) => {
    const [timePassed, setTimePassed] = useState<boolean>(false);
    const {dropOffSettings} = useSelector((state: RootState) => state.appointment);
    const classes = useStyles();
    const {t} = useTranslation();

    useEffect(() => {
        if (timeSlot?.date) {
            if (timeSlot?.date) {
                const timeSlotDate = timeSlot.date.toString().split('T')[0]
                const [h, m, s] = timeSlot?.pickUpMin.split(":");
                const timeSlotTime = moment(timeSlotDate).set('hour', +h).set('minute', +m).set('second', +s);
                if (moment(timeSlotDate).isSame(moment(), 'day') && moment(date).isSame(moment(), 'day')) {
                    const differenceInMSeconds = moment(moment(timeSlotTime).format('YYYY-MM-DDTHH:mm:ss')).diff(moment());
                    if (differenceInMSeconds > 0) {
                        setTimeout(() => setTimePassed(true), differenceInMSeconds);
                    } else {
                        setTimePassed(true);
                    }
                } else {
                    setTimePassed(false);
                }
            }
        }
    }, [timeSlot, date])

    return (
        <PickUpWrapper
            key={timeSlot ? moment(timeSlot.date).toISOString() : moment().toISOString()}
            available={Boolean(timeSlot) && !timePassed}
            selected={selected}
            onClick={() => timePassed ? {} : onSelect(timeSlot ?? null)}
        >
            <div className="pickUp">
                <div className={classes.radio}>
                    {!selected ? <RadioButtonUnchecked/> : <RadioButtonChecked/>}
                </div>
                <div className={classes.text}>
                    <div>{t("Pick Up Time")}:</div>
                    <div>
                        {timeSlot ? moment(timeSlot.pickUpMin, 'HH:mm').format('hh:mm A') : moment(mockSlotTime.pickUpMin, 'HH:mm').format('hh:mm A')}
                        <span> {t("to")} </span>
                        {timeSlot ? moment(timeSlot?.pickUpMax, 'HH:mm').format('hh:mm A') : moment(mockSlotTime.pickUpMax, 'HH:mm').format('hh:mm A')}
                    </div>
                </div>
            </div>
            <div className={classes.rightPart}>
                <div className={classes.availability}>
                    {timeSlot && timeSlot.available > 0
                        ? <div className={classes.availabilityItem} style={{color: "#008331"}}>
                            <div className={classes.textWithIcon}>{t("Available")}   <CheckCircleOutlined style={{marginLeft: 8}}/> </div>
                            <div>{timeSlot?.available} {t("left")}</div>
                        </div>
                        : <div className={classes.availabilityItem}>
                            <div className={classes.textWithIcon} style={{color: '#202021'}}>{t("Not Available")}   <HighlightOff style={{marginLeft: 8}}/> </div>
                            <div className={classes.textWithIcon} style={{color: '#DADADA'}}>0 {t("left")}</div>
                        </div>
                    }
                </div>
                { dropOffSettings?.showDropOffTime && timeSlot?.dropOffMin && timeSlot?.dropOffMax
                    ? <div className={classes.dropOff}>
                        <div>{t("Drop Off Time")}:</div>
                        <div className={classes.rightText}>
                            {timeSlot ? moment(timeSlot?.dropOffMin, 'HH:mm').format('hh:mm A') : moment(mockSlotTime.dropOffMin, 'HH:mm').format('hh:mm A')}
                            <span> {t("to")} </span>
                            {timeSlot ? moment(timeSlot?.dropOffMax, 'HH:mm').format('hh:mm A') : moment(mockSlotTime.dropOffMax, 'HH:mm').format('hh:mm A')}
                        </div>
                    </div>
                    : <div className={classes.dropOff} style={{textAlign: 'justify', paddingBottom: 16}}>{dropOffSettings?.description}</div>
                }
            </div>
        </PickUpWrapper>
    );
};