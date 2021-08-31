import React from 'react';
import {styled} from "@material-ui/core";

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
export const Title: React.FC = ({children}) => {
    return (
        <Wrapper>
            {children}
        </Wrapper>
    );
};
export const Subtitle: React.FC = ({children}) => {
    return <SubtitleWrapper>
        {children}
    </SubtitleWrapper>
}

export const ConfirmationTitle = styled("h4")({
    fontWeight: 700,
    fontSize: 16,
    textTransform: "uppercase",
    margin: 0,
    padding: 0
});