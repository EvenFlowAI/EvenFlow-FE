import React from 'react';
import {Button, styled} from "@material-ui/core";
import {TScreen} from "../../Layout/types";

const Wrapper = styled('ul')({
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
    }
});


const stepsMap: {[K in TScreen]: number} = {
    carSelection: 0,
    serviceNeeds: 1,
    maintenanceDetails: 1,
    serviceSelection: 1,
    packageSelection: 1,
    describeMore: 1,
    opsCode: 1,
    vehicleData: 1,
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
})

// TODO: Advisor|consultant
const menuItems: string[] = [
    "Service Needs",
    "Advisor Selection",
    "Appointment Selection",
    "Transportation Needs",
    "Appointment Confirmation"
]
type TProps = {
    screen: TScreen;
}
export const SideBar: React.FC<TProps> = ({screen}) => {
    const isActive = (idx: number): boolean => {
        return stepsMap[screen] === idx;
    }
    return (
        <Wrapper>
            {menuItems.map((item, idx) => {
                return <li key={item}>
                    <Button
                        fullWidth
                        disabled={stepsMap[screen] < idx+1}
                        color="primary"
                        variant={isActive(idx+1) ? "contained" : "outlined"}>
                        <Index>{idx + 1}</Index> {item}
                    </Button>
                </li>
            })}
        </Wrapper>
    );
};