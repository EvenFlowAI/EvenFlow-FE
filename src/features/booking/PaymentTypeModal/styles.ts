import {makeStyles} from "@material-ui/core/styles";

export const useStyles = makeStyles(() => ({
    buttonsWrapper: {
        width: '100%',
        display: 'flex',
        justifyContent: "center",
        alignItems: 'center',
        paddingTop: 14,
        "& > button:first-child": {
            marginRight: 20,
        }
    },
    bigText: {
        fontSize: 24,
        fontWeight: 600,
    },
    smallTextWrapper: {
        '& > p': {
            fontSize: 10,
            fontWeight: 600,
            color: "#828282",
            textTransform: "uppercase",
            marginBottom: 12,
        }
    }
}))