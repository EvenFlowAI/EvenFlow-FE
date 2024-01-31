import { makeStyles } from 'tss-react/mui';

// 
export const useStyles = makeStyles()(() => ({
    wrapper: {
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
    addModel: {
        display: "flex",
        alignItems: 'flex-end',
        margin: '20px 0',
    },
    iconPlus: {
        '& .MuiSvgIcon-root': {
            fill: '#7898FF',
        }
    },
    modelsWrapper: {
        height: 124,
        display: 'flex',
        alignItems: 'start',
        alignContent: 'start',
        justifyContent: 'stretch',
        flexWrap: 'wrap',
        overflowY: 'auto',
        margin: '16px 0',
        background: '#F7F8FB',
        color: '#B8B9BF',
        padding: '6px 12px',
    },
}));