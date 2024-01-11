import makeStyles from '@mui/styles/makeStyles';

export const useStyles = makeStyles(() => ({
    wrapper: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '22px 27px',
        background: "#F2F3F7",
    },
    price: {
        fontSize: 16,
        fontWeight: 600,
        color: "#202021",
    },
    prevPrice: {
        fontSize: 16,
        fontWeight: 600,
        color: "#202021",
        textDecoration: 'line-through',
    },
    redPrice: {
        fontSize: 16,
        fontWeight: 600,
        color: "#D32F2F",
    }
}));
