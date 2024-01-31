import { makeStyles } from 'tss-react/mui';
import {styled} from "@mui/material";

export type TStyleProps = {
    fw: boolean;
}

export const Wrapper = styled("div")<TStyleProps>(({theme, fw}) => ({
    position: "relative",
    width: fw ? "100%" : "auto",
    display: "inline-flex"
}))

export const useStyles = makeStyles()({
    buttonProgress: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    }
});