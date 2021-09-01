import React from 'react';
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
}
export const SideBar: React.FC<TProps> = ({screen}) => {
    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down('sm'));
    const isActive = (idx: number): boolean => {
        return stepsMap[screen] === idx;
    }
    return (
        <Wrapper>
            {!isSm ? menuItems.map((item, idx) => {
                return <li key={item}>
                    <Button
                        fullWidth
                        disabled={stepsMap[screen] < idx+1}
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