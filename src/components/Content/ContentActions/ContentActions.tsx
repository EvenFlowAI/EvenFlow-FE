import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import {Switch, Route} from "react-router-dom";
import {ServiceCenterActions} from "../../Admin/ServiceCenterProfiles/ServiceCenterActions";
import {Routes} from "../../../config/routes";


const useStyles = makeStyles({
    wrapper: {
        "& > button": {
            marginLeft: 8
        }
    }
});


export const ContentActions = () => {
    const classes = useStyles();
    return <div className={classes.wrapper}>
        <Switch>
            <Route path={Routes.Admin.ServiceCenter} component={ServiceCenterActions} />
        </Switch>
    </div>;
}