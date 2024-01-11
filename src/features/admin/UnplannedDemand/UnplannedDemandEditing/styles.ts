import makeStyles from '@mui/styles/makeStyles';

export const useStyles = makeStyles(() => ({
    wrapper: {
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: "#FFFFFF",
        border: '1px solid #DADADA',
        overflowX: 'auto',
    },
    titleLine: {
        display: 'flex',
        justifyContent: "space-between",
        alignItems: 'center',
        padding: '12px 36px 0 36px',
    },
    title: {
        fontSize: 16,
        fontWeight: 700,
        textTransform: 'uppercase',
    },
    tablesWrapper: {
        display: 'flex',
    },
    dayName:{
        fontSize: 16,
        fontWeight: 700,
    },
    text: {
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
        paddingBottom: 36,
    }
}))