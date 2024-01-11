import makeStyles from '@mui/styles/makeStyles';

export const useStyles = makeStyles((theme) => ({
    icon: {
        width: '100%',
        maxHeight: 160,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        [`${theme.breakpoints.down('md')} and (orientation: portrait)`]: {
            maxWidth: 224,
            height: 112,
            width: '90%',
        },
        [`${theme.breakpoints.down('md')} and (orientation: landscape)`]: {
            padding: '7%'
        },
    },
    noLogo: {
        width: '100%',
        minHeight: 105,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: "#DCDCDC",
        fontWeight: 'bold',
        fontSize: 32,
        padding: '10%',
        backgroundColor: "#F4F4F4",
        [`${theme.breakpoints.down('md')} and (orientation: portrait)`]: {
            width: 224,
            height: 112,
            maxWidth: '90%'
        },
        [`${theme.breakpoints.down('md')} and (orientation: landscape)`]: {
            padding: '7%'
        },
    },
    image: {
        maxWidth: '100%',
        maxHeight: 112,
        [theme.breakpoints.down('md')]: {
            maxWidth: 224,
        }
    }
}))