import React, {useMemo} from 'react';
import {useLocation, matchPath} from "react-router-dom";
import {Typography} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {Routes} from "../../../config/routes";

const useStyles = makeStyles({
    title: {
        fontWeight: "bold",
        fontSize: 24,
        lineHeight: "29px",
        margin: 0
    }
});

type TTitle = {route: string; title: string};

const getTitle = (match: any): TTitle => {
    for (let path of titles) {
        if (matchPath(match, path.route) !== null) {
            return path;
        }
    }
    return {route: "~", title: "Not Found"};
}

const titles: TTitle[] = [
    {route: Routes.Admin.DealershipGroups, title: "Dealership Groups"},
    {route: Routes.Admin.ServiceCenters, title: "Service Centers"},
    {route: Routes.Admin.Employees, title: "Employees"}
];

export const ContentTitle = () => {
    const {pathname} = useLocation();
    const classes = useStyles();

    const path = useMemo(() => getTitle(pathname), [pathname]);

    return <Typography className={classes.title} variant="h1">{path.title}</Typography>
}

