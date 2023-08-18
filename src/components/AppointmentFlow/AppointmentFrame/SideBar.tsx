import React, {useCallback, useEffect, useMemo} from 'react';
import {Button, styled, useMediaQuery, useTheme} from "@material-ui/core";
import {TScreen} from "../../Layout/types";
import {ProgressStepper} from "../ProgressStepper";
import {
    setAdditionalServicesChosen, setSideBarActualSteps, setSideBarMenu,
    setSideBarSteps, setSideBarStepsList
} from "../../../store/reducers/appointmentFrameReducer/actions";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {useTranslation} from "react-i18next";
import {getCurrentMenu, getStepsMap, getStepsScreen} from "./utils";
import {Loading} from "../../UI/Loading";
import {EServiceType} from "../../../store/reducers/appointmentFrameReducer/types";

const Wrapper = styled('ul')(({theme}) => ({
    listStyle: "none",
    margin: 0,
    padding: 0,
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    alignItems: "stretch",
    justifyContent: "center",
    "& button": {
        justifyContent: "flex-start",
        textAlign: "left",
        fontSize: 18,
        textTransform: "none"
    },
    [theme.breakpoints.down("sm")]: {
        marginBottom: "auto"
    }
}));

const Index = styled('span')({
    fontSize: 32,
    display: "inline-block",
    paddingRight: 8,
    minWidth: 28
});

const MobileWrapper = styled('div')({

});

type TStepProps = {
    active: number;
    steps: number;
    currentLabel: string;
    nextLabel?: string;
}

const MobileSteps: React.FC<TStepProps> = ({active, steps, currentLabel, nextLabel}) => {
    return <MobileWrapper>
        <ProgressStepper
            steps={steps}
            activeStep={active}
            label={currentLabel}
            nextLabel={nextLabel}
        />
    </MobileWrapper>;
}

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
        isAppointmentSaving
    } = useSelector((state: RootState) => state.appointmentFrame);
    const {currentConfig, isAdvisorAvailable, isAppointmentTimingAvailable, isTransportationAvailable} = useSelector((state: RootState) => state.bookingFlowConfig);
    const theme = useTheme();
    const dispatch = useDispatch();
    const isSm = useMediaQuery(theme.breakpoints.down('sm'));
    const {t} = useTranslation();

    const serviceType = useMemo(() => serviceTypeOption ? serviceTypeOption.type : EServiceType.VisitCenter, [serviceTypeOption]);

    useEffect(() => {
        dispatch(setSideBarMenu(getCurrentMenu(serviceType, isAdvisorAvailable, isTransportationAvailable)))
    }, [serviceType, isAdvisorAvailable, isTransportationAvailable, getCurrentMenu])

    useEffect(() => {
        dispatch(setSideBarActualSteps(getStepsMap(serviceType, isAdvisorAvailable, isAppointmentTimingAvailable, isTransportationAvailable)))
        dispatch(setSideBarStepsList(getStepsScreen(serviceType, isAdvisorAvailable, isAppointmentTimingAvailable, isTransportationAvailable)))
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
        if (isAppointmentSaving) return true;
        if (index > 0 && sideBarSteps.length < 2) return true;
        if (sideBarActualSteps) {
            const currentScreenNumberValue = sideBarActualSteps[screen];
            const lastStep = sideBarSteps[sideBarSteps.length - 2]
            const lastPassedScreenNumberValue = sideBarActualSteps[lastStep];
            return (currentScreenNumberValue < index + 1 && lastPassedScreenNumberValue < index + 1);
        }
        return false;
    }, [serviceType, isAdvisorAvailable, isAppointmentTimingAvailable, isTransportationAvailable, sideBarSteps, sideBarActualSteps, screen, isAppointmentSaving])

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