import {styled} from "@mui/material";

export const SCContainer = styled("div")({
    height: "100%",
    overflowX: "hidden",
    overflowY: "auto"
});

export const Shadow = styled("div")({
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