import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import {Switch, Route} from "react-router-dom";
import {Routes} from "../../../config/routes";
import {DealershipActions} from "../../Admin/DealershipGroups/DealershipActions";


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
            <Route path={Routes.Admin.DealershipGroups} component={DealershipActions} />
        </Switch>
    </div>;
}