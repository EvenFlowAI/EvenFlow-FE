import {InputLabel, styled} from "@mui/material";

export type TStyleProps = {
    visible: boolean;
    lowerCase?: boolean;
}

export const Label = styled(InputLabel)<TStyleProps>(({theme, visible, lowerCase}) => ({
    textTransform: lowerCase ? "none" : "uppercase",
    fontWeight: 'bold',
    color: theme.palette.text.primary,
    visibility: visible ? "visible" : "hidden",
}))