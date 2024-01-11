import makeStyles from '@mui/styles/makeStyles';

export const useStyles = makeStyles(() => ({
    filtersWrapper: {
        display: 'flex',
        alignItems: 'center',
    },
    autocomplete: {
        marginLeft: 20,
    },
    buttonsWrapper: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        '& > button': {
            marginLeft: 8
        }
    }

}))