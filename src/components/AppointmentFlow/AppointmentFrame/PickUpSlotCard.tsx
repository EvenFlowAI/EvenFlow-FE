import React, {useEffect, useState} from 'react';
import {IRemappedAppointmentSlot} from "../../../store/reducers/appointment/types";
import {styled, Theme} from "@material-ui/core";
import {TArgCallback} from "../../../types/types";
import moment from "moment";
import {TPickUpSlot} from "./AppointmentTimeSelector";
import {useTranslation} from "react-i18next";
import {
    CheckCircleOutlined,
    HighlightOff,
    RadioButtonChecked,
    RadioButtonUnchecked
} from "@material-ui/icons";

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
    '& .right-part': {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        [theme.breakpoints.down("sm")]: {
            gap: 8,
        },
        '& .availability': {
            padding: '25px 0 46px 16px',
            textTransform: 'uppercase',
            fontSize: 16,
            [theme.breakpoints.up("md")]: {
                padding: '25px 0 46px 50px',
            },
            '& .availability-item': {
                display: 'flex',
                flexDirection: 'column',
                '& .textWithIcon': {
                    display: 'flex',
                    alignItems: 'center'
                },
            },
        },
        '& .dropOff': {
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
        }
    },
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
            available={true}
            // available={Boolean(slot) && !timePassed}
            selected={false}
            // selected={selected}
            onClick={() => timePassed ? {} : onSelect(slot ?? null)}
        >
            <div className="pickUp">
                <div className="radio">
                    {!selected ? <RadioButtonChecked/> : <RadioButtonUnchecked/>}
                </div>
                <div className="text">
                    <div>{t("Pick Up Time")}:</div>
                    <div>
                        {moment(timeSlot.pickUpStart, 'H:mm').format('H:mm A')}
                        <span> {t("to")} </span>
                        {moment(timeSlot.pickUpEnd, 'H:mm').format('H:mm A')}
                    </div>
                </div>
            </div>
            <div className="right-part">
                <div className="availability">
                    {timeSlot.available > 0
                        ? <div className="availability-item" style={{color: "#008331"}}>
                            <div className="textWithIcon">{t("Available")}   <CheckCircleOutlined style={{marginLeft: 8}}/> </div>
                            <div>{timeSlot.available} {t("left")}</div>
                        </div>
                        : <div className="availability-item">
                            <div className="textWithIcon" style={{color: '#202021'}}>{t("Not Available")}   <HighlightOff style={{marginLeft: 8}}/> </div>
                            <div className="textWithIcon" style={{color: '#DADADA'}}>{timeSlot.available} {t("left")}</div>
                        </div>
                    }
                </div>
                <div className="dropOff">
                    <div>{t("Drop Off Time")}:</div>
                    <div style={{textAlign: 'right'}}>
                        {moment(timeSlot.dropOffStart, 'H:mm').format('H:mm A')}
                        <span> {t("to")} </span>
                        {moment(timeSlot.dropOffEnd, 'H:mm').format('H:mm A')}
                    </div>
                </div>
            </div>
        </PickUpWrapper>
    );
};