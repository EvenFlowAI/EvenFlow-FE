import React, {useCallback, useEffect, useMemo} from 'react';
import {Button, styled, useMediaQuery, useTheme} from "@material-ui/core";
import {TScreen} from "../../Layout/types";
import {ProgressStepper} from "../ProgressStepper";
import {setAdditionalServicesChosen, setSideBarSteps} from "../../../store/reducers/appointmentFrameReducer/actions";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {useTranslation} from "react-i18next";
import {getCurrentMenu, getStepsMap, getStepsScreen} from "./utils";
import {Loading} from "../../UI/Loading";

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
    const {serviceType, sideBarSteps} = useSelector((state: RootState) => state.appointmentFrame);
    const {config} = useSelector((state: RootState) => state.bookingFlowConfig);
    const theme = useTheme();
    const dispatch = useDispatch();
    const isSm = useMediaQuery(theme.breakpoints.down('sm'));
    const {t} = useTranslation();

    const currentConfig = useMemo(() => {
        return config.find(item => item.serviceType.toString() === serviceType.toString());
    }, [config, serviceType]);
    const advisorSelection = useMemo(() => Boolean(currentConfig?.advisorSelection), [currentConfig]);
    const appointmentSelection = useMemo(() => Boolean(currentConfig?.appointmentSelection), [currentConfig]);
    const transportationNeeds = useMemo(() => Boolean(currentConfig?.transportationNeeds), [currentConfig]);
    const currentMenu = useMemo(() => getCurrentMenu(serviceType, advisorSelection, transportationNeeds),
        [serviceType, advisorSelection, transportationNeeds]);
    const currentSteps = useMemo(() => getStepsMap(serviceType, advisorSelection, appointmentSelection, transportationNeeds),
        [serviceType, advisorSelection, appointmentSelection, transportationNeeds]);

    useEffect(() => {
        dispatch(setSideBarSteps(Array.from(new Set([...sideBarSteps, screen]))));
    }, [screen, dispatch, setSideBarSteps])

    const getStepsState = useCallback((idx: number): boolean => {
        return getStepsMap(serviceType, advisorSelection, appointmentSelection, transportationNeeds)[screen] === idx
    }, [serviceType, screen, advisorSelection, appointmentSelection, transportationNeeds])

    const onClick = (idx: number) => {
        const screen: TScreen = getStepsScreen(serviceType, advisorSelection, appointmentSelection, transportationNeeds)[idx];
        handleSetScreen(screen);
        if (idx === 0) dispatch(setAdditionalServicesChosen(true));
    }

    const getButtonState = useCallback((index: number) => {
        if (index > 0 && sideBarSteps.length < 2) return true;
        const usualSteps = getStepsMap(serviceType, advisorSelection, appointmentSelection, transportationNeeds);
        return (usualSteps[screen] < index + 1 && usualSteps[sideBarSteps[sideBarSteps.length - 1]] < index + 1);
    }, [serviceType, advisorSelection, appointmentSelection, transportationNeeds, sideBarSteps])

    const activeButtonStyles = {
        background: '#E6FCEC',
        color: '#202021',
        border: '1px solid #202021'
    }

    return (
        <Wrapper>
            {!isSm
                ? currentConfig && currentSteps
                    ? currentMenu.map((item, idx) => {
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
                : <MobileSteps
                    active={currentSteps[screen]}
                    steps={currentMenu.length}
                    currentLabel={currentMenu[currentSteps[screen]-1]}
                    nextLabel={currentMenu[currentSteps[screen]]}
                />}
        </Wrapper>
    );
};