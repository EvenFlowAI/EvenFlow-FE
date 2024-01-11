import makeStyles from '@mui/styles/makeStyles';

export const useSelectedAppointmentStyles = makeStyles(theme => ({
    selectWrapper: {
        display: 'flex',
        alignItems: 'center',
        '& > span': {
            marginLeft: 5,
        },
        [theme.breakpoints.down('md')]: {
            '& > div > div': {
                padding: 5
            }
        },
    },
    select: {
        width: '100%',
        marginLeft: 10,
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
}))