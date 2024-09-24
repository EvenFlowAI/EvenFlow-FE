import { makeStyles } from 'tss-react/mui';

export const useSelectedAppointmentStyles = makeStyles()(theme => ({
    selectWrapper: {
        display: 'flex',
        alignItems: 'center',
        '& > span': {
            [theme.breakpoints.up("mdl")]:{
                marginLeft: 5,
            }
        },
        [theme.breakpoints.down('md')]: {
            display: 'block',
            '& > div > div': {
                padding: 5
            }
        },
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
        [theme.breakpoints.up('mdl')]: {
            marginLeft: 10,
        }
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
        margin: '0 0 10px 0',
        textTransform: 'uppercase'
    }
}));