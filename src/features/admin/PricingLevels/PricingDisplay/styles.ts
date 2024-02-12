import { makeStyles } from 'tss-react/mui';

//
export const useStyles = makeStyles()(() => ({
    checkedOption: {
        border: '1px solid #3855F3',
        borderRadius: 2,
        '&:first-child': {
            marginBottom: 20,
        },
    },
    option: {
        border: '1px solid #DADADA',
        borderRadius: 2,
        '&:first-child': {
            marginBottom: 20,
        },
    },
    optionsWrapper: {
        display: 'flex',
        flexDirection: 'column',
        padding: '28px 24px 24px 36px',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        padding: 8,
        textTransform: 'uppercase',
    },
    text: {
        fontSize: 16,
        padding: 8,
        marginBottom: 15,
    }
}));
