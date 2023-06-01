import React, {useMemo} from 'react';
import {ConfirmationTitle} from "../Title";
import {styled} from "@material-ui/core";
import {useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {useTranslation} from "react-i18next";
import {EServiceType} from "../../../../store/reducers/appointmentFrameReducer/types";

const Wrapper = styled('ul')({
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    flexDirection: "column",
    gap: "12px",
    margin: "12px 0 0",
    padding: 0,
    listStyle: "none",
    "& .service-item": {
        textTransform: "capitalize"
    }
});

export const Review = () => {
    const [
        consultant,
        transportation,
        config,
        serviceTypeOption
    ] = useSelector((state: RootState) => [
        state.appointmentFrame.advisor,
        state.appointmentFrame.transportation,
        state.bookingFlowConfig.config,
        state.appointmentFrame.serviceTypeOption,
    ]);
    const serviceType = useMemo(() => serviceTypeOption?.type ?? EServiceType.VisitCenter, [serviceTypeOption]);
    const currentConfig = useMemo(() => {
        return config.find(item => item.serviceType.toString() === serviceType.toString());
    }, [config, serviceType])
    const {t} = useTranslation();
    const transportationSelected = serviceTypeOption?.transportationOption || transportation;

    return (
        <div>
            <ConfirmationTitle>{t("Appointment Details")}</ConfirmationTitle>
            <Wrapper>
                {transportationSelected
                    ? <li>Transportation needs: {transportationSelected?.description}</li>
                    : null}
                {currentConfig?.advisorSelection
                    ? <li>{t("Service Advisor")}: {consultant?.name ?? t("Any Available")}</li>
                    : null
                }
            </Wrapper>
        </div>
    );
};