import React from "react";
import {Button, ButtonClassKey, ButtonProps, CircularProgress} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import clsx from "clsx";


const useStyles = makeStyles({
    wrapper: {
        position: "relative"
    },
    buttonProgress: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    }
});

type Props = {loading?: boolean, classes?: Partial<Record<ButtonClassKey, string> & {wrapper?: string}>} & ButtonProps;

export const LoadingButton: React.FC<Props> = ({loading, classes, ...props}) => {
    const classes_ = useStyles();
    const wrapperClassName = clsx(classes?.wrapper, classes_.wrapper);
    const buttonClasses = {...classes};
    if ("wrapper" in buttonClasses) {
        delete buttonClasses['wrapper'];
    }

    return <div className={wrapperClassName}>
        <Button variant="contained"
                color="primary"
                fullWidth
                classes={buttonClasses}
                {...props}
                disabled={loading || props.disabled} />
        {loading && <CircularProgress size={28} className={classes_.buttonProgress}/>}
    </div>;
}