import {styled} from "@mui/material";

export const SlotsScreenWrapper = styled('div')(({theme}) => ({
        display: "flex",
        flexDirection: "column",
        width: "100%",
        alignItems: "stretch",
        justifyContent: "flex-start",
        gap: "8px",
        "&>div": {
            border: "1px solid #DADADA",
            padding: "18px 44px",
            [theme.breakpoints.down('mdl')]: {
                padding: 16,
            },
            "&>h4": {
                fontSize: 16,
                margin: "0 0 16px",
                padding: 0,
                fontWeight: "bold",
                textTransform: "uppercase",
            },
            "& > button": {
                borderRadius: 0
            }
        },
    })
);