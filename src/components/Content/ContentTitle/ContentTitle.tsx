import React, {useMemo} from 'react';
import {useLocation, matchPath} from "react-router-dom";
import {Typography} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles({
    title: {
        fontWeight: "bold",
        fontSize: 24,
        lineHeight: "29px",
        marginLeft: 32,
        marginTop: 24
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
    {route: "/admin/sc-profiles", title: "Service centers"},
    {route: "/admin/locations", title: "Locations"},
    {route: "/admin/employees", title: "Employees"}
];

export const ContentTitle = () => {
    const {pathname} = useLocation();
    const classes = useStyles();

    const path = useMemo(() => getTitle(pathname), [pathname]);

    return <Typography className={classes.title} variant="h1">{path.title}</Typography>
}

