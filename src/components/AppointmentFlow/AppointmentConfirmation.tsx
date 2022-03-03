import React, {useEffect} from 'react';
import {useParams} from "react-router-dom";
import {useDispatch} from "react-redux";
import {loadSCProfile} from "../../store/reducers/appointment/actions";
import {Container, ThemeProvider, styled} from "@material-ui/core";
import {endUserTheme} from "../../theme/theme";
import {EndUserBar} from "../NavBar/EndUserBar";
import bg from "../../assets/img/confirmationBg.png";
import { ConfirmationContent } from './ConfirmationContent';
import {decodeSCID} from "../../utils/utils";

const Wrapper = styled(Container)({
    background: `#F2F3F7 url(${bg}) top center no-repeat`,
    backgroundSize: "cover",
    minHeight: "100vh",
    width: "100vw",
    display: "flex",
    flexFlow: "column nowrap",
    alignItems: "stretch",
    maxWidth: "100vw"
});

const ContentWrapper = styled("div")({
    flexGrow: 1,
    zIndex: 10,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
});

export const AppointmentConfirmation = () => {
    const {id} = useParams();
    const dispatch = useDispatch();

    useEffect(() => {
        if (id) {
            dispatch(loadSCProfile(decodeSCID(id)));
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