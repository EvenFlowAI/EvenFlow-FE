import React, {useMemo} from 'react';
import {ConfirmationTitle} from "../../AppointmentFrame/Title";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../../store/rootReducer";
import {EServiceType} from "../../../../../store/reducers/appointmentFrameReducer/types";
import {useTranslation} from "react-i18next";
import {Edit} from "@material-ui/icons";
import {
    setCurrentFrameScreen,
    setEditingPosition,
    setServiceOptionChanged
} from "../../../../../store/reducers/appointmentFrameReducer/actions";
import {List, TitleWrapper} from "./styles";

const AddressManaging = () => {
    const {address, zipCode, serviceTypeOption} = useSelector((state: RootState) => state.appointmentFrame);
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const serviceType = useMemo(() => serviceTypeOption ? serviceTypeOption.type : EServiceType.VisitCenter, [serviceTypeOption]);

    const handleChangeAddress = () => {
        dispatch(setServiceOptionChanged(false))
        dispatch(setEditingPosition('address'));
        dispatch(setCurrentFrameScreen("location"));
    }

    return address && (serviceType === EServiceType.MobileService || serviceType === EServiceType.PickUpDropOff)
        ? <div>
            <TitleWrapper>
                <ConfirmationTitle>
                    {serviceType === EServiceType.MobileService ? t("Service Address") : t("Pick Up Address")}
                </ConfirmationTitle>
                <Edit htmlColor="#142EA1" fontSize="small" onClick={handleChangeAddress} style={{cursor: "pointer"}}/>
            </TitleWrapper>
            <List>
                <li className="service-item">
                    <div>{typeof address === 'string' ? address : address?.label || ""}</div>
                    <div>{t("ZIP")}: {zipCode}</div>
                </li>
            </List>
        </div>
        : null;
};

export default AddressManaging;