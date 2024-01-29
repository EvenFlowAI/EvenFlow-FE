import React from "react";
import {styled} from "@mui/material";

type TStyleProps = {
    nPd: boolean;
}

const Title = styled("h4")<TStyleProps>(({theme, nPd}) => ({
    fontSize: 16,
    fontWeight: "bold",
    textTransform: "uppercase",
    margin: nPd ? 0 : "16px 32px"
}))

type TProps = {
    noPadding?: boolean;
}
export const PaperTitle: React.FC<React.PropsWithChildren<React.PropsWithChildren<TProps>>> = ({children, noPadding}) => {
    return <Title nPd={Boolean(noPadding)}>{children}</Title>;
};

export const TableContainer: React.FC<React.PropsWithChildren<React.PropsWithChildren<unknown>>> = ({children}) => {
    return <div style={{padding: 16}}>{children}</div>;
}