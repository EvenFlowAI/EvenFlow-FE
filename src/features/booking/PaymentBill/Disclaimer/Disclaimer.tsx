import {useStyles} from "../styles";
import {useTranslation} from "react-i18next";
import {Grid} from "@mui/material";
import {data} from "../mockData";
import React from "react";

export const Disclaimer = () => {
    const classes = useStyles();
    const {t} = useTranslation();

    return <Grid item xs={12} sm={6} className={classes.disclaimer}>
        <p className={classes.disclaimerTitle}>{t("Disclaimer Of Warranties")}</p>
        <p className={classes.disclaimerText}>{data.disclaimerOfWarranties}</p>
    </Grid>
}