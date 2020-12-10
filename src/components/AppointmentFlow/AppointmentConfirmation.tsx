import React, {useEffect} from 'react';
import {useParams} from "react-router-dom";
import {useDispatch} from "react-redux";
import {loadSCProfile} from "../../store/reducers/appointment/actions";
import {Container, ThemeProvider, styled} from "@material-ui/core";
import {endUserTheme} from "../../theme/theme";
import {EndUserBar} from "../NavBar/EndUserBar";
import bg from "../../assets/img/confirmationBg.png";
import { ConfirmationContent } from './ConfirmationContent';


const Wrapper = styled(Container)({
    background: `#F2F3F7 url(${bg}) top center no-repeat`,
    height: "100vh",
    width: "100vw",
    display: "flex",
    flexFlow: "column nowrap",
    alignItems: "stretch"
});

const ContentWrapper = styled("div")({
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center"
});

export const AppointmentConfirmation = () => {
    const {id} = useParams();
    const dispatch = useDispatch();

    useEffect(() => {
        if (id && Number(id)) {
            dispatch(loadSCProfile(Number(id)));
        }
    }, [id, dispatch]);

    return <ThemeProvider theme={endUserTheme}>
        <Wrapper disableGutters>
            <EndUserBar />
            <ContentWrapper>
                <ConfirmationContent />
            </ContentWrapper>
        </Wrapper>
    </ThemeProvider>
};