import makeStyles from '@mui/styles/makeStyles';

export const useStyles = makeStyles(() => ({
    wrapper: {
        display: 'flex',
        justifyContent: 'flex-end',
        padding: 16,
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
    addButton: {
        marginRight: 20,
        background: 'transparent',
        color: '#7898FF',
        border: '1px solid #7898FF',
        outline: 'none',
        '&.Mui-disabled': {
            border: '1px solid #9FA2B4',
        }
    },
    saveButton: {
        background: '#7898FF',
        color: 'white',
        border: '1px solid #7898FF',
        outline: 'none',
        '&:hover': {
            color: '#7898FF'
        }
    }
}))