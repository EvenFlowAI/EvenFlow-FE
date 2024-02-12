import { makeStyles } from 'tss-react/mui';

// 
export const useStyles = makeStyles()(() => ({
    button: {
        textTransform: 'none',
    },
    tableWrapper: {
        border: '1px solid #DADADA',
        borderRadius: 1,
        margin: 27,
    }
}));