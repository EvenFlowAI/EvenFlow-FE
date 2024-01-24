import makeStyles from '@mui/styles/makeStyles';

export type TStyleProps = {
    visible: boolean;
    lowerCase?: boolean;
}

export const useStyles = makeStyles(theme => ({
    label: ({visible, lowerCase}: TStyleProps) => ({
        textTransform: lowerCase ? "none" : "uppercase",
        // marginBottom: theme.spacing(.3),
        fontWeight: 'bold',
        color: theme.palette.text.primary,
        visibility: visible ? "visible" : "hidden",
    })
}));