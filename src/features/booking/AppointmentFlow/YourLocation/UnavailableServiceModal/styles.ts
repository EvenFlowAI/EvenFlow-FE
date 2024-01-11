import makeStyles from '@mui/styles/makeStyles';

export const useStyles = makeStyles((theme) => ({
    info: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: "center",
        textAlign: "center",
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    buttonWrapper: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '20px 0',
        [`${theme.breakpoints.down('md')} and (orientation: landscape)`]: {
            margin: 0,
        }
    },
    linkButton: {
        textTransform: 'none',
        fontSize: 18,
        textDecoration: 'underline',
    }
}))