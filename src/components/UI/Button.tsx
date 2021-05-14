import React from "react";
import {Button, ButtonClassKey, ButtonProps, CircularProgress, styled, withStyles} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import clsx from "clsx";
import {DesirabilityButton} from "./ConfigButton";
import { useHistory } from "react-router-dom";

type TStyleProps = {
    fw: boolean;
}
const useStyles = makeStyles({
    wrapper: ({fw}: TStyleProps) => ({
        position: "relative",
        width: fw ? "100%" : "auto",
        display: "inline-flex"
    }),
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
    const classes_ = useStyles({fw: props.fullWidth || false});
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

export const SquareIconButton = withStyles({
    root: {
        padding: "5px 0",
        minWidth: 40
    }
})((props: ButtonProps) => {
    return <Button {...props} />
})
export const EditButton = withStyles({
    root: {
        textTransform: "none"
    }
})(Button);

export type TSwitchButton<U> = {label: string; type: U};
export type TSwitchButtonsProps<U=string> = {
    onClick: (s: U) => () => void,
    active: U,
    buttons: TSwitchButton<U>[]
}

const getButtonColor = <U extends string | number>(ds: U, cds: U): "primary" | "default" => {
    return ds === cds ? "primary" : "default";
}

export const SwitchButtons
    = <U extends string | number >({onClick, buttons, active}: TSwitchButtonsProps<U>):
    React.ReactElement<TSwitchButtonsProps<U>> => {
    return <>
        {buttons.map(b => {
            return <DesirabilityButton
                key={b.type}
                variant="contained"
                onClick={onClick(b.type)}
                color={getButtonColor(active, b.type)}>
                {b.label}
            </DesirabilityButton>
        })}
    </>
}

const StyledLinkButton = styled(Button)({
    textDecoration: "underline"
});

export const LinkButton: React.FC<ButtonProps&{to: string}> = ({to, ...props}) => {
    const history = useHistory();
    const handleClick = () => {
        history.push(to);
    }
    return <StyledLinkButton onClick={handleClick} {...props} />;
}