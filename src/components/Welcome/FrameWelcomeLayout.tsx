import React from 'react';
import {styled} from "@material-ui/core";


const Wrapper = styled('div')({
    width: '80%',
    maxWidth: 800
});
const Title = styled('h1')(({theme}) => ({
    textTransform: 'uppercase',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 32,
    margin: 0,
    [theme.breakpoints.down('sm')]: {
        fontSize: 24
    },
    [theme.breakpoints.down('xs')]: {
        fontSize: 18
    }
}));
export const FrameWelcomeLayout: React.FC<{}> = ({children}) => {
    return (
        <Wrapper>
            <div>
                <Title>Welcome!</Title>
                <Title>Schedule your service:</Title>
            </div>
            <div>{children}</div>
        </Wrapper>
    );
};