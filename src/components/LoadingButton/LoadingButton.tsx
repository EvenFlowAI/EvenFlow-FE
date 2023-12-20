import {Button, ButtonClassKey, ButtonProps, CircularProgress} from "@material-ui/core";
import React from "react";
import clsx from "clsx";
import {useStyles} from "./styles";

type Props =
    { loading?: boolean, classes?: Partial<Record<ButtonClassKey, string> & { wrapper?: string }> }
    & ButtonProps;

export const LoadingButton: React.FC<Props> = ({loading, classes, ...props}) => {
    const classes_ = useStyles({fw: props.fullWidth || false});
    const wrapperClassName = clsx(classes?.wrapper, classes_.wrapper);
    const buttonClasses = {...classes};
    if ("wrapper" in buttonClasses) {
        delete buttonClasses['wrapper'];
    }

    return <div className={wrapperClassName}>
        <Button variant={props.variant ?? "contained"}
                color={props.color ?? "primary"}
                fullWidth
                classes={buttonClasses}
                {...props}
                disabled={loading || props.disabled}/>
        {loading && <CircularProgress size={28} className={classes_.buttonProgress}/>}
    </div>;
}