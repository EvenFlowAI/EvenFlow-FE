import React from 'react';
import {styled} from "@material-ui/core";
import {useTranslation} from "react-i18next";


const Wrapper = styled('div')({
    width: '80%',
    maxWidth: 1000
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
    const {t} = useTranslation();
    return (
        <Wrapper>
            <div>
                <Title>{t("Welcome")!}</Title>
                <Title>{t("Schedule your service")}:</Title>
            </div>
            <div>{children}</div>
        </Wrapper>
    );
};