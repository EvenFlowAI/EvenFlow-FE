import { Button, styled } from "@mui/material";
import { withStyles } from 'tss-react/mui';

export const Wrapper = styled("div", {
    shouldForwardProp: (prop) => prop !== "active"
})<{ active?: boolean}>(({theme, active}) => ({
    display: "flex",
    flex: "1 1 0px",
    padding: 22,
    alignItems: "stretch",
    flexDirection: "column",
    gap: "12px",
    justifyContent: "center",
    transition: 'all .2s',
    '& img': {
        maxWidth: '90%',
        maxHeight: "200px",
        margin: "auto"
    },
    "& button": {
        fontSize: 14
    },
    [theme.breakpoints.up("sm")]: {
        maxWidth: '50%',
    }
}));

export const CarDataWithBtn = styled('div')({
    display: 'flex',
    justifyContent: "space-between",
    alignItems: 'flex-start'
})

export const CarInfo = styled('ul')({
    fontSize: 20,
    listStyle: "none",
    margin: 0,
    padding: 0,
    alignSelf: 'flex-start',
    fontWeight: 'bold',
    '&>li span': {
        color: "#BDBDBD",
        fontWeight: "normal"
    }
});

export const RepairBtn = withStyles(Button, {
    root: {
        textTransform: "none",
        textDecoration: "underline",
        fontSize: 14,
        fontWeight: 600
    }
});