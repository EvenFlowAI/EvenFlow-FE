import React, {useEffect} from 'react';
import {useParams} from "react-router-dom";
import {endUserTheme} from "../../../theme/theme";
import { ThemeProvider, StyledEngineProvider } from "@mui/material";
import {EndUserBar} from "../../../features/booking/EndUserBar/EndUserBar";
import {useDispatch, useSelector} from "react-redux";
import {loadSCProfile} from "../../../store/reducers/appointment/actions";
import {decodeSCID} from "../../../utils/utils";
import {RootState} from "../../../store/rootReducer";
import {setWelcomeScreenView} from "../../../store/reducers/appointmentFrameReducer/actions";
import {loadShortSC} from "../../../store/reducers/serviceCenters/actions";
import {getCurrentUser} from "../../../store/reducers/users/actions";
import {useLayout} from "../../../hooks/useLayout/useLayout";
import BookingFlowRoutes from "../../../routes/BookingFlowRoutes/BookingFlowRoutes";

export const BookingFlow = () => {
    const { scProfile } = useSelector((state: RootState) => state.appointment);
    const {id} = useParams<{id: string}>();
    const dispatch = useDispatch();
    const isFrame = useLayout();

    useEffect(() => {
        const decoded = decodeSCID(id);
        if (id && decoded && (!scProfile || decoded !== scProfile?.id)) {
            dispatch(loadSCProfile(decoded));
        }
    }, [id, dispatch, scProfile]);

    useEffect(() => {
        dispatch(getCurrentUser())
    }, [])

    useEffect(() => {
        if (scProfile) {
            try {
                dispatch(loadShortSC(false, scProfile.dealershipId));
            } catch (e) {
                dispatch(setWelcomeScreenView('select'))
            }
        }
    }, [scProfile])

    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={endUserTheme}>
                <div>
                    {!isFrame ? <EndUserBar/> : null}
                    <BookingFlowRoutes/>
                </div>
            </ThemeProvider>
        </StyledEngineProvider>
    );
};