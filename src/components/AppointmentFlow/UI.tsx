import React, {forwardRef} from "react";
import {
    Box, Button,
    CircularProgress,
    createStyles,
    FormLabel,
    InputBase,
    styled,
    TextFieldProps,
    withStyles
} from "@material-ui/core";
import {TextField as TF} from "../UI/EndUserInputs";
import {InputProps as StandardInputProps} from "@material-ui/core/Input/Input";

export const TextField: React.FC<TextFieldProps> = forwardRef((props, ref) => {
    return <TF ref={ref} fullWidth {...props} InputProps={{disableUnderline: true, ...props.InputProps} as Partial<StandardInputProps>} />;
});
export const Label = withStyles({
    root: {
        fontSize: 15,
        fontWeight: "bold",
        textAlign: "right",
        textTransform: "uppercase",
        color: "#9FA2B4",
    }
})(FormLabel);

export type TStepProps = {
    next: () => void;
    prev: () => void;
}

export const InputLoading = () => {
    return <span style={{paddingRight: 12, paddingTop: 6}}>
        <CircularProgress size={20} />
    </span>;
}

export const SelectInput = withStyles(createStyles({
    root: {
        borderRadius: 2,
    },
    input: {
        padding: "6px 16px"
    }
}))(InputBase);

export const StepContainer: React.FC = ({children}) => {
    return <div style={{
        display: "flex",
        flexFlow: "column nowrap",
        justifyContent: "space-around",
        alignItems: "center",
        width: "100%",
        height: "100%",
    }}>
        {children}
    </div>;
}
export const ScrollableContainer: React.FC = ({children}) => {
    return <div style={{
        height: "100%",
        overflowX: "hidden",
        overflowY: "auto",
        background: `linear-gradient(#ffffff 33%, rgba(255,255,255, 0)),
            linear-gradient(rgba(255,255,255, 0), #ffffff 66%) 0 100%,
            radial-gradient(farthest-side at 50% 0, rgba(0,0,0, 0.05), rgba(0,0,0,0)),
            radial-gradient(farthest-side at 50% 100%, rgba(0,0,0, 0.05), rgba(0,0,0,0)) 0 100%`,
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "local, local, scroll, scroll",
        backgroundSize: "100% 72px, 100% 72px, 100% 24px, 100% 24px",
    }}>
        {children}
    </div>
}

export const StepContentContainer = styled("div")({
    width: "90%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    flexWrap: "nowrap",
    minWidth: 0
});

export const NextPrevBlock: React.FC<TStepProps&{nextDisabled?: boolean}> = ({next, prev, nextDisabled}) => {
    return <Box mt={1} textAlign="center">
        <Button variant="outlined" color="primary" onClick={prev}>Previous Step</Button>
        <Button style={{marginLeft: 16}} disabled={nextDisabled} variant="contained" onClick={next} color="primary">
            Continue
        </Button>
    </Box>
}