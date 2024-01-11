import makeStyles from '@mui/styles/makeStyles';

export const useStyles = makeStyles({
    buttonsWrapper: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        '& > button': {
            marginLeft: 8
        }
    }
})