import { makeStyles } from 'tss-react/mui';

//
export const useDatePickerStyles = makeStyles()(theme => ({
    label: {
        textTransform: "uppercase",
        marginBottom: theme.spacing(.2),
        fontWeight: 'bold',
        color: theme.palette.text.primary,
    }
}));