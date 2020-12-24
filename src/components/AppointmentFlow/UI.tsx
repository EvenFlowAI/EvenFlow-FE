import React, {forwardRef, useLayoutEffect, useRef} from "react";
import {
    Box, Button,
    CircularProgress,
    createStyles,
    FormLabel, Grid,
    InputBase,
    styled,
    TextFieldProps, useMediaQuery, useTheme,
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
    isCompleted: boolean;
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
const SCContainer = styled("div")({
    height: "100%",
    overflowX: "hidden",
    overflowY: "auto"
});
const Shadow = styled("div")({
    bottom: 0,
    left: 0,
    pointerEvents: "none",
    position: "absolute",
    right: 0,
    top: 0,
    transition: "all .3s ease-out",
    borderTop: "2px solid transparent",
    borderBottom: "2px solid transparent",
    "&.offTop": {
        boxShadow: "0 4em 2em -2em white inset",
        borderTopColor: "#cecece"
    },
    "&.offBottom": {
        boxShadow: "0 -4em 2em -2em white inset",
        borderBottomColor: "#cecece"
    },
    "&.offTop.offBottom": {
        boxShadow: "0 4em 2em -2em white inset, 0 -4em 2em -2em white inset"
    }
});
export const ScrollableContainer: React.FC = ({children}) => {
    const isScrolling = useRef(false);
    const shadowRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const handleScroll = ({currentTarget}: React.UIEvent<HTMLDivElement, UIEvent>) => {
        if (!isScrolling.current) {
            window.requestAnimationFrame(() => {
                const maxScroll = currentTarget.scrollHeight - currentTarget.clientHeight;
                if (currentTarget.scrollTop > 0) {
                    shadowRef.current?.classList.add("offTop");
                } else {
                    shadowRef.current?.classList.remove("offTop");
                }
                if (currentTarget.scrollTop < maxScroll) {
                    shadowRef.current?.classList.add("offBottom");
                } else {
                    shadowRef.current?.classList.remove("offBottom");
                }
                isScrolling.current = false;
            });
            isScrolling.current = true;
        }
    };
    useLayoutEffect(() => {
        const {current} = containerRef;
        if (current) {
            if (current.scrollHeight - current.clientHeight > current.scrollTop) {
                shadowRef.current?.classList.add("offBottom");
            }
        }
    }, []);

    return <Box height="100%" overflow="hidden" position="relative">
        <SCContainer onScroll={handleScroll} ref={containerRef}>
            {children}
            <Shadow ref={shadowRef} />
        </SCContainer>
    </Box>
}

export const StepContentContainer = styled("div")(({theme}) => ({
    width: "90%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    flexWrap: "nowrap",
    minWidth: 0,
    [theme.breakpoints.down("xs")]: {
        width: "100%"
    }
}));
type TNextProps = {
    nextDisabled?: boolean;
    nextLabel?: string;
    prevLabel?: string;
    prevDisabled?: boolean;
};
export const NextPrevBlock: React.FC<TStepProps&TNextProps> = ({next, prev, nextDisabled, prevDisabled, nextLabel, prevLabel, isCompleted}) => {
    const theme = useTheme();
    const isXS = useMediaQuery(theme.breakpoints.down("xs"));
    return <Box mt={2} textAlign="center">
        <Grid container spacing={2}>
            {!prevDisabled ? <Grid item xs={12} sm={6} style={{order: isXS ? 1 : undefined}}>
                <Button fullWidth variant="outlined" color="primary" onClick={prev}>
                    {prevLabel ?? "Previous Step"}
                </Button>
            </Grid> : null}
            <Grid item xs={12} sm={prevDisabled ? 12 : 6}>
                <Button fullWidth disabled={nextDisabled || !isCompleted} variant="contained" onClick={next} color="primary">
                    {nextLabel ?? "Continue"}
                </Button>
            </Grid>
        </Grid>
    </Box>
}