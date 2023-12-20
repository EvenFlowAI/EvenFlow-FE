import React, {useLayoutEffect, useRef} from "react";
import {Box} from "@material-ui/core";
import {SCContainer, Shadow} from "./styles";

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