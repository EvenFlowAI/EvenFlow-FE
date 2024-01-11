import React, {useCallback, useEffect, useMemo} from 'react';
import {Button, useMediaQuery, useTheme} from "@mui/material";
import {
    setAdditionalServicesChosen,
    setSideBarActualSteps,
    setSideBarMenu,
    setSideBarSteps,
    setSideBarStepsList
} from "../../../store/reducers/appointmentFrameReducer/actions";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {useTranslation} from "react-i18next";
import {getCurrentMenu, getStepsMap, getStepsScreen} from "../AppointmentFlow/utils";
import {Loading} from "../../../components/wrappers/Loading/Loading";
import {EServiceType} from "../../../store/reducers/appointmentFrameReducer/types";
import {TScreen} from "../../../types/types";
import {MobileSteps} from "./MobileSteps/MobileSteps";
import {Index, Wrapper} from "./styles";

type TProps = {
    screen: TScreen;
    handleSetScreen: (screen: TScreen) => void;
}

export const SideBar: React.FC<TProps> = ({screen, handleSetScreen}) => {
    const {
        sideBarSteps,
        sideBarMenu,
        sideBarActualSteps,
        sideBarStepsList,
        serviceTypeOption,
        isAppointmentSaving,
    } = useSelector((state: RootState) => state.appointmentFrame);
    const {customerLoadedData} = useSelector((state: RootState) => state.appointment);
    const {currentConfig, isAdvisorAvailable, isAppointmentTimingAvailable, isTransportationAvailable} = useSelector((state: RootState) => state.bookingFlowConfig);
    const theme = useTheme();
    const dispatch = useDispatch();
    const isSm = useMediaQuery(theme.breakpoints.down('md'));
    const {t} = useTranslation();

    const serviceType = useMemo(() => serviceTypeOption ? serviceTypeOption.type : EServiceType.VisitCenter, [serviceTypeOption]);

    useEffect(() => {
        dispatch(setSideBarMenu(getCurrentMenu(serviceType, isAdvisorAvailable, isTransportationAvailable, Boolean(customerLoadedData?.isUpdating))))
    }, [serviceType, isAdvisorAvailable, isTransportationAvailable, getCurrentMenu])

    useEffect(() => {
        dispatch(setSideBarActualSteps(getStepsMap(serviceType, isAdvisorAvailable, isAppointmentTimingAvailable, isTransportationAvailable)))
        dispatch(setSideBarStepsList(getStepsScreen(serviceType, isAdvisorAvailable, isAppointmentTimingAvailable, isTransportationAvailable, Boolean(customerLoadedData?.isUpdating))))
    }, [serviceType, isAdvisorAvailable, isAppointmentTimingAvailable, isTransportationAvailable, getStepsMap])

    useEffect(() => {
        dispatch(setSideBarSteps(Array.from(new Set([...sideBarSteps, screen]))));
    }, [screen, dispatch, setSideBarSteps])

    const getStepsState = useCallback((idx: number): boolean => {
        return !!sideBarActualSteps && sideBarActualSteps[screen] === idx
    }, [sideBarActualSteps, screen])

    const onClick = (idx: number) => {
        if (sideBarStepsList) {
            handleSetScreen(sideBarStepsList[idx]);
            if (idx === 0) dispatch(setAdditionalServicesChosen(true));
        }
    }

    const getButtonState = useCallback((index: number) => {
        if (isAppointmentSaving || customerLoadedData?.isUpdating) return true;
        if (index > 0 && sideBarSteps.length < 2) return true;
        if (sideBarActualSteps) {
            const currentScreenNumberValue = sideBarActualSteps[screen];
            const lastStep = sideBarSteps[sideBarSteps.length - 2]
            const lastPassedScreenNumberValue = lastStep === 'manageAppointment' ? 0 : sideBarActualSteps[lastStep];
            return (currentScreenNumberValue < index + 1 && lastPassedScreenNumberValue < index + 1);
        }
        return false;
    }, [customerLoadedData, serviceType, isAdvisorAvailable, isAppointmentTimingAvailable, isTransportationAvailable, sideBarSteps, sideBarActualSteps, screen, isAppointmentSaving])

    const activeButtonStyles = {
        background: '#E6FCEC',
        color: '#202021',
        border: '1px solid #202021'
    }

    return (
        <Wrapper>
            {!isSm
                ? currentConfig && sideBarActualSteps
                    ? sideBarMenu.map((item, idx) => {
                        return <li key={item}>
                            <Button
                                fullWidth
                                disabled={getButtonState(idx)}
                                onClick={() => onClick(idx)}
                                color="primary"
                                style={!getButtonState(idx) && !getStepsState(idx+1) ? activeButtonStyles : {}}
                                variant={getStepsState(idx+1) ? "contained" : "outlined"}>
                                <Index>{idx + 1}</Index> {t(item)}
                            </Button>
                        </li>
                    })
                    : <Loading/>
                : sideBarActualSteps
                    ? <MobileSteps
                        active={sideBarActualSteps[screen]}
                        steps={sideBarMenu.length}
                        currentLabel={sideBarMenu[sideBarActualSteps[screen]-1]}
                        nextLabel={sideBarMenu[sideBarActualSteps[screen]]}
                    />
                    : <Loading/>}
        </Wrapper>
    );
};