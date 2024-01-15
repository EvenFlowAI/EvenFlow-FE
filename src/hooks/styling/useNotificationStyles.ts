import makeStyles from '@mui/styles/makeStyles';

export const useNotificationStyles = makeStyles({
    tabTitle: {
        fontSize: 16,
        fontWeight: 700,
        color: "#252525",
        textAlign: 'center',
        textTransform: "uppercase",
        paddingBottom: 25
    },
    tabWrapper: {
        width: 400,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: "center",
        margin: 'auto'
    },
    notificationsLabel: {
        fontSize: 12,
        fontWeight: 700,
        textTransform: 'uppercase',
        margin: 0,
    },
    switcherWrapper: {
        display: 'flex',
        alignItems: "center",
        marginBottom: 10,
    },
    selectWrapper: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    addButton: {
        fontSize: 12,
        textTransform: 'none',
        marginLeft: 8,
    },
    employeeWrapper: {
        display: 'grid',
        gridTemplateColumns: '2fr 3fr 1fr',
        alignItems: "center",
        gap: '8px',
        marginTop: 9,
    },
    autocomplete: {
        '& > label': {
            transformOrigin: "bottom left"
        }
    }
})