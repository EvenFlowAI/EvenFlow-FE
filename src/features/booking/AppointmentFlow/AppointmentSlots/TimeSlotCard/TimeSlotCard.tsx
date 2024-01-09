import React, {useEffect, useState} from 'react';
import {IRemappedAppointmentSlot} from "../../../../../store/reducers/appointment/types";
import {TArgCallback} from "../../../../../types/types";
import moment from "moment";
import {useTranslation} from "react-i18next";
import {ReactComponent as ClockIcon} from "../../../../../assets/img/clock-black.svg";
import {ReactComponent as ClockIconWhite} from "../../../../../assets/img/clock-white.svg";
import {useSelector} from "react-redux";
import {RootState} from "../../../../../store/rootReducer";
import {TSlot} from "../types";
import {HtmlTooltip, Wrapper} from "./styles";

type TProps = {
    timeSlot: TSlot;
    slot?: IRemappedAppointmentSlot;
    selected: boolean;
    onSelect: TArgCallback<IRemappedAppointmentSlot|null>;
    date: moment.Moment|null;
}

export const TimeSlotCard: React.FC<TProps> =({timeSlot, slot, onSelect, selected, date}) => {
    const {waitListSettings} = useSelector((state: RootState) => state.appointment);
    const [timePassed, setTimePassed] = useState<boolean>(false);
    const {t} = useTranslation();
    const title = t("Expected completion time for your vehicle cannot be provided with Waitlist Only appointments");
    const isOffPeak = Boolean(slot?.price.amountOfSavingMoney);
    const isWaitList = Boolean(slot?.isOverbookingApplied && waitListSettings?.isEnabled);

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

    const getContent = (timePassed: boolean): string => {
        if (slot?.isOverbookingApplied && waitListSettings?.isEnabled) {
            return waitListSettings?.text ?? t ("Waitlist only")
        }
        if (!slot || timePassed) {
            return t("Not Available");
        }
        if (slot.price.amountOfSavingMoney) {
            return `${t("Save")} $${slot.price.amountOfSavingMoney}`;
        }
        return t("Available");
    }

    return isWaitList
        ? <Wrapper
                available={Boolean(slot) && !timePassed}
                isWaitList={isWaitList && !timePassed}
                waitListBackground={waitListSettings?.boxHex}
                waitListTextColor={waitListSettings?.textHex}
                selected={selected}
                offPeak={isOffPeak && !timePassed}
                onClick={() => timePassed ? {} : onSelect(slot ?? null)}
            >
                <div>{timeSlot.label}</div>
                <HtmlTooltip
                    title={waitListSettings?.rolloverText ?? title}
                    placement="right"
                    id={slot?.time}
                    enterDelay={0}
                    enterNextDelay={0}
                    enterTouchDelay={0}>
                <div className="availability">
                    <ClockIcon/>
                    {getContent(timePassed)}
                </div>
                </HtmlTooltip>
            </Wrapper>
        : <Wrapper
            available={Boolean(slot) && !timePassed}
            isWaitList={isWaitList && !timePassed}
            selected={selected}
            offPeak={isOffPeak && !timePassed}
            onClick={() => timePassed ? {} : onSelect(slot ?? null)}
        >
            <div>{timeSlot.label}</div>
            <div className="availability">
                { selected ? <ClockIconWhite/> : <ClockIcon/>}
                {getContent(timePassed)}
            </div>
        </Wrapper>
};