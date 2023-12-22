import {styled} from "@material-ui/core";
import React from "react";

const SubtitleWrapper = styled('h3')(({theme}) => ({
    fontSize: 18,
    fontWeight: 400,
    margin: "10px 0 0",
    alignSelf: "flex-start",
    color: "#828282",
    [theme.breakpoints.down('sm')]: {
        alignSelf: "center",
        textAlign: "center",
        fontSize: 14,
        position: "relative",
        top: -20,
    }
}))

export const Subtitle: React.FC = ({children}) => {
    return <SubtitleWrapper>
        {children}
    </SubtitleWrapper>
}