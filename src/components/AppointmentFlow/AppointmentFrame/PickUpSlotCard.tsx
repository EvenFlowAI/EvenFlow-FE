import React, {useEffect, useState} from 'react';
import {IRemappedAppointmentSlot} from "../../../store/reducers/appointment/types";
import {styled, Theme} from "@material-ui/core";
import {TArgCallback} from "../../../types/types";
import moment from "moment";
import {TPickUpSlot, TSlot} from "./AppointmentTimeSelector";
import {useTranslation} from "react-i18next";
import {
    CheckCircleOutlined,
    CloseRounded,
    DeleteOutlineRounded,
    HighlightOff,
    RadioButtonChecked
} from "@material-ui/icons";

type TPickUpSlotsWrapperProps = {
    available?: boolean,
    selected?: boolean,
}

type TSlotsWrapperProps = TPickUpSlotsWrapperProps & {
    offPeak?: boolean,
}

const Wrapper = styled(({available, offPeak, selected, ...props}) => <div {...props}/>)<Theme, TSlotsWrapperProps>(({theme, available, offPeak, selected}) => ({
    display: "flex",
    alignItems: "center",
    fontWeight: "bold",
    textTransform: "uppercase",
    flexDirection: "column",
    gap: "6px",
    opacity: available ? 1 : .3,
    cursor: "pointer",
    '& .availability': {
        border: `1px solid ${(offPeak && selected)
            ? "#237243" : offPeak
                ? "#89E5AB" : selected
                    ? '#000000' : '#DADADA'}`,
        background: selected ? "#000000" : offPeak ? "#DEFFDF" : "transparent",
        padding: 20,
        color: selected ? '#FFFFFF' : theme.palette.text.primary,
        minHeight: 80,
        display: "flex",
        textAlign: "center",
        alignItems: "center",
        justifyContent: "center",
    },
}))

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
        '& .radio': {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        '& .text': {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            fontWeight: 600,
            fontSize: 20,
        }
    },
    '& .availability': {
        padding: '25px 0 46px 50px',
        textTransform: 'uppercase',
        fontSize: 16,
        '& .availability-item': {
            display: 'flex',
            flexDirection: 'column',
        },
    },
    '& .dropOff': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        fontSize: 14,
        color:'#202021',
        paddingRight: 60,
    }
}))

type TProps = {
    timeSlot: TPickUpSlot;
    slot?: IRemappedAppointmentSlot;
    selected: boolean;
    onSelect: TArgCallback<IRemappedAppointmentSlot|null>;
    date: moment.Moment|null;
}

export const PickUpSlotCard: React.FC<TProps> =({timeSlot, slot, onSelect, selected, date}) => {
    const [timePassed, setTimePassed] = useState<boolean>(false);
    const {t} = useTranslation();

    useEffect(() => {
        if (slot?.date && moment(slot?.date).isSame(moment(), 'day') && moment(date).isSame(moment(), 'day')) {
            const differenceInMSeconds = moment(slot?.date.format('YYYY-MM-DDTHH:mm:ss')).diff(moment());
            if (differenceInMSeconds > 0) {
                setTimeout(() => setTimePassed(true), differenceInMSeconds);
            } else {
                setTimePassed(true);
            }
        } else {
            setTimePassed(false);
        }
    }, [slot, date])

    return (
        <PickUpWrapper
            key={moment(timeSlot.date).toISOString()}
            available
            // available={Boolean(slot) && !timePassed}
            selected={selected}
            onClick={() => timePassed ? {} : onSelect(slot ?? null)}
        >
            <div className="pickUp">
                <div className="radio">
                    {selected ? <RadioButtonChecked/> : <RadioButtonChecked/>}
                </div>
                <div className="text">
                    <div>Pick Up Time:</div>
                    <div>
                        {moment(timeSlot.pickUpStart, 'H:mm').format('H:mm A')}
                        <span> to </span>
                        {moment(timeSlot.pickUpEnd, 'H:mm').format('H:mm A')}
                    </div>
                </div>
            </div>
            <div className="availability">
                {timeSlot.available > 0
                    ? <div className="availability-item" style={{color: "#008331"}}>
                        <div>Available <CheckCircleOutlined/> </div>
                        <div>{timeSlot.available} left</div>
                </div>
                    : <div className="availability-item">
                        <div style={{color: '#202021'}}>Not Available <HighlightOff/> </div>
                        <div style={{color: '#DADADA'}}>{timeSlot.available} left</div>
                    </div>
                }
            </div>
            <div className="dropOff">
                <div>
                    Drop Off Time:
                </div>
                <div>
                    {moment(timeSlot.dropOffStart, 'H:mm').format('H:mm A')}
                    <span> to </span>
                    {moment(timeSlot.dropOffEnd, 'H:mm').format('H:mm A')}
                </div>
            </div>
        </PickUpWrapper>
    );
};