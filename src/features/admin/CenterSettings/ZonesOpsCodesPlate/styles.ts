import {makeStyles} from "@material-ui/core/styles";

export const useStyles = makeStyles({
    wrapper: {
        maxHeight: 180,
        overflowY: 'auto',
        border: "1px solid #DADADA",
        borderRadius: 2,
        padding: '19px 24px',
        marginTop: 32,
        backgroundColor: "#F7F8FB",
    },
    elementWrapper: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: 25,
    },
    zone: {
        width: '30%',
        marginRight: 12,
        fontWeight: 'bold'
    }
})