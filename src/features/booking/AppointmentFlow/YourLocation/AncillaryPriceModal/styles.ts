import makeStyles from '@mui/styles/makeStyles';

export const useStyles = makeStyles(theme => ({
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
    question: {
        marginTop: 20,
        textAlign: "center",
    },
    actionsWrapper: {
        display: 'flex',
        justifyContent: 'center',
        marginBottom: 30,
        [`${theme.breakpoints.down('md')} and (orientation: portrait)`]: {
            '& > div': {
                flexDirection: 'column',
                padding: '0 16px',
                '& > button:first-child': {
                    order: 2
                }
            }
        }
    }
}))