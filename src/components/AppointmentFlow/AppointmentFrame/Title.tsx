import React from 'react';
import {styled} from "@material-ui/core";

const Wrapper = styled('h1')({
    fontSize: 28,
    fontWeight: 700,
    alignSelf: "flex-start"
})
export const Title: React.FC = ({children}) => {
    return (
        <Wrapper>
            {children}
        </Wrapper>
    );
};