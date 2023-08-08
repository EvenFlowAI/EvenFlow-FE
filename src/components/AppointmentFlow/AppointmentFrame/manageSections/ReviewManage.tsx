import React from 'react';
import {ConfirmationTitle} from "../Title";
import {styled} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {useTranslation} from "react-i18next";
import {Edit} from "@material-ui/icons";
import {setCurrentFrameScreen} from "../../../../store/reducers/appointmentFrameReducer/actions";

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

export const ReviewManage = () => {
    const [
        consultant,
        transportation,
        serviceTypeOption,
        currentConfig,
        isTransportationAvailable,
        isAdvisorAvailable,
    ] = useSelector((state: RootState) => [
        state.appointmentFrame.advisor,
        state.appointmentFrame.transportation,
        state.appointmentFrame.serviceTypeOption,
        state.bookingFlowConfig.currentConfig,
        state.bookingFlowConfig.isTransportationAvailable,
        state.bookingFlowConfig.isAdvisorAvailable,
    ]);
    const {t} = useTranslation();
    const transportationSelected = serviceTypeOption?.transportationOption || transportation;
    const dispatch = useDispatch();

    const handleChangeAdvisor = () => {
        dispatch(setCurrentFrameScreen("consultantSelection"));
    }

    const handleChangeTransportation = () => {
        dispatch(setCurrentFrameScreen("transportationNeeds"));
    }

    return (
        <div>
            <ConfirmationTitle>{t("Appointment Details")}</ConfirmationTitle>
            <Wrapper>
                {transportationSelected
                    ? <li>Transportation needs: {transportationSelected?.description}
                        {isTransportationAvailable ? <Edit fontSize="small" onClick={handleChangeTransportation} style={{cursor: "pointer"}}/> : null}
                    </li>
                    : null}
                {currentConfig?.advisorSelection
                    ? <li>{t("Service Advisor")}: {consultant?.name ?? t("Any Available")}
                        {isAdvisorAvailable ? <Edit fontSize="small" onClick={handleChangeAdvisor} style={{cursor: "pointer"}}/> : null}
                </li>
                    : null
                }
            </Wrapper>
        </div>
    );
};