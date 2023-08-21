import React from 'react';
import {ConfirmationTitle} from "../Title";
import moment from "moment";
import {Edit} from "@material-ui/icons";
import {styled} from "@material-ui/core";
import {useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {TCallback} from "../../../../types/types";
import {useTranslation} from "react-i18next";
import {EServiceType} from "../../../../store/reducers/appointmentFrameReducer/types";

const TitleWrapper = styled('div')({
    display: "flex",
    alignItems: "center",
    gap: "8px",
    margin: '8px 0',
})

type TProps = {
    onChangeSlot: TCallback;
}
export const SelectedDate: React.FC<TProps> = ({onChangeSlot}) => {
    const {appointment, serviceValetAppointment} = useSelector((state: RootState) => state.appointment);
    const { dropOffSettings, customerLoadedData } = useSelector((state: RootState) => state.appointment);
    const {serviceTypeOption, isAppointmentSaving, appointmentByKey} = useSelector((state: RootState) => state.appointmentFrame);
    const {t} = useTranslation();

    const getDateForUpdate = (): string => {
        if (customerLoadedData?.isUpdating && appointmentByKey) {
            if (appointmentByKey?.serviceTypeOption?.type === EServiceType.PickUpDropOff) {
                return moment.utc(appointmentByKey.dateInUtc).format('ddd, MMMM D')
            } else {
                const [hh, mm] = appointmentByKey.timeSlot.split(':')
                return moment.utc(appointmentByKey.dateInUtc).set('hour', +hh).set('minute', +mm).format('ddd, MMMM D, hh:mm A')
            }
        }
        return ''
    }

    const date = serviceTypeOption?.type === EServiceType.PickUpDropOff && serviceValetAppointment
        ? moment.utc(serviceValetAppointment?.date).format('ddd, MMMM D')
        : customerLoadedData?.isUpdating && appointmentByKey
            ? appointment?.date
                ? moment.utc(appointment?.date).format('ddd, MMMM D, hh:mm A')
                : getDateForUpdate()
            : moment.utc().format('ddd, MMMM D, hh:mm A')

    const handleChangeSlot = () => {
        if (!isAppointmentSaving) onChangeSlot();
    }
    return <div>
        <TitleWrapper>
            <ConfirmationTitle>
                {t("Selected Date & Time")}
            </ConfirmationTitle>
            <Edit htmlColor="#142EA1" fontSize="small" onClick={handleChangeSlot} style={{cursor: "pointer"}}/>
        </TitleWrapper>
        {serviceTypeOption?.type === EServiceType.PickUpDropOff && serviceValetAppointment
            ? <div><span style={{fontWeight: 'bold'}}>{t("Date")}</span>: {date}</div>
            : date}
        {serviceTypeOption?.type === EServiceType.PickUpDropOff && serviceValetAppointment
            ? <div>
                <div>
                    <span style={{fontWeight: 'bold'}}>{t("Pick Up Time")}: </span>
                    <span> {moment.utc(serviceValetAppointment?.pickUpMin, "HH:mm:ss").format('hh:mm A')}</span>
                    <span> {t("to")} </span>
                    <span> {moment.utc(serviceValetAppointment?.pickUpMax, "HH:mm:ss").format('hh:mm A')}</span>
                </div>
                {dropOffSettings?.showDropOffTime && serviceValetAppointment?.dropOffMin && serviceValetAppointment?.dropOffMax
                    ? <div>
                        <span style={{fontWeight: 'bold'}}>{t("Drop Off Time")}: </span>
                        <span> {moment.utc(serviceValetAppointment?.dropOffMin, "HH:mm:ss").format('hh:mm A')}</span>
                        <span> {t("to")} </span>
                        <span> {moment.utc(serviceValetAppointment?.dropOffMax, "HH:mm:ss").format('hh:mm A')}</span>
                    </div>
                    : null}
            </div>
            : null}
    </div>
};