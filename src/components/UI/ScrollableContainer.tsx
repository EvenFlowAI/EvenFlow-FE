import React, {useLayoutEffect, useRef} from "react";
import {Box, styled} from "@material-ui/core";

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