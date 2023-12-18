import React from "react";
import {makeStyles} from "@material-ui/core/styles";

type TStyleProps = {
    nPd: boolean;
}
const useStyles = makeStyles({
    title: ({nPd}: TStyleProps) => ({
        fontSize: 16,
        fontWeight: "bold",
        textTransform: "uppercase",
        margin: nPd ? 0 : "16px 32px"
    })
});

type TProps = {
    noPadding?: boolean;
}
export const PaperTitle: React.FC<TProps> = ({children, noPadding}) => {
    const classes = useStyles({nPd: Boolean(noPadding)});
    return <h4 className={classes.title}>{children}</h4>;
};

export const TableContainer: React.FC = ({children}) => {
    return <div style={{padding: 16}}>{children}</div>;
}