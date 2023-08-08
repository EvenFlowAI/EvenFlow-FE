import React, {useMemo} from 'react';
import {styled} from "@material-ui/core";
import {ConfirmationTitle} from "../Title";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {EServiceType} from "../../../../store/reducers/appointmentFrameReducer/types";
import {useTranslation} from "react-i18next";
import {IFirstScreenOption} from "../../../../store/reducers/serviceTypes/types";
import {Edit} from "@material-ui/icons";
import {
    setShowServiceCentersList,
    setWelcomeScreenView
} from "../../../../store/reducers/appointmentFrameReducer/actions";
import {Routes} from "../../../../config/routes";
import {useHistory, useParams} from "react-router-dom";

const TitleWrapper = styled('div')({
    display: "flex",
    alignItems: "center",
    gap: "8px",
    margin: '8px 0',
});

const ServiceTypeManage = () => {
    const {serviceTypeOption} = useSelector((state: RootState) => state.appointmentFrame);
    const {firstScreenOptions} = useSelector((state: RootState) => state.serviceTypes);
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const history = useHistory();
    const {id} = useParams();
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
        await dispatch(setShowServiceCentersList(false))
        await dispatch(setWelcomeScreenView("serviceSelect"));
        history.push(Routes.EndUser.Welcome + "/" + id + "?frame=1");
    }

    return <div>
        <TitleWrapper>
            <ConfirmationTitle>{serviceTypeOption?.note || serviceTypeOption?.name ? t("Service Option") : t("Location Of Service")}</ConfirmationTitle>
            {onlyNotVisitCenterExists || firstScreenOptions.length > 2
                ? <Edit fontSize="small" cursor="pointer" onClick={onServiceOptionChange}/>
            : null}
        </TitleWrapper>
        {getServiceName(serviceTypeOption, serviceType)}
    </div>
};

export default ServiceTypeManage;