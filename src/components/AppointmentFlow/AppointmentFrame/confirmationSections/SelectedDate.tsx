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
    "& svg": {
        color: "#757575"
    }
})

type TProps = {
    onChangeSlot: TCallback;
}
export const SelectedDate: React.FC<TProps> = ({onChangeSlot}) => {
    const {appointment, serviceValetAppointment} = useSelector((state: RootState) => state.appointment);
    const { dropOffSettings } = useSelector((state: RootState) => state.appointment);
    const {serviceTypeOption} = useSelector((state: RootState) => state.appointmentFrame);
    const {t} = useTranslation();

    const handleChangeSlot = () => {
        onChangeSlot();
    }
    return <div>
        <TitleWrapper>
            <ConfirmationTitle>
                {t("Selected Date & Time")}
            </ConfirmationTitle>
            <Edit fontSize="small" onClick={handleChangeSlot} />
        </TitleWrapper>
        {serviceTypeOption?.type === EServiceType.PickUpDropOff && serviceValetAppointment
            ? <div><span style={{fontWeight: 'bold'}}>{t("Date")}</span>: {moment.utc(serviceValetAppointment?.date).format('MMMM D')}</div>
            : moment.utc(appointment?.date).format('MMMM D, hh:mm A')}
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