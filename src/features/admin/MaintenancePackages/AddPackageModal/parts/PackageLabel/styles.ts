import {makeStyles} from "@material-ui/core/styles";

export const useStyles = makeStyles(() => ({
    wrapper: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        alignSelf: 'start',
        background: '#7898FF',
        color: 'white',
        borderRadius: 4,
        fontWeight: 'bold',
        margin: '8px 0',
        padding: '4px 6px',
    },
    icon: {
        fontSize: 16,
        background: 'white',
        color: '#7898FF',
        borderRadius: '50%',
        cursor: 'pointer',
    }
}))