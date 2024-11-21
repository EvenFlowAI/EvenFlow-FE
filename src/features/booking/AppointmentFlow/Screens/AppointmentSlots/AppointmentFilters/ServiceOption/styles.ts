import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()(() => ({
    selectWrapper: {
    },
    label: {
        whiteSpace: 'nowrap',
        fontSize: 14,
        marginBottom: 4,
        marginTop: 10
    },
    select: {
        width: '100%',
        borderRadius: 0,
        '&:before': {
            display: 'none',
        },
        '& > div': {
            '&:focus': {
                backgroundColor: 'transparent'
            }
        },
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
        margin: '0 0 10px 0',
        textTransform: 'uppercase'
    }
}));