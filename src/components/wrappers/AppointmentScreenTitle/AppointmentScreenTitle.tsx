import {styled} from "@material-ui/core";
import React from "react";

const Wrapper = styled('h1')(({theme}) => ({
    fontSize: 28,
    fontWeight: 700,
    margin: 0,
    alignSelf: "flex-start",
    [theme.breakpoints.down('sm')]: {
        alignSelf: "center",
        textAlign: "center",
        fontSize: 22,
        lineHeight: "26px",
        marginBottom: 12
    }
}))

export const AppointmentScreenTitle: React.FC = ({children}) => {
    return (
        <Wrapper>
            {children}
        </Wrapper>
    );
};