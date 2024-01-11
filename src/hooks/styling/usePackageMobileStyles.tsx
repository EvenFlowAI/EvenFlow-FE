import makeStyles from '@mui/styles/makeStyles';

export const usePackageMobileStyles = makeStyles(() => ({
    wrapper: {
        width: '100%',
        padding: 0,
        marginTop: 17,
        borderCollapse: 'collapse',
    },
    tabWrapper: {
        position: "relative",
        background: 'white',
        color: 'black',
        fontSize: 10,
        fontWeight: 'bold',
        borderBottom: '1px solid rgba(0, 0, 0, 0.15)',
        borderTop: '1px solid rgba(0, 0, 0, 0.15)',
        '&:not(:last-child), &:not(:first-child)': {
            borderRight: '1px solid rgba(0, 0, 0, 0.15)',
            borderLeft: '1px solid rgba(0, 0, 0, 0.15)',
        }
    },
    selectedTab: {
        background: 'black',
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
        border: '1px solid black',
    },
    iconWrapper: {
        '& > svg': {
            fontSize: 16,
            verticalAlign: 'middle'
        },
    },
    icon: {
        position: "absolute",
        top: '30%',
        left: 7
    },
    packageName: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontWeight: 'bold',
        padding: 10,
        color: "black"
    },
    serviceRequests: {
        display: 'flex',
        flexDirection: 'column',
        padding: '10px 0',
        fontSize: 14,
        borderBottom: '1px solid black',
        overflow: 'auto',
    },
    totalMaintenance: {
        display: 'flex',
        justifyContent: 'space-between',
        fontWeight: 'bold',
        fontSize: 12,
        padding: '8px 12px 0 12px',
        color: '#252733',
    },
    complimentaryTitle: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontWeight: 'bold',
        fontSize: 14,
        padding: 10,
        color: "black",
        backgroundColor: '#91CFF7',
    },
    upsellTitle: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontWeight: 'bold',
        fontSize: 14,
        padding: 10,
        color: "black",
        background: "#FFD966",
    },
    complimentaryServices: {
        display: 'flex',
        flexDirection: 'column',
        alignContent: 'center',
        padding: 10,
        background: '#E5F5FF',
        overflow: 'auto',
    },
    complimentaryTotal: {
        color: '#252733',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px 12px 16px 12px',
        borderBottom: '1px solid black',
        fontWeight: 'bold',
    },
    totalSums: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 12px 22px 12px',
        fontSize: 20,
    },
    currentWrp: {
        display: "flex",
        alignItems: "center",
        justifyContent: "stretch"
    },
    triangle: {
        width: 0,
        height: 0,
        borderTop: "10px solid transparent",
        borderBottom: "10px solid transparent",
        borderRight: "10px solid #000000",
    },
    current: {
        color: "#D32F2F",
        fontSize: 20,
        fontWeight: 'bold',
    },
    serviceRequest: {
        margin: 0,
        textAlign: 'center',
        padding: 5,
        fontWeight: 'bold',
    },
    serviceRequestUnderlined: {
        margin: 0,
        textAlign: 'center',
        padding: 5,
        textDecoration: 'underline'
    },
    prevPrice: {
        color: '#202021',
        textDecoration: "line-through",
        fontWeight: 'bold',
        fontSize: 20,
        marginRight: 12
    },
    total: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '8px 12px 22px 12px',
    },
    totalName: {
        fontSize: 14,
        fontWeight: 'bold'
    },
    totalText: {
        fontSize: 14,
    },
    pricesWrapper: {
        display: 'flex',
        alignItems: 'center'
    },
    smallText: {
        fontSize: 14,
    },
    bigText: {
        fontSize: 20,
    },
    intervalUpsells: {
        background: '#FFF2CC',
        paddingBottom: 16,
    },
    info: {
        display: "inline-block",
        marginLeft: 4,
        textTransform: "none",
        fontWeight: "bold",
        paddingTop: 12,
    },
    wrapperWithBorder: {
        border: '1px solid rgba(0, 0, 0, 0.15)'
    }
}))