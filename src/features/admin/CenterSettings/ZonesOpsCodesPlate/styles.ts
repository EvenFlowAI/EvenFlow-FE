import {makeStyles} from "@material-ui/core/styles";

export const useStyles = makeStyles({
    wrapper: {
        maxHeight: 180,
        display: 'flex',
        overflowY: 'auto',
        border: "1px solid #DADADA",
        borderRadius: 2,
        padding: '19px 24px',
        marginTop: 32,
        backgroundColor: "#F7F8FB",
    },
    elementWrapper: {
        marginBottom: 25,
    },
    zone: {
        marginRight: 35,
        fontWeight: 'bold'
    }
})