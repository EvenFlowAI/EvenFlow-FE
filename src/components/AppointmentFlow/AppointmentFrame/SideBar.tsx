import React, {useCallback, useEffect, useMemo} from 'react';
import {Button, styled, useMediaQuery, useTheme} from "@material-ui/core";
import {TScreen} from "../../Layout/types";
import {ProgressStepper} from "../ProgressStepper";
import {setAdditionalServicesChosen, setSideBarSteps} from "../../../store/reducers/appointmentFrameReducer/actions";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {EServiceType} from "../../../store/reducers/appointmentFrameReducer/types";
import {useTranslation} from "react-i18next";

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

const getStepsMap = (isAdvisorAvailable: boolean): {[K in TScreen]: number} => {
    return {
        carSelection: 0,
        serviceNeeds: 1,
        maintenanceDetails: 1,
        serviceSelection: 1,
        packageSelection: 1,
        describeMore: 1,
        opsCode: 1,
        vehicleData: 1,
        // carDetails: 1,
        consultantSelection: isAdvisorAvailable ? 2 : -1,
        appointmentTiming: isAdvisorAvailable ? 3 : 2,
        appointmentSelection: isAdvisorAvailable ? 3 : 2,
        transportationNeeds:  isAdvisorAvailable ? 4 : 3,
        appointmentConfirmation: isAdvisorAvailable ? 5 : 4,
        appointmentConfirmed: isAdvisorAvailable ? 5 : 4,
        location: 1,
        payment: isAdvisorAvailable ? 5 : 4,
    }
}

const getPickUpDropOffStepsMap = (isAdvisorAvailable: boolean): {[K in TScreen]: number} => {
    return {
        carSelection: 0,
        serviceNeeds: 2,
        maintenanceDetails: 2,
        serviceSelection: 2,
        packageSelection: 2,
        describeMore: 2,
        opsCode: 2,
        vehicleData: 2,
        // carDetails: 2,
        consultantSelection: isAdvisorAvailable ? 3 : -1,
        appointmentTiming: isAdvisorAvailable ? 4 : 3,
        appointmentSelection: isAdvisorAvailable ? 4 : 3,
        appointmentConfirmation: isAdvisorAvailable ? 5 : 4,
        appointmentConfirmed: isAdvisorAvailable ? 5 : 4,
        location: 1,
        transportationNeeds: -1,
        payment: isAdvisorAvailable ? 5 : 4,
    }
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
    // carDetails: 2,
    appointmentTiming: 3,
    appointmentSelection: 3,
    appointmentConfirmation: 4,
    appointmentConfirmed: 4,
    location: 1,
    transportationNeeds: -1,
    consultantSelection: -1,
    payment: 5,
}

const stepScreens: TScreen[] = [
    "serviceNeeds",
    "consultantSelection",
    "appointmentTiming",
    "transportationNeeds",
    "appointmentConfirmation",
]

const withoutAdvisorScreens: TScreen[] = [
    "serviceNeeds",
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

const pickUpDropOffWithoutAdvisorScreens: TScreen[] = [
    "location",
    "serviceNeeds",
    "appointmentTiming",
    "appointmentConfirmation",
]

const menuItems: string[] = [
    "Service Needs",
    "Advisor Selection",
    "Appointment Selection",
    "Transportation Needs",
    "Appointment Confirmation"
];

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

const pickUpDropOffWithoutAdvisorMenuItems: string[] = [
    "Your Location",
    "Service Needs",
    "Appointment Selection",
    "Appointment Confirmation"
]

const withoutAdvisorMenuItems: string[] = [
    "Service Needs",
    "Appointment Selection",
    "Transportation Needs",
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
    const {t} = useTranslation();

    const currentConfig = useMemo(() => {
        return config.find(item => item.serviceType.toString() === serviceType.toString());
    }, [config, serviceType]);
    const advisorSelection = useMemo(() => Boolean(currentConfig?.advisorSelection), [currentConfig]);

    const currentMenu = useMemo(() => {
        switch (serviceType) {
            case EServiceType.VisitCenter:
                return advisorSelection ? menuItems : withoutAdvisorMenuItems;
            case EServiceType.PikUpDropOff:
                return advisorSelection ? pickUpDropOffMenuItems : pickUpDropOffWithoutAdvisorMenuItems;
            default:
                return mobileMenuItems;

        }
    }, [serviceType, advisorSelection]);

    const currentSteps = useMemo(() => {
        switch (serviceType) {
            case EServiceType.VisitCenter:
                return getStepsMap(Boolean(advisorSelection));
            case EServiceType.PikUpDropOff:
                return getPickUpDropOffStepsMap(Boolean(advisorSelection));
            default:
                return mobileStepsMap;
        }
    }, [serviceType, advisorSelection]);

    const getStepsState = useCallback((idx: number): boolean => {
        switch (serviceType) {
            case EServiceType.VisitCenter:
                return getStepsMap(advisorSelection)[screen] === idx
            case EServiceType.PikUpDropOff:
                return getPickUpDropOffStepsMap(advisorSelection)[screen] === idx;
            default:
                return mobileStepsMap[screen] === idx;
        }
    }, [serviceType, screen, advisorSelection])

    const getNextScreen = (idx: number): TScreen => {
        switch (serviceType) {
            case EServiceType.VisitCenter:
                return advisorSelection ? stepScreens[idx] : withoutAdvisorScreens[idx];
            case EServiceType.PikUpDropOff:
                return advisorSelection ? pickUpDropOffScreens[idx] : pickUpDropOffWithoutAdvisorScreens[idx];
            default:
                return mobileServiceScreens[idx];
        }
    }

    const onClick = (idx: number) => {
        const screen: TScreen = getNextScreen(idx);
        handleSetScreen(screen);
        if (idx === 0) dispatch(setAdditionalServicesChosen(true));
    }

    useEffect(() => {
        dispatch(setSideBarSteps(Array.from(new Set([...sideBarSteps, screen]))));
    }, [screen, dispatch, setSideBarSteps])

    const getButtonState = (index: number) => {
        const pickUpSteps = getPickUpDropOffStepsMap(advisorSelection);
        const usualSteps = getStepsMap(advisorSelection);

        switch (serviceType) {
            case EServiceType.MobileService:
                return mobileStepsMap[screen] < index + 1 && mobileStepsMap[sideBarSteps[sideBarSteps.length - 1]] < index + 1;
            case EServiceType.PikUpDropOff:
                return pickUpSteps[screen] < index + 1 && pickUpSteps[sideBarSteps[sideBarSteps.length - 1]] < index + 1;
            default:
                return usualSteps[screen] < index + 1 && usualSteps[sideBarSteps[sideBarSteps.length - 1]] < index + 1;
        }
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
                            <Index>{idx + 1}</Index> {t(item)}
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