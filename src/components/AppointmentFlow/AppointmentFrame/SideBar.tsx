import React, {useEffect, useState} from 'react';
import {Button, styled, useMediaQuery, useTheme} from "@material-ui/core";
import {TScreen} from "../../Layout/types";
import {ProgressStepper} from "../ProgressStepper";

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
    appointmentConfirmed: 5
}
const Index = styled('span')({
    fontSize: 32,
    display: "inline-block",
    paddingRight: 8,
    minWidth: 28
});

const MobileWrapper = styled('div')({

});

// TODO: Advisor|consultant
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
    const [passed, setPassed] = useState<TScreen[]>(["serviceNeeds"]);
    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down('sm'));
    const isActive = (idx: number): boolean => {
        return stepsMap[screen] === idx;
    }

    useEffect(() => {
        setPassed(prev => Array.from(new Set([...prev, screen])))
    }, [screen])

    const getButtonState = (index: number) => {
        return stepsMap[screen] < index + 1 && stepsMap[passed[passed.length - 1]] < index + 1;
    }

    return (
        <Wrapper>
            {!isSm ? menuItems.map((item, idx) => {
                return <li key={item}>
                    <Button
                        fullWidth
                        disabled={getButtonState(idx)}
                        onClick={() => handleSetScreen(stepScreens[idx])}
                        color="primary"
                        variant={isActive(idx+1) ? "contained" : "outlined"}>
                        <Index>{idx + 1}</Index> {item}
                    </Button>
                </li>
            }) : <MobileSteps
                active={stepsMap[screen]}
                steps={menuItems.length}
                currentLabel={menuItems[stepsMap[screen]-1]}
                nextLabel={menuItems[stepsMap[screen]]}
            />}
        </Wrapper>
    );
};