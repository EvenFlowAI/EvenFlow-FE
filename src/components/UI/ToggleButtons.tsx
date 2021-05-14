import {ToggleButton, ToggleButtonGroup} from "@material-ui/lab";
import React from "react";
import {InputLabel} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
    root: {
        display: "flex",
        width: "100%"
    },
    label: {
        textTransform: "uppercase",
        marginBottom: theme.spacing(.5),
        fontWeight: theme.typography.fontWeightBold,
        color: theme.palette.text.primary,
    },
    button: {
        width: "100%",
        lineHeight: "16px",
        transition: theme.transitions.create(["background"]),
        "&.Mui-selected": {
            background: theme.palette.primary.main,
            color: theme.palette.common.white,
            "&:hover": {
                background: theme.palette.primary.dark
            }
        },
    },
}));

export type TButtonElement = {
    value: any, label: string, id: string;
};
type TProps = {
    buttons: TButtonElement[],
    onChange: (e: React.MouseEvent<HTMLElement>, value: any) => void,
    value: any,
    label?: string,
    exclusive?: boolean,
}

export const ToggleButtons: React.FC<TProps> = props => {
    const classes = useStyles();

    return <div>
        <InputLabel className={classes.label} shrink>{props.label}</InputLabel>
        <ToggleButtonGroup
            className={classes.root}
            exclusive={props.exclusive}
            onChange={props.onChange}
            value={props.value}>
            {props.buttons.map(b => <ToggleButton
                className={classes.button}
                key={b.id}
                value={b.value}
            >{b.label}</ToggleButton>)}
        </ToggleButtonGroup>
    </div>;
}