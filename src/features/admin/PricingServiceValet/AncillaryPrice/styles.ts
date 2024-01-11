import makeStyles from '@mui/styles/makeStyles';

export const useStyles = makeStyles(() => ({
    wrapper: {
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    optionsTitleWrapper: {
        display: 'flex',
        alignItems: 'center',
        marginRight: 20,
        fontSize: 14,
        fontWeight: "bold",
        textTransform: 'uppercase',
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
}))