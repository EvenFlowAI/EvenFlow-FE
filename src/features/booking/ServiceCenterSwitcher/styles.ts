import {makeStyles} from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
    selectWrapper: {
        width: "100%",
        display: 'flex',
        justifyContent: 'flex-end',
        padding: '12px 0 28px 0',
        [theme.breakpoints.down("sm")]: {
            justifyContent: 'center',
            marginBottom: 20,
            padding: '12px 0 0 0',
        }
    },
    textWrapper: {
        fontSize: 20,
        fontWeight: 600,
        cursor: "pointer",
        [theme.breakpoints.down("sm")]: {
            fontSize: 16,
        }
    }
}))