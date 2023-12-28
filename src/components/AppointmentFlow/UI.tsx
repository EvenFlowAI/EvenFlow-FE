import React, {forwardRef, useLayoutEffect, useRef} from "react";
import {
    Box,
    CircularProgress,
    FormLabel,
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
    isCompleted: boolean;
}

export const InputLoading = () => {
    return <span style={{paddingRight: 12, paddingTop: 6}}>
        <CircularProgress size={20} />
    </span>;
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