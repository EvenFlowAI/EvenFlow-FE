import {makeStyles} from "@material-ui/core";

export const useMaintenancePackagesStyles = makeStyles(() => ({
    titleWrapper: {
        marginBottom: 16,
    },
    nonExpanded: {
        backgroundColor: '#E5E5E5',
    },
    topLineWrapper: {
        display: "flex",
        alignItems: "center",
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    toggleWrapper: {
        display: "flex",
        alignItems: "center",
        justifyContent: 'space-between',
    },
    showPriceLabel: {
        fontSize: 16,
    },
    optionsLabel: {
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
        marginRight: 10
    }
}));

export const usePackageAccordionStyles = makeStyles(() => ({
    title: {
        fontSize: 20,
    },
    titleWrapper: {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    iconsWrapper: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    button: {
        borderRadius: '50%',
    },
    addOrderButton: {
        marginRight: 20,
    },
    tablesWrapper: {
    },
    details: {
        display: "block",
    },
    complimentaryRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'rgba(37, 37, 37, 0.5)',
        color: 'white',
        fontWeight: 'bold',
        padding: '10px 16px',
    },
    greyInput: {
        width: '100%',
        background: 'rgba(37, 37, 37, 0.5)',
        color: 'white',
        fontWeight: 'bold',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        minHeight: 14,
        padding: '10px 16px',
        '& > input': {
            padding: 3,
            fontSize: 14,
        }
    }
}));