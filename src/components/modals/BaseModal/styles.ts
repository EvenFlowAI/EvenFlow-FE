import makeStyles from '@mui/styles/makeStyles';

type TStyleProps = {
    maxWidth: number;
}
export const useStyles = makeStyles({
    root: {
        "& hr": {
            margin: "28px 0",
        },
        "& input": {
            padding: 11,
            fontSize: 14
        }
    },
    dialogTitle: {
        textAlign: "center",
        "&> h2": {
            fontSize: 19,
            fontWeight: "bold",
            marginTop: 10,
        }
    },
    dialogContent: {
        padding: "10px 25px"
    },
    dialogPaper: ({maxWidth}: TStyleProps) => {
        return maxWidth ? {maxWidth} : {};
    },
    dialogActions: {
        padding: "10px 25px 25px"
    },
    closeButton: {
        position: "absolute",
        top: 0,
        right: 0
    },
});