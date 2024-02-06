import {Button, ButtonClassKey, ButtonProps, CircularProgress} from "@mui/material";
import React from "react";
import {useStyles, Wrapper} from "./styles";

type Props =
    { loading?: boolean, classes?: Partial<Record<ButtonClassKey, string> & { wrapper?: string }> }
    & ButtonProps;

export const LoadingButton: React.FC<React.PropsWithChildren<React.PropsWithChildren<Props>>> = ({loading, classes, ...props}) => {
    const { classes: classes_} = useStyles();
    const buttonClasses = {...classes};
    if ("wrapper" in buttonClasses) {
        delete buttonClasses['wrapper'];
    }

    return <Wrapper className={classes?.wrapper} fw={props.fullWidth || false}>
        <Button variant={props.variant ?? "contained"}
                color={props.color ?? "primary"}
                fullWidth
                classes={buttonClasses}
                {...props}
                disabled={loading || props.disabled}/>
        {loading && <CircularProgress size={28} className={classes_.buttonProgress}/>}
    </Wrapper>;
}