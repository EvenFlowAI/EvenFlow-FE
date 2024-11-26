import React, {useEffect, useRef, useState} from 'react';
import {IRemappedAppointmentSlot} from "../../../store/reducers/appointment/types";
import {TArgCallback, TParsableDate} from "../../../types/types";
import {useTranslation} from "react-i18next";
import {ReactComponent as ClockIcon} from "../../../assets/img/clock-black.svg";
import {ReactComponent as ClockIconWhite} from "../../../assets/img/clock-white.svg";
import {useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {TSlot} from "../../../features/booking/AppointmentFlow/Screens/AppointmentSlots/types";
import {HtmlTooltip, Wrapper} from "./styles";
import dayjs from "dayjs";
import {IFirstScreenOption} from "../../../store/reducers/serviceTypes/types";

type TProps = {
    timeSlot: TSlot;
    slot?: IRemappedAppointmentSlot;
    selected: boolean;
    onSelect: TArgCallback<IRemappedAppointmentSlot|null>;
    date: TParsableDate;
    selectFirstSlot?: (date?: TParsableDate, newSeviceOption?: IFirstScreenOption) => void;
}

export const TimeSlotCard: React.FC<TProps> =
    ({
         timeSlot,
         slot,
         onSelect,
         selected,
         date,
         selectFirstSlot}) => {
        const {waitListSettings} = useSelector((state: RootState) => state.appointment);
        const [timePassed, setTimePassed] = useState<boolean>(false);
        const {t} = useTranslation();
        const title = t("Expected completion time for your vehicle cannot be provided with Waitlist Only appointments");
        const isOffPeak = Boolean(slot?.price.amountOfSavingMoney);
        const isWaitList = Boolean(slot?.isOverbookingApplied && waitListSettings?.isEnabled);
        const slotRef = useRef<HTMLDivElement|null>(null);

        useEffect(() => {
            if (slot?.date && dayjs(slot?.date).isSame(dayjs.utc(), 'day') && dayjs(date).isSame(dayjs.utc(), 'day')) {
                const differenceInMSeconds = dayjs(dayjs(slot?.date).format('YYYY-MM-DDTHH:mm:ss')).diff(dayjs.utc());
                if (differenceInMSeconds > 0) {
                    setTimeout(() => {
                        setTimePassed(true)
                        selectFirstSlot && selectFirstSlot(date)
                    }, differenceInMSeconds);
                } else {
                    setTimePassed(true);
                    selectFirstSlot && selectFirstSlot(date)
                }
            } else {
                setTimePassed(false);
            }
        }, [slot, date])

        useEffect(() => {
            const rect = slotRef?.current?.getBoundingClientRect()
            const parentHeight = slotRef.current?.parentElement?.clientHeight;
            const parentWidth = slotRef.current?.parentElement?.clientWidth;
            const isVisible = Boolean(rect) && parentHeight && parentWidth && (
                rect?.top && rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= parentHeight &&
                rect.right <= parentWidth
            )
           if (slotRef.current && selected) {
               !isVisible && slotRef.current?.scrollIntoView({behavior: "smooth", block: "center"});
           }

        }, [selected, slot])


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
                id={slot?.id}
                available={Boolean(slot) && !timePassed}
                isWaitList={isWaitList && !timePassed}
                waitListBackground={waitListSettings?.boxHex}
                waitListTextColor={waitListSettings?.textHex}
                selected={selected}
                offPeak={isOffPeak && !timePassed}
                onClick={() => timePassed ? {} : onSelect(slot ?? null)}
            >
                <div ref={slotRef}>{timeSlot.label}</div>
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
                id={slot?.id}
                available={Boolean(slot) && !timePassed}
                isWaitList={isWaitList && !timePassed}
                selected={selected}
                offPeak={isOffPeak && !timePassed}
                onClick={() => timePassed ? {} : onSelect(slot ?? null)}
            >
                <div ref={slotRef}>{timeSlot.label}</div>
                <div className="availability">
                    { selected ? <ClockIconWhite/> : <ClockIcon/>}
                    {getContent(timePassed)}
                </div>
            </Wrapper>
    }