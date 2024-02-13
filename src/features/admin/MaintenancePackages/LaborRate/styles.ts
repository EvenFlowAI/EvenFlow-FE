import { makeStyles } from 'tss-react/mui';

// 
export const useStyles = makeStyles()(() => ({
    wrapper: {
        display: 'flex',
        alignItems: 'center',
    },
    title: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#252525',
        textTransform: 'uppercase',
        marginRight: 16,
    },
    value: {
        padding: '8px 12px',
        border: '1px solid #DADADA',
        fontSize: 16,
        color: '#252733',
    }
}));