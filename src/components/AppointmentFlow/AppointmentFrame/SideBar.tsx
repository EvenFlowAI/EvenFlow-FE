import React, {useCallback, useEffect, useMemo} from 'react';
import {Button, styled, useMediaQuery, useTheme} from "@material-ui/core";
import {TScreen} from "../../Layout/types";
import {ProgressStepper} from "../ProgressStepper";
import {setAdditionalServicesChosen, setSideBarSteps} from "../../../store/reducers/appointmentFrameReducer/actions";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
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

const stepsMap: {[K in TScreen]: number} = {
    carSelection: 0,
    serviceNeeds: 1,
    maintenanceDetails: 1,
    serviceSelection: 1,
    packageSelection: 1,
    describeMore: 1,
    opsCode: 1,
    vehicleData: 1,
    carDetails: 1,
    consultantSelection: 2,
    appointmentTiming: 3,
    appointmentSelection: 3,
    transportationNeeds: 4,
    appointmentConfirmation: 5,
    appointmentConfirmed: 5,
    location: 1,
}

const mobileStepsMap: {[K in TScreen]: number} = {
    carSelection: 0,
    serviceNeeds: 2,
    maintenanceDetails: 2,
    serviceSelection: 2,
    packageSelection: 2,
    describeMore: 2,
    opsCode: 2,
    vehicleData: 2,
    carDetails: 2,
    appointmentTiming: 3,
    appointmentSelection: 3,
    appointmentConfirmation: 4,
    appointmentConfirmed: 4,
    location: 1,
    transportationNeeds: -1,
    consultantSelection: -1,
}

const pickUpDropOffStepsMap: {[K in TScreen]: number} = {
    carSelection: 0,
    serviceNeeds: 2,
    maintenanceDetails: 2,
    serviceSelection: 2,
    packageSelection: 2,
    describeMore: 2,
    opsCode: 2,
    vehicleData: 2,
    carDetails: 2,
    consultantSelection: 3,
    appointmentTiming: 4,
    appointmentSelection: 4,
    appointmentConfirmation: 5,
    appointmentConfirmed: 5,
    location: 1,
    transportationNeeds: -1,
}

const Index = styled('span')({
    fontSize: 32,
    display: "inline-block",
    paddingRight: 8,
    minWidth: 28
});

const MobileWrapper = styled('div')({

});

const menuItems: string[] = [
    "Service Needs",
    "Advisor Selection",
    "Appointment Selection",
    "Transportation Needs",
    "Appointment Confirmation"
];

const stepScreens: TScreen[] = [
    "serviceNeeds",
    "consultantSelection",
    "appointmentTiming",
    "transportationNeeds",
    "appointmentConfirmation",
]

const mobileServiceScreens: TScreen[] = [
    "location",
    "serviceNeeds",
    "appointmentTiming",
    "appointmentConfirmation",
];

const pickUpDropOffScreens: TScreen[] = [
    "location",
    "serviceNeeds",
    "consultantSelection",
    "appointmentTiming",
    "appointmentConfirmation",
]

const mobileMenuItems: string[] = [
    "Your Location",
    "Service Needs",
    "Appointment Selection",
    "Appointment Confirmation"
]

const pickUpDropOffMenuItems: string[] = [
    "Your Location",
    "Service Needs",
    "Advisor Selection",
    "Appointment Selection",
    "Appointment Confirmation"
]

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
    const {serviceType, sideBarSteps} =  useSelector((state: RootState) => state.appointmentFrame);
    const {config} = useSelector((state: RootState) => state.bookingFlowConfig);
    const theme = useTheme();
    const dispatch = useDispatch();
    const isSm = useMediaQuery(theme.breakpoints.down('sm'));
    const currentConfig = useMemo(() => {
        return config.find(item => item.serviceType.toString() === serviceType.toString());
    }, [config, serviceType])

    const currentMenu = useMemo(() => {
        return serviceType === EServiceType.VisitCenter
            ? menuItems
            : serviceType === EServiceType.PikUpDropOff
                ? pickUpDropOffMenuItems
                : mobileMenuItems;
    }, [serviceType]);

    const currentSteps = useMemo(() => {
        return serviceType === EServiceType.VisitCenter
            ? stepsMap
            : serviceType === EServiceType.PikUpDropOff
                ? pickUpDropOffStepsMap
                : mobileStepsMap;
    }, [serviceType]);

    const getStepsState = useCallback((idx: number): boolean => {
        return serviceType === EServiceType.MobileService
            ? mobileStepsMap[screen] === idx
            : serviceType === EServiceType.PikUpDropOff
                ? pickUpDropOffStepsMap[screen] === idx
                : stepsMap[screen] === idx;
    }, [serviceType, screen])

    const onClick = (idx: number) => {
        const screen = serviceType === EServiceType.VisitCenter
            ? stepScreens[idx]
            : serviceType === EServiceType.MobileService
                ? mobileServiceScreens[idx]
                : pickUpDropOffScreens[idx];
        if (idx === 0) {
            dispatch(setAdditionalServicesChosen(true));
        }
        handleSetScreen(screen);
    }

    useEffect(() => {
        dispatch(setSideBarSteps(Array.from(new Set([...sideBarSteps, screen]))));
    }, [screen, dispatch, setSideBarSteps])

    const getButtonState = (index: number) => {
        if (index === currentSteps["consultantSelection"] - 1 && currentConfig && !currentConfig?.advisorSelection) {
            if (serviceType === EServiceType.VisitCenter || serviceType === EServiceType.PikUpDropOff) return true;
        }
        return serviceType === EServiceType.MobileService
            ? mobileStepsMap[screen] < index + 1 && mobileStepsMap[sideBarSteps[sideBarSteps.length - 1]] < index + 1
            : serviceType === EServiceType.PikUpDropOff
                ? pickUpDropOffStepsMap[screen] < index + 1 && pickUpDropOffStepsMap[sideBarSteps[sideBarSteps.length - 1]] < index + 1
                : stepsMap[screen] < index + 1 && stepsMap[sideBarSteps[sideBarSteps.length - 1]] < index + 1;
    }

    return (
        <Wrapper>
            {!isSm
                ? currentMenu.map((item, idx) => {
                    return <li key={item}>
                        <Button
                            fullWidth
                            disabled={getButtonState(idx)}
                            onClick={() => onClick(idx)}
                            color="primary"
                            variant={getStepsState(idx+1) ? "contained" : "outlined"}>
                            <Index>{idx + 1}</Index> {item}
                        </Button>
                    </li>
                })
                : <MobileSteps
                active={currentSteps[screen]}
                steps={currentMenu.length}
                currentLabel={currentMenu[currentSteps[screen]-1]}
                nextLabel={currentMenu[currentSteps[screen]]}
            />}
        </Wrapper>
    );
};