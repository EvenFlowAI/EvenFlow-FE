import makeStyles from '@mui/styles/makeStyles';

export const useStyles = makeStyles(() => ({
    number: {
        '& > span': {
            fontSize: 14,
            marginLeft: 3,
        }
    }
}))