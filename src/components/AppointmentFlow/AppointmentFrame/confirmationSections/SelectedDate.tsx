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
    const {serviceTypeOption} = useSelector((state: RootState) => state.appointmentFrame);
    const {t} = useTranslation();

    const handleChangeSlot = () => {
        onChangeSlot();
    }
    return <div>
        <TitleWrapper>
            <ConfirmationTitle>
                {serviceTypeOption?.type === EServiceType.PikUpDropOff ? t("Selected Date") : t("Selected Date & Time")}
            </ConfirmationTitle>
            <Edit fontSize="small" onClick={handleChangeSlot} />
        </TitleWrapper>
        {serviceTypeOption?.type === EServiceType.PikUpDropOff && serviceValetAppointment
            ? moment.utc(serviceValetAppointment?.date).format('MMMM D')
            : moment.utc(appointment?.date).format('MMMM D, h:mm A')}
    </div>
};