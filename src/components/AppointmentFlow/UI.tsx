import React, {forwardRef, useLayoutEffect, useRef} from "react";
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
        boxShadow: "0 3em 2em 0 white inset",
        borderTopColor: "#cecece"
    },
    "&.offBottom": {
        boxShadow: "0 -3em 2em 0 white inset",
        borderBottomColor: "#cecece"
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

export const StepContentContainer = styled("div")({
    width: "90%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    flexWrap: "nowrap",
    minWidth: 0
});
type TNextProps = {
    nextDisabled?: boolean,
    nextLabel?: string;
    prevLabel?: string;
};
export const NextPrevBlock: React.FC<TStepProps&TNextProps> = ({next, prev, nextDisabled, nextLabel, prevLabel}) => {
    return <Box mt={1} textAlign="center">
        <Button variant="outlined" color="primary" onClick={prev}>
            {prevLabel ?? "Previous Step"}
        </Button>
        <Button style={{marginLeft: 16}} disabled={nextDisabled} variant="contained" onClick={next} color="primary">
            {nextLabel ?? "Continue"}
        </Button>
    </Box>
}