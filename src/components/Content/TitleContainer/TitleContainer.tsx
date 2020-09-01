import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import {ContentTitle} from "../ContentTitle/ContentTitle";
import {ContentActions} from "../ContentActions/ContentActions";


const useStyles = makeStyles(theme => ({
    container: (pad: boolean) => ({
        display: "flex",
        flexFlow: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: `calc(100% + ${theme.spacing(4) * 2}px)`,
        maxWidth: theme.breakpoints.values.lg,
        marginLeft: -theme.spacing(4),
        marginRight: -theme.spacing(4),
        marginTop: theme.spacing(3),
        paddingLeft: theme.spacing(4),
        paddingRight: theme.spacing(4),
        paddingBottom: pad ? theme.spacing(3) : 0
    })
}));
type TProps = {
    title: string;
    subtitle?: string;
    pad?: boolean;
    actions?: boolean;
}
export const TitleContainer: React.FC<TProps> = props => {
    const classes = useStyles(Boolean(props.pad));
    return <div className={classes.container}>
        <ContentTitle title={props.title} subtitle={props.subtitle} />
        {props.actions ? <ContentActions /> : null}
    </div>
}
