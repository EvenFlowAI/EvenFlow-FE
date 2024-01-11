import makeStyles from '@mui/styles/makeStyles';

export
const useStyles = makeStyles(() => ({
    wrapper: {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
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
    selectedCode: {
        fontWeight: 'bold',
        fontSize: 14,
        maxWidth: '40%',
    }
}))

export const useInputStyles = makeStyles(() => ({
    inputRoot: {
        fontWeight: 'bold',
    }
}))