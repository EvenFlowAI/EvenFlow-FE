import { makeStyles } from 'tss-react/mui';
import {Avatar, styled} from "@mui/material";

type TStyleProps = {
    size: number;
    disabled?: boolean
}

export const StyledAvatar = styled(Avatar)<TStyleProps>(({theme, size, disabled}) => ({
    width: size,
    height: size,
    cursor: !disabled ? "pointer" : "auto",
    backgroundColor: "#919191",
    transition: theme.transitions.create(["opacity", "box-shadow"]),
    opacity: .9,
    "&:hover": {
        boxShadow: !disabled ? theme.shadows[5] : undefined,
        opacity: !disabled ? 1 : undefined
    }
}))

// 
export const useStyles = makeStyles()({
    sign: {
        fontSize: 25,
        fontWeight: "bold",
        color: "#FFFFFF",
        border: "1px solid #FFFFFF",
        borderRadius: "50%",
        width: 32,
        height: 32,
        lineHeight: "32px",
        textAlign: "center"
    },
    input: {
        display: "none"
    }
});