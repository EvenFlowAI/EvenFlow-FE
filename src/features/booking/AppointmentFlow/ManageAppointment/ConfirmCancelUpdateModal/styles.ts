import {makeStyles} from "@material-ui/core/styles";

export const useStyles = makeStyles({
    wrapper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: "center",
        padding: '16px 80px',
        gap: 12,
        "& > div:not(:last-child)": {
            marginBottom: 12
        }
    },
    textButton: {
        color: "#142EA1",
        marginBottom: 12
    }
})
