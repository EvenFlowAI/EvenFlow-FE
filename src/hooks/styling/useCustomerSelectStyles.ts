import {makeStyles} from "@material-ui/core/styles";

export const useCustomerSelectStyles = makeStyles((theme) => ({
    greyText: {
        display: 'flex',
        justifyContent: "center",
        fontSize: 16,
        fontWeight: 600,
        color: "#828282",
        marginTop: 10
    },
    inputLabel: {
        display: 'flex',
        justifyContent: "flex-start",
        fontWeight: 700,
        fontSize: 20,
        color: "#202021",
        textAlign: "left",
        [theme.breakpoints.down("sm")]: {
            fontSize: 18,
        },
    },
    nameFieldsWrapper: {
        display: 'flex',
        justifyContent: "space-between",
        alignItems: "center",
        [theme.breakpoints.down("sm")]: {
            flexDirection: 'column',
        },
        "& > div": {
            marginBottom: 28,
            [theme.breakpoints.down("sm")]: {
                marginBottom: 16,
            }
        },
        '& > div:first-child': {
            marginRight: 12,
            [theme.breakpoints.down("sm")]: {
                marginRight: 0,
                marginBottom: 8,
            },
        }
    },
    expandBtn: {
        display: 'flex',
        justifyContent: 'flex-start',
        color: "#142EA1",
        fontSize: 16,
        fontWeight: 600,
        cursor: "pointer",
        marginBottom: 16
    }
}))