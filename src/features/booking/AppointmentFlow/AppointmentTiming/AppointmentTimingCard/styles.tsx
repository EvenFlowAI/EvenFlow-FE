import {styled} from "@mui/material";
import React from "react";
import {CustomDatePicker} from "../../../../../components/pickers/CustomDatePicker/CustomDatePicker";

export const StyledDate = styled(CustomDatePicker)(({theme}) => ({
    marginTop: 16,
    cursor: "pointer",
    "&>div:not(.Mui-disabled)": {
        borderColor: theme.palette.success.contrastText,
        cursor: "pointer",
        "&>input": {
            color: theme.palette.success.contrastText,
            cursor: "pointer"
        }
    },
    "&>div": {
        paddingRight: 4,
        backgroundColor: "#fff"
    },
    [theme.breakpoints.down('sm')]: {
        marginTop: 0
    }
}))

export const CardWrapper = styled("div")<{ active?: boolean}>(({theme, active}) => ({
    border: "1px solid #DADADA",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    borderColor: active ? "#000000" : "#DADADA",
    background: active ? "#E7E7E7" : "transparent",
    gap: "20px",
    padding: 20,
    fontSize: 15,
    transition: "all .2s",
    cursor: "pointer",
    "& .icon": {
        borderRadius: "50%",
        width: 86,
        height: 86,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: active ? "#FFFFFF" : "#E7E7E7",
        [theme.breakpoints.down('md')]: {
            display: "none"
        }
    },
    "&>div:last-child": {
        marginTop: "auto",
    },
    [theme.breakpoints.down('md')]: {
        flexDirection: "row",
    }
}));

export const MobileWrapper = styled("div")({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    flexGrow: 1,
    flexDirection: "column",
    "&>div+div": {
        marginTop: 8
    }
})