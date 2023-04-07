import React, {useMemo} from 'react';
import {ConfirmationTitle} from "../Title";
import {styled} from "@material-ui/core";
import {useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {useTranslation} from "react-i18next";

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
        serviceType,
        consultants,
        config
    ] = useSelector((state: RootState) => [
        state.appointmentFrame.advisor,
        state.appointmentFrame.transportation,
        state.appointmentFrame.serviceType,
        state.appointmentFrame.consultants,
        state.bookingFlowConfig.config,
    ]);
    const currentConfig = useMemo(() => {
        return config.find(item => item.serviceType.toString() === serviceType.toString());
    }, [config, serviceType])
    const {t} = useTranslation();

    // const TRANSPORTATION_SHORT_DESCRIPTION = [
    //     t("I will take the shuttle"),
    //     t("I would like a loaner vehicle"),
    //     t("I would like a rental car"),
    //     t("I would like you to book me a ride"),
    // ]
    // const LOCAL_TRANSPORTATION_SHORT_DESCRIPTION = [
    //     t("I will wait at the dealership"),
    //     t("I will drop off my vehicle and have a ride"),
    // ]

    return (
        <div>
            <ConfirmationTitle>{t("Appointment Details")}</ConfirmationTitle>
            <Wrapper>
                <li>Transportation needs: {transportation?.description}
                </li>
                {currentConfig?.advisorSelection && consultants.length
                    ? <li>{t("Service Advisor")}: {consultant?.name ?? t("Any Available")}</li>
                    : null
                }
            </Wrapper>
        </div>
    );
};