import makeStyles from '@mui/styles/makeStyles';

export const useStyles = makeStyles(() => ({
    wrapper: {
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        width: '100%',
        padding: 10,
    },
    optionLabel: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    subTitle: {
        display: 'flex',
        justifyContent: 'center',
        marginBottom: 20,
        fontSize: 17,
    },
    filtersWrapper: {
        width: '50%',
        display: 'flex',
        justifyContent: 'start',
        alignItems: 'center',
    },
    filter: {
        marginRight: 20,
        width: 150,
    }
}))
