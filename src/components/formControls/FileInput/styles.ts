import {makeStyles} from "@material-ui/core/styles";

export const useStyles = makeStyles(() => ({
    buttonWrapper: {
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'stretch',
    },
    uploadBtn: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        fontSize: 15,
        fontWeight: 'bold',
        textTransform: 'none',
        color: 'white',
        backgroundColor: '#7898FF',
        padding: 10,
        border: 'none',
        borderRadius: 4,
        cursor: 'pointer',
    },
    fileInput: {
        display: 'none'
    },
    fileLabel: {
        width: '100%'
    }
}))

