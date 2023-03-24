import React, {useEffect, useState} from 'react';
import {IServiceValetAppointment} from "../../../store/reducers/appointment/types";
import {styled, Theme} from "@material-ui/core";
import {TArgCallback} from "../../../types/types";
import moment from "moment";
import {useTranslation} from "react-i18next";
import {
    CheckCircleOutlined,
    HighlightOff,
    RadioButtonChecked,
    RadioButtonUnchecked
} from "@material-ui/icons";
import {makeStyles} from "@material-ui/core/styles";
import {useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";

type TPickUpSlotsWrapperProps = {
    available?: boolean,
    selected?: boolean,
}

const PickUpWrapper = styled(({available, selected, ...props}) => <div {...props}/>)<Theme, TPickUpSlotsWrapperProps>(({theme, available, selected}) => ({
    maxHeight: 315,
    display: "grid",
    gridTemplateColumns: '4fr 6fr',
    alignItems: "center",
    fontWeight: "bold",
    gap: "6px",
    opacity: available ? 1 : .3,
    cursor: "pointer",
    border: '1px solid #000000',
    borderRadius: 2,
    [theme.breakpoints.down('sm')]: {
        gridTemplateColumns: '1fr',
        gridTemplateRows: '1fr 1fr',
    },
    '& .pickUp': {
        height: '100%',
        display: 'grid',
        gridTemplateColumns: '1fr 5fr',
        backgroundColor: selected ? '#202021' : '#E0E0E0',
        color: selected ? '#FFFFFF' : '#202021',
    },
}))

const useStyles = makeStyles(theme => ({
    dropOff: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        justifyContent: 'flex-start',
        fontSize: 14,
        color:'#202021',
        paddingTop: 25,
        paddingRight: 16,
        [theme.breakpoints.up("md")]: {
            paddingRight: 60,
        }
    },
    rightPart: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        [theme.breakpoints.down("sm")]: {
            gap: 8,
        },
    },
    availability: {
        padding: '25px 0 46px 16px',
        textTransform: 'uppercase',
        fontSize: 16,
        [theme.breakpoints.up("md")]: {
            padding: '25px 0 46px 50px',
        },
    },
    availabilityItem: {
        display: 'flex',
        flexDirection: 'column',
    },
    textWithIcon: {
        display: 'flex',
        alignItems: 'center'
    },
    radio: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        fontWeight: 600,
        fontSize: 20,
    },
    rightText: {
        textAlign: 'right'
    }
}))

type TProps = {
    timeSlot: IServiceValetAppointment|null;
    selected: boolean;
    onSelect: TArgCallback<IServiceValetAppointment|null>;
    date: moment.Moment|null;
}

const mockSlotTime = {
    pickUpMin: "07:00",
    pickUpMax: "09:00",
    dropOffMin: "16:00",
    dropOffMax: "19:00",
}

export const PickUpSlotCard: React.FC<TProps> =({timeSlot, onSelect, selected, date}) => {
    const [timePassed, setTimePassed] = useState<boolean>(false);
    const {dropOffSettings} = useSelector((state: RootState) => state.appointment);
    const classes = useStyles();
    const {t} = useTranslation();

    useEffect(() => {
        if (timeSlot?.date) {
            const [h, m, s] = timeSlot?.pickUpMin.split(":");
            const timeSlotTime = moment(timeSlot.date).set('hour', +h).set('minute', +m).set('second', +s);
            if (moment(timeSlot?.date).isSame(moment(), 'day') && moment(date).isSame(moment(), 'day')) {
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
                { dropOffSettings?.showDropOffTime
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