import React, {useEffect} from 'react';
import {Switch, Route, useParams} from "react-router-dom";
import {endUserTheme} from "../../theme/theme";
import {ThemeProvider} from "@material-ui/core";
import {Routes} from "../../config/routes";
import {Welcome} from "../Welcome/Welcome";
import {EndUserBar} from "../NavBar/EndUserBar";
import {useDispatch} from "react-redux";
import {loadSCProfile} from "../../store/reducers/appointment/actions";
import {CancelAppointment} from "../Welcome/CancelAppointment";
import {EditAppointment} from "../Welcome/EditAppointment";
import {decodeSCID} from "../../utils/utils";
import {useLayout} from "../../utils/hooks";

const nonFrameStyles = {
    display: "flex",
    flexFlow: "column nowrap",
    justifyContent: "stretch",
    width: "100%",
    height: "100%"
}
const frameStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%'
}

export const EndUserLayout = () => {
    const {id} = useParams();
    const dispatch = useDispatch();
    const isFrame = useLayout();

    useEffect(() => {
        const decoded = decodeSCID(id);
        if (id && decoded) {
            dispatch(loadSCProfile(decoded));
        }
    }, [id, dispatch]);

    return <ThemeProvider theme={endUserTheme}>
        <div style={!isFrame ? nonFrameStyles : frameStyles}>
            {!isFrame ? <EndUserBar/> : null}
            <Switch>
                <Route path={Routes.EndUser.Base} exact component={Welcome} />
                <Route path={Routes.EndUser.CancelAppointment} exact component={CancelAppointment} />
                <Route path={Routes.EndUser.EditAppointment} exact component={EditAppointment} />
            </Switch>
        </div>
    </ThemeProvider>
};