import makeStyles from '@mui/styles/makeStyles';

export const useStyles = makeStyles({
    wrapper: {
        maxHeight: 180,
        display: 'grid',
        gridTemplateColumns: '1fr 3fr',
        gridGap: 25,
        gap: 25,
        overflowY: 'auto',
        border: "1px solid #DADADA",
        borderRadius: 2,
        padding: '19px 24px',
        marginTop: 32,
        backgroundColor: "#F7F8FB",
    },
    zone: {
        fontWeight: 'bold'
    },
    emptyWrapper: {
        height: '100%',
    }
})