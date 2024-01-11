import {ReactComponent as DealershipLogo} from "../../../../assets/img/logo_dealership_example.svg";
import {useStyles} from "../styles";
import {useTranslation} from "react-i18next";
import {Grid} from "@material-ui/core";
import {data} from "../mockData";
import React from "react";

export const BillHeader = () => {
    const classes = useStyles();
    const {t} = useTranslation();

    return <Grid container>
        <Grid item xs={12} sm={6}>
            <h2 className={classes.headerTitle}>{t("Detailed Invoice")}</h2>
        </Grid>
        <Grid item xs={12} sm={6}>
            <Grid container>
                <Grid item xs={4}>
                    <DealershipLogo/>
                </Grid>
                <Grid item xs={8}>
                    <p className={classes.departmentHours}>{t("Service Department Hours")}</p>
                    <p>{data.serviceCenter.hoursOfOperation}</p>
                </Grid>
            </Grid>
        </Grid>
        <Grid item xs={12} sm={6} container direction="column" justify="space-between">
            <p className={classes.name}>{data.customerData.name}</p>
            <div>{data.customerData.address}</div>
            {data.customerData.phones.map(phone => <div key={phone}>{phone}</div>)}
            <p className={classes.link}>{data.customerData.email}</p>
        </Grid>
        <Grid item xs={12} sm={6} container direction="column" justify="space-between">
            <p className={classes.name}>{data.serviceCenter.name}</p>
            <div>{data.serviceCenter.address}</div>
            {data.serviceCenter.phones.map(phone => <div key={phone}>{phone}</div>)}
            <p className={classes.link}>{data.serviceCenter.link}</p>
        </Grid>
    </Grid>
}