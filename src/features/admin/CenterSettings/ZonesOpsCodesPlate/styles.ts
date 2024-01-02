import {makeStyles} from "@material-ui/core/styles";

export const useStyles = makeStyles({
    wrapper: {
        maxHeight: 180,
        overflowY: 'auto',
        border: "1px solid #DADADA",
        borderRadius: 2,
        padding: '19px 24px',
        backgroundColor: "#F7F8FB",
    },
    zoneWrapper: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    zone: {
        marginRight: 35,
        fontWeight: 'bold'
    }
})