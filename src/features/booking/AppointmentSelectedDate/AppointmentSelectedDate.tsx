import React, {useEffect, useState} from 'react';
import {AppointmentConfirmationTitle} from "../../../components/wrappers/AppointmentConfirmationTitle/AppointmentConfirmationTitle";
import moment from "moment";
import {Edit} from "@mui/icons-material";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {TCallback} from "../../../types/types";
import {useTranslation} from "react-i18next";
import {EServiceType} from "../../../store/reducers/appointmentFrameReducer/types";
import {
    setEditingPosition,
    setServiceOptionChanged
} from "../../../store/reducers/appointmentFrameReducer/actions";
import {TServiceValetSlot} from "../../../api/types";
import {TitleWrapper} from "./styles";
import dayjs from "dayjs";

type TProps = {
    onChangeSlot: TCallback;
}

export const AppointmentSelectedDate: React.FC<React.PropsWithChildren<React.PropsWithChildren<TProps>>> = ({onChangeSlot}) => {
    const {appointment, serviceValetAppointment, waitListSettings} = useSelector((state: RootState) => state.appointment);
    const { dropOffSettings, customerLoadedData } = useSelector((state: RootState) => state.appointment);
    const {serviceTypeOption, isAppointmentSaving, appointmentByKey} = useSelector((state: RootState) => state.appointmentFrame);
    const [serviceValetTime, setServiceValetTime] = useState<TServiceValetSlot|null>(null);
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const isWaitList = appointment
        ? appointment?.isOverbookingApplied && waitListSettings?.isEnabled
        : appointmentByKey?.isWaitlist && waitListSettings?.isEnabled;

    useEffect(() => {
        if (serviceValetAppointment) {
            setServiceValetTime({
                pickUpMin: serviceValetAppointment.pickUpMin,
                pickUpMax: serviceValetAppointment.pickUpMax,
                dropOffMin: serviceValetAppointment.dropOffMin,
                dropOffMax: serviceValetAppointment.dropOffMax,
            })
        } else if (appointmentByKey?.serviceValetTime) {
            const {serviceValetTime} = appointmentByKey;
            setServiceValetTime({
                pickUpMin: serviceValetTime.pickUpMin,
                pickUpMax: serviceValetTime.pickUpMax,
                dropOffMin: serviceValetTime.dropOffMin,
                dropOffMax: serviceValetTime.dropOffMax,
            })
        }
    }, [serviceValetAppointment, appointmentByKey])

    const getDateForUpdate = (): string => {
        if (customerLoadedData?.isUpdating && appointmentByKey) {
            if (appointmentByKey?.serviceTypeOption?.type === EServiceType.PickUpDropOff) {
                return dayjs.utc(appointmentByKey.dateInUtc).format('ddd, MMMM D')
            } else {
                const [hh, mm] = appointmentByKey.timeSlot.split(':')
                return dayjs.utc(appointmentByKey.dateInUtc).set('hour', +hh).set('minute', +mm).format('ddd, MMMM D, hh:mm A')
            }
        }
        return ''
    }

    const date = serviceTypeOption?.type === EServiceType.PickUpDropOff && serviceValetAppointment
        ? dayjs.utc(serviceValetAppointment?.date).format('ddd, MMMM D')
        : customerLoadedData?.isUpdating && appointmentByKey
            ? appointment?.date
                ? dayjs.utc(appointment?.date).format('ddd, MMMM D, hh:mm A')
                : getDateForUpdate()
            : dayjs.utc(appointment?.date).format('ddd, MMMM D, hh:mm A')

    const handleChangeSlot = () => {
        if (customerLoadedData?.isUpdating) {
            dispatch(setEditingPosition('slot'))
            dispatch(setServiceOptionChanged(false))
        }
        if (!isAppointmentSaving) onChangeSlot();
    }
    return <div>
        <TitleWrapper>
            <AppointmentConfirmationTitle>
                {t("Selected Date & Time")}
            </AppointmentConfirmationTitle>
            <Edit htmlColor="#142EA1" fontSize="small" onClick={handleChangeSlot} style={{cursor: "pointer"}}/>
        </TitleWrapper>
        {serviceTypeOption?.type === EServiceType.PickUpDropOff && serviceValetAppointment
            ? <div><span style={{fontWeight: 'bold'}}>{t("Date")}</span>: {date}</div>
            : date}
        {serviceTypeOption?.type === EServiceType.PickUpDropOff && (serviceValetAppointment || appointmentByKey?.serviceValetTime)
            ? <div>
                <div>
                    <span style={{fontWeight: 'bold'}}>{t("Pick Up Time")}: </span>
                    <span> {moment.utc(serviceValetTime?.pickUpMin, "HH:mm:ss").format('hh:mm A')}</span>
                    <span> {t("to")} </span>
                    <span> {moment.utc(serviceValetTime?.pickUpMax, "HH:mm:ss").format('hh:mm A')}</span>
                </div>
                {dropOffSettings?.showDropOffTime && serviceValetTime?.dropOffMin && serviceValetTime?.dropOffMax
                    ? <div>
                        <span style={{fontWeight: 'bold'}}>{t("Drop Off Time")}: </span>
                        <span> {moment.utc(serviceValetTime?.dropOffMin, "HH:mm:ss").format('hh:mm A')}</span>
                        <span> {t("to")} </span>
                        <span> {moment.utc(serviceValetTime?.dropOffMax, "HH:mm:ss").format('hh:mm A')}</span>
                    </div>
                    : null}
            </div>
            : null}
        {isWaitList
            ? <div style={{color: waitListSettings?.textHex
                    ? `#${waitListSettings?.textHex}`
                    : "#CE690B", marginTop: 8}}>
                {waitListSettings?.text ?? t("Waitlist only")}
        </div>
            : null}
    </div>
};