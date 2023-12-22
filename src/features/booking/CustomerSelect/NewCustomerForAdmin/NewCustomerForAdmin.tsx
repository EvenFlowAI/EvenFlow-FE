import React from 'react';
import {Button, Divider, Grid, useMediaQuery, useTheme} from "@material-ui/core";

import {useTranslation} from "react-i18next";
import {ReactComponent as UserIcon} from "../../../../assets/img/user_big.svg";
import {useCustomerSelectStyles} from "../../../../hooks/styling/useCustomerSelectStyles";
import {useStyles} from "./styles";

const NewCustomerForAdmin: React.FC<{ handleNew: () => void}> = ({ handleNew }) => {
    const classes = useStyles();
    const { t } = useTranslation();
    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down("sm"));
    const returningClasses = useCustomerSelectStyles();

    return <Grid item xs={12} sm={12} md={6} style={{maxWidth: 440, padding: isSm ? '16px 0' : 16}}>
        <div className={classes.button}>
            <span style={{fontSize : isSm ? 28 : 32}}>{t("New customer")}</span>
            {isSm
                ? null
                : <div className={returningClasses.greyText}>{t("Click button to start", {button: `"${t("Next")}"`})}</div>}
            <Divider style={{marginBottom: isSm ? 12 : 50, marginTop: isSm ? 12 : 17}}/>
            <div style={{marginBottom: isSm ? 12 : 60}}><UserIcon/></div>
            <Button
                variant="contained"
                color="primary"
                className={classes.submitButton}
                onClick={handleNew}
            >
                {t("Next")}
            </Button>
        </div>
    </Grid>
};

export default NewCustomerForAdmin;