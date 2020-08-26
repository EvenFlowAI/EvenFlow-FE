import React, {useMemo} from 'react';
import {useLocation, matchPath, Link} from "react-router-dom";
import {Theme, Typography} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {Routes} from "../../../config/routes";

const titleSt = {
    fontSize: 24,
    lineHeight: "29px",
    margin: 0
}
const useStyles = makeStyles((theme: Theme) => ({
    title: {
        ...titleSt,
        fontWeight: "bold"
    },
    titleContainer: {
        display: "flex"
    },
    titleLink: (normal) => ({
        ...titleSt,
        fontWeight: !normal ? "bold" : "normal",
        textDecoration: "none",
        color: theme.palette.text.primary
    })
}));

type TTitle = {route: string; title: string, parent?: TTitle};

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
    {route: Routes.Admin.Employees, title: "Employees"},
    {route: Routes.Optimizer.CapacitySettings, title: "Capacity Settings", parent: {
        route: Routes.Optimizer.Base, title: "Optimizer Settings"
    }},
];
const collectParents = (link: TTitle, list: TTitle[]): void => {
    list.push(link)
    if (link.parent) {
        collectParents(link.parent, list);
    }
}
export const ContentTitle = () => {
    const {pathname} = useLocation();

    const path = useMemo(() => getTitle(pathname), [pathname]);
    let prefix: TTitle[] = [];
    if (path.parent) {
        collectParents(path.parent, prefix);
    }

    const classes = useStyles(!!prefix.length);
    if (path.title === "Not Found") return null;

    return <div className={classes.titleContainer}>
        {prefix.length ? prefix.map(title => {
            return <Link to={title.route}
                         key={title.route}
                         className={classes.titleLink}>
                {title.title}/
            </Link>
        }) : null}
        <Typography className={classes.title} variant="h1">{path.title}</Typography>
    </div>
}

