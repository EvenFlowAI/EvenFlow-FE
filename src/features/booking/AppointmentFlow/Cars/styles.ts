import {styled, Theme} from "@mui/material";

export const CarsWrapper = styled('div')(({theme}) => ({
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: "20px",
    justifyContent: "stretch",
    [theme.breakpoints.down('md')]: {
        height: 350,
    }
}));

export const Info = styled('div')({
    fontSize: 18,
    "& span": {
        fontWeight: "bold",
        textDecoration: "underline",
        cursor: "pointer",
        "&:hover": {
            textDecoration: "none"
        }
    }
});

export const Arrow = styled("span")<Theme, { disabled?: boolean }>(({theme, disabled}) => ({
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
    cursor: "pointer",
    border: `1px solid ${disabled ? "#DADADA" : "#91CFF7"}`,
    backgroundColor: disabled ? "#DADADA" : "#E5F5FF",
    color: "#202021",
    opacity: disabled ? 0.4 : 1,
    "&:hover": {
        border: `1px solid ${disabled ? "#DADADA" : "#E5F5FF"}`,
        backgroundColor: disabled ? "#DADADA" : "#91CFF7",
    },
    "& .text": {
        position: 'absolute',
        bottom: -24,
        fontSize: 12,
        whiteSpace: 'nowrap',
        [theme.breakpoints.down('md')]: {
            bottom: -40,
            fontSize: 12,
            whiteSpace: 'normal',
            textAlign: 'center',
        }
    }
}));