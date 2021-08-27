import React from 'react';
import {styled} from "@material-ui/core";

const Wrapper = styled('h1')({
    fontSize: 28,
    fontWeight: 700,
    margin: 0,
    alignSelf: "flex-start"
})
const SubtitleWrapper = styled('h3')({
    fontSize: 18,
    fontWeight: 400,
    margin: "10px 0 0",
    alignSelf: "flex-start",
    color: "#828282"
})
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