import React, {useEffect} from 'react';
import {ConfirmationTitle} from "../Title";
import {styled} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../../store/rootReducer";
import {useTranslation} from "react-i18next";
import {Edit} from "@material-ui/icons";
import {
    setAdvisor,
    setCurrentFrameScreen,
    setEditingPosition, setServiceOptionChanged
} from "../../../../../store/reducers/appointmentFrameReducer/actions";

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
        advisor,
        isAnyAdvisorSelected,
        transportation,
        serviceTypeOption,
        currentConfig,
        isTransportationAvailable,
        isAdvisorAvailable,
        consultants,
        appointmentByKey
    ] = useSelector((state: RootState) => [
        state.appointmentFrame.advisor,
        state.appointmentFrame.isAnyAdvisorSelected,
        state.appointmentFrame.transportation,
        state.appointmentFrame.serviceTypeOption,
        state.bookingFlowConfig.currentConfig,
        state.bookingFlowConfig.isTransportationAvailable,
        state.bookingFlowConfig.isAdvisorAvailable,
        state.appointmentFrame.consultants,
        state.appointmentFrame.appointmentByKey,
    ]);
    const {t} = useTranslation();
    const transportationSelected = serviceTypeOption?.transportationOption || transportation;
    const dispatch = useDispatch();

    useEffect(() => {
        if (!advisor && !appointmentByKey?.advisor?.isAnySelected && !isAnyAdvisorSelected) {
            const selectedPreviouslyConsultant = appointmentByKey?.advisor?.id
                ? consultants.find(item => item.id === appointmentByKey?.advisor?.id)
                : undefined
            selectedPreviouslyConsultant && dispatch(setAdvisor(selectedPreviouslyConsultant))
        }
    }, [appointmentByKey, consultants, advisor, isAnyAdvisorSelected])

    const handleChangeAdvisor = () => {
        dispatch(setServiceOptionChanged(false))
        dispatch(setEditingPosition('advisor'));
        dispatch(setCurrentFrameScreen("consultantSelection"));
    }

    const handleChangeTransportation = () => {
        dispatch(setServiceOptionChanged(false))
        dispatch(setEditingPosition('transportation'));
        dispatch(setCurrentFrameScreen("transportationNeeds"));
    }

    return (
        <div>
            <ConfirmationTitle>{t("Appointment Details")}</ConfirmationTitle>
            <Wrapper>
                {transportationSelected
                    ? <li style={{display: "flex"}}>Transportation needs: {transportationSelected?.description}
                        {isTransportationAvailable ? <Edit htmlColor="#142EA1" fontSize="small" onClick={handleChangeTransportation} style={{cursor: "pointer"}}/> : null}
                    </li>
                    : null}
                {currentConfig?.advisorSelection
                    ? <li style={{display: "flex"}}>{t("Service Advisor")}: {advisor?.name ?? t("Any Available")}
                        {isAdvisorAvailable ? <Edit htmlColor="#142EA1" fontSize="small" onClick={handleChangeAdvisor} style={{cursor: "pointer"}}/> : null}
                </li>
                    : null
                }
            </Wrapper>
        </div>
    );
};