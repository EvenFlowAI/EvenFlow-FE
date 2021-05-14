import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import {ContentTitle, TTitle} from "../ContentTitle/ContentTitle";
import {ContentActions} from "../ContentActions/ContentActions";

type TStyleProps = {
    pad: boolean;
}
const useStyles = makeStyles(theme => ({
    container: ({pad}: TStyleProps) => ({
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
        paddingBottom: pad ? theme.spacing(3) : 0,
        [theme.breakpoints.down("sm")]: {
            flexFlow: "column",
            "&>*:not(:first-child)": {
                marginTop: theme.spacing(1)
            }
        }
    })
}));

type TProps = {
    title: string;
    subtitle?: string;
    pad?: boolean;
    parent?: TTitle;
    actions?: boolean | JSX.Element;
}
export const TitleContainer: React.FC<TProps> = ({pad, parent, title, subtitle, actions}) => {
    const classes = useStyles({pad: Boolean(pad)});
    return <div className={classes.container}>
        <ContentTitle parent={parent} title={title} subtitle={subtitle} />
        {actions ? typeof actions === 'boolean' ? <ContentActions /> : actions : null}
    </div>;
}
