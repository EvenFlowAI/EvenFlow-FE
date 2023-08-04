import React from 'react';
import {Button, Divider, Grid, useMediaQuery, useTheme} from "@material-ui/core";

import {useTranslation} from "react-i18next";
import {useReturningAdminStyles} from "./ReturningCustomerForAdmin";
import {makeStyles} from "@material-ui/core/styles";
import {mh400, mh600} from "./CustomerSelect";

const useStyles = makeStyles(theme => ({
    button: {
        height: "100%",
        maxHeight: 400,
        // display: "flex",
        // flexDirection: "column",
        // alignItems: "center",
        // justifyContent: "space-between",
        fontWeight: "bold",
        fontSize: 32,
        textAlign: "center",
        padding: "7% 7% 9% 7%",
        border: "1px solid #DADADA",
        background: "#FFFFFF",
        transition: theme.transitions.create(["box-shadow"]),
        "&:hover": {
            boxShadow: "0 2px 8px rgba(0,0,0,.1)"
        },
        [mh600]: {
            fontSize: 22,
            padding: "7%"
        },
        [mh400]: {
            fontSize: 18,
            padding: "2%"
        },
        [theme.breakpoints.down("xs")]: {
            fontSize: 18,
            padding: "5%"
        }
    },
    submitButton: {
        minWidth: 144,
        [theme.breakpoints.down("xs")]: {
            width: "100%",
            "&:last-child": {
                marginBottom: theme.spacing(2),
                marginTop: theme.spacing(2),
            }
        },
        // [theme.breakpoints.up("sm")]: {
        //     marginBottom: 120
        // }
    },
}))

const NewCustomerForAdmin: React.FC<{ handleNew: () => void}> = ({ handleNew }) => {
    const classes = useStyles();
    const { t } = useTranslation();
    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down("sm"));
    const returningClasses = useReturningAdminStyles();

    return <Grid item xs={12} sm={12} md={6} style={{maxWidth: 440, padding: isSm ? '16px 0' : 16}}>
        <div className={classes.button}>
            <span style={{fontSize : isSm ? 28 : 32}}>{t("New customer")}</span>
            {isSm
                ? null
                : <div className={returningClasses.greyText}>{t("Click button to start", {button: `"${t("Submit")}"`})}</div>}
            <Divider style={{marginBottom: isSm ? 12 : 72, marginTop: isSm ? 12 : 17}}/>
            <Button
                variant="contained"
                color="primary"
                className={classes.submitButton}
                onClick={handleNew}
            >
                {t("Submit")}
            </Button>
        </div>
    </Grid>
};

export default NewCustomerForAdmin;