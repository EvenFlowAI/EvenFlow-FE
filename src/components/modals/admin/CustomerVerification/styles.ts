import { makeStyles } from 'tss-react/mui';

// 
export const useStyles = makeStyles()(() => ({
    switchWrapper: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 14,
        fontWeight: 'bold',
        marginRight: 20,
    },
    actionsWrapper: {
        display: 'flex',
        justifyContent: 'flex-end',
        paddingTop: 14,
    },
    buttonsWrapper: {
        display: 'flex',
        justifyContent: "space-between",
        alignItems: 'center',
    },
    cancelButton: {
        color: '#9FA2B4',
        marginRight: 20,
        border: 'none',
        outline: 'none',
    },
    saveButton: {
        background: '#7898FF',
        color: 'white',
        border: '1px solid #7898FF',
        outline: 'none',
        '&:hover': {
            color: '#7898FF'
        }
    },
}));