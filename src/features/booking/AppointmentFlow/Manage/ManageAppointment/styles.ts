import {styled} from "@mui/material";

export const Wrapper = styled('div')(({theme}) => ({
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "80px",
    "&>div": {
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        justifyContent: "flex-start",
        alignItems: "stretch"
    },
    "& > .itemizedLink": {
        textDecoration: 'underline',
        textTransform: 'none',
    },
    [theme.breakpoints.down('md')]: {
        gridTemplateColumns: "1fr"
    },
}));

export const ButtonWrapper = styled('div')(() => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    "& > button": {
        color: "#142EA1"
    }
}));

export const ManageTitle = styled('div')({
    fontSize: 20,
    fontWeight: 700,
    textTransform: 'uppercase'
})

export const Info = styled('div')({
    fontSize: 12
});