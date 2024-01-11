import { FormControlLabel } from "@mui/material";
import withStyles from '@mui/styles/withStyles';
import makeStyles from '@mui/styles/makeStyles';

export const Label = withStyles({
    root: {
        justifyContent: "flex-end",
        marginLeft: 0,
        marginRight: 0,
    },
    label: {
        fontWeight: "bold",
        fontSize: 12,
        textTransform: "uppercase",
        //transform: "translate(0, 1.5px) scale(0.75)",
    }
})(FormControlLabel);

export const useStyles = makeStyles(() => ({
    inputsWrapper: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gridGap: 18,
        marginBottom: 18,
    },
    uploadBtn: {
        width: '100%',
        textTransform: 'none',
        padding: 10,
        border: 'none',
        borderRadius: 4,
        color: 'white',
        fontWeight: 'bold',
        backgroundColor: '#7898FF',
        cursor: 'pointer',
    },
    label: {
        textTransform: "uppercase",
        fontWeight: 'bold',
        marginBottom: 4,
        fontSize: 12,
    },
    buttonWrapper: {
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'stretch',
    },
    inputWrapper: {
        display: 'flex',
        flexDirection: 'column',
    },
    cancelButton: {
        color: '#9FA2B4'
    },
    radioGroup: {
        display: 'flex',
        justifyContent: 'flex-end'
    },
}))