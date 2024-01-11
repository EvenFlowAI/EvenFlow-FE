import {styled, Theme} from "@mui/material";
import React from "react";
import theme from "../../../../../theme/theme";

export const CardWrapper = styled(({active, ...props}) => (<div {...props}/>))<Theme, { active?: boolean }>(({
                                                                                                                 theme,
                                                                                                                 active
                                                                                                             }) => ({
    width: 287,
    minHeight: 264,
    fontSize: 22,
    cursor: "pointer",
    fontWeight: 700,
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    background: active ? "#000000" : "transparent",
    color: active ? "#FFFFFF" : theme.palette.text.primary,
    border: `1px solid ${active ? "#000000" : "#DADADA"}`,
    transition: "all .2s",
    [theme.breakpoints.down('md')]: {
        minHeight: 100
    }
}));

export const CardOptions = styled('ul')({
    listStyle: "none",
    margin: 0,
    padding: 0,
    fontSize: 14,
    display: "flex",
    alignItems: "stretch",
    flexDirection: "column",
    gap: "8px",
    fontWeight: "normal",
    width: "100%",
    "&>li": {
        border: '1px solid #DADADA',
        cursor: "pointer",
        textAlign: "left",
        padding: 8,
        display: "flex",
        alignItems: "center",
        gap: "6px",
        transition: "all .2s",
        color: theme.palette.text.primary,
        background: "#FFFFFF",
        "&.active": {
            border: "1px solid #FFFFFF",
            color: "#FFFFFF",
            background: "#000000"
        }
    }
})