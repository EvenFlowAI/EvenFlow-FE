import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()(theme => ({
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
        '& > div:first-child': {
            marginRight: 12
        },
        [`${theme.breakpoints.down('md')} and (orientation: portrait)`]: {
            flexDirection: 'column',
            '& > div': {
                flexDirection: 'column',
                padding: '0 16px',
                '& > button:first-child': {
                    order: 2
                }
            },
            '& > div:first-child': {
                marginBottom: 12,
                marginRight: 0
            },
        }
    }
}));