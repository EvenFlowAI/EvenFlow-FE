import React, {useMemo} from 'react';
import {AppointmentConfirmationTitle} from "../../../../../components/wrappers/AppointmentConfirmationTitle/AppointmentConfirmationTitle";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../../store/rootReducer";
import {EServiceType} from "../../../../../store/reducers/appointmentFrameReducer/types";
import {useTranslation} from "react-i18next";
import {IFirstScreenOption} from "../../../../../store/reducers/serviceTypes/types";
import {Edit} from "@mui/icons-material";
import {
    setEditingPosition,
    setServiceOptionChanged,
    setShowServiceCentersList,
    setWelcomeScreenView
} from "../../../../../store/reducers/appointmentFrameReducer/actions";
import {useHistory, useParams} from "react-router-dom";
import {TitleWrapper} from "./styles";
import {Routes} from "../../../../../routes/constants";
import {ConfirmationItemWrapper} from "../../../../../components/styled/ConfirmationItemWrapper";

const ServiceTypeManaging = () => {
    const {serviceTypeOption} = useSelector((state: RootState) => state.appointmentFrame);
    const {firstScreenOptions} = useSelector((state: RootState) => state.serviceTypes);
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const history = useHistory();
    const {id} = useParams<{id: string}>();
    const serviceType = useMemo(() => serviceTypeOption ? serviceTypeOption.type : EServiceType.VisitCenter, [serviceTypeOption]);
    const onlyNotVisitCenterExists = firstScreenOptions.length === 1 && firstScreenOptions[0].type !== EServiceType.VisitCenter;

    const getServiceName = (serviceTypeOption: IFirstScreenOption|null, serviceType: EServiceType) => {
        if (serviceTypeOption?.note) return serviceTypeOption.note;
        if (serviceTypeOption?.name) return serviceTypeOption.name;
        switch (serviceType) {
            case EServiceType.MobileService:
                return t("Mobile Service");
            case EServiceType.PickUpDropOff:
                return t("Pick Up / Drop Off");
            default:
                return t("Visit Center");
        }
    }

    const onServiceOptionChange = async () => {
        await dispatch(setEditingPosition('serviceOption'));
        await dispatch(setShowServiceCentersList(false))
        await dispatch(setServiceOptionChanged(false))
        await dispatch(setWelcomeScreenView("serviceSelect"));
        history.push(Routes.EndUser.Welcome + "/" + id + "?frame=1");
    }

    return <ConfirmationItemWrapper>
        <TitleWrapper>
            <AppointmentConfirmationTitle>{serviceTypeOption?.note || serviceTypeOption?.name ? t("Service Option") : t("Location Of Service")}</AppointmentConfirmationTitle>
            {onlyNotVisitCenterExists || firstScreenOptions.length >= 2
                ? <Edit htmlColor="#142EA1" fontSize="small" cursor="pointer" onClick={onServiceOptionChange}/>
            : null}
        </TitleWrapper>
        {getServiceName(serviceTypeOption, serviceType)}
    </ConfirmationItemWrapper>
};

export default ServiceTypeManaging;