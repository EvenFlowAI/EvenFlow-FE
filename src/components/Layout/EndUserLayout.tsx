import React, {useEffect} from 'react';
import {Switch, Route, useParams} from "react-router-dom";
import {endUserTheme} from "../../theme/theme";
import {ThemeProvider} from "@material-ui/core";
import {Routes} from "../../config/routes";
import {Welcome} from "../Welcome/Welcome";
import {EndUserBar} from "../NavBar/EndUserBar";
import {useDispatch, useSelector} from "react-redux";
import {loadSCProfile} from "../../store/reducers/appointment/actions";
import {CancelAppointment} from "../Welcome/CancelAppointment/CancelAppointment";
import {EditAppointment} from "../Welcome/EditAppointment/EditAppointment";
import {decodeSCID} from "../../utils/utils";
import { useLayout} from "../../utils/hooks";
import {RootState} from "../../store/rootReducer";
import {setWelcomeScreenView} from "../../store/reducers/appointmentFrameReducer/actions";
import {loadShortSC} from "../../store/reducers/serviceCenters/actions";
import {getCurrentUser} from "../../store/reducers/users/actions";

type TGAOptions = {
    siteSpeedSampleRate: number;
    cookieDomain: string;
    allowLinker: boolean;
    storage: string;
    clientId?: string;
}

export const options: TGAOptions = {
    siteSpeedSampleRate: 100,
    cookieDomain: 'auto',
    allowLinker: true,
    storage: 'none',
}

export const EndUserLayout = () => {
    const { scProfile } = useSelector((state: RootState) => state.appointment);
    const {id} = useParams();
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

    return <ThemeProvider theme={endUserTheme}>
        <div>
            {!isFrame ? <EndUserBar/> : null}
            <Switch>
                <Route path={Routes.EndUser.Base} exact component={Welcome} />
                <Route path={Routes.EndUser.CancelAppointment} exact component={CancelAppointment} />
                <Route path={Routes.EndUser.EditAppointment} exact component={EditAppointment} />
            </Switch>
        </div>
    </ThemeProvider>
};