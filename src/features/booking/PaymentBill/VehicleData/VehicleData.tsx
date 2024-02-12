import {useStyles} from "../styles";
import {useTranslation} from "react-i18next";
import {Grid} from "@mui/material";
import {data} from "../mockData";
import React from "react";

export const VehicleData = () => {
    const { classes  } = useStyles();
    const {t} = useTranslation();

    return <Grid container>
        <Grid item xs={12} sm={6} container>
            <Grid item xs={4}>
                <p className={classes.label}>{t("Year")}:</p>
                <p className={classes.data}>{data.vehicleData.year}</p>
            </Grid>
            <Grid item xs={4}>
                <p className={classes.label}>{t("Make")}:</p>
                <p className={classes.data}>{data.vehicleData.make}</p>
            </Grid>
            <Grid item xs={4}>
                <p className={classes.label}>{t("Model")}:</p>
                <p className={classes.data}>{data.vehicleData.model}</p>
            </Grid>
            <Grid item xs={12}>
                <p className={classes.label}>{t("VIN")}:</p>
                <p className={classes.data}>{data.vehicleData.vin}</p>
            </Grid>
            <Grid item xs={4}>
                <p className={classes.label}>{t("Mileage In")}:</p>
                <p className={classes.data}>{data.vehicleData.mileageIn}</p>
            </Grid>
            <Grid item xs={8}>
                <p className={classes.label}>{t("Mileage Out")}:</p>
                <p className={classes.data}>{data.vehicleData.mileageOut}</p>
            </Grid>
            <Grid item xs={4}>
                <p className={classes.label}>{t("License")}:</p>
                <p className={classes.data}>{data.vehicleData.license}</p>
            </Grid>
            <Grid item xs={4}>
                <p className={classes.label}>{t("Body")}:</p>
                <p className={classes.data}>{data.vehicleData.body}</p>
            </Grid>
            <Grid item xs={4}>
                <p className={classes.label}>{t("Color")}:</p>
                <p className={classes.data}>{data.vehicleData.color}</p>
            </Grid>
        </Grid>
        <Grid item xs={12} sm={6} container>
            <Grid item xs={6}>
                <p className={classes.label}>{t("Repair Order")}:</p>
                <p className={classes.data}>{data.repairOrder.number}</p>
            </Grid>
            <Grid item xs={6}>
                <p className={classes.label}>{t("Opened Date")}:</p>
                <p className={classes.data}>{data.repairOrder.openedDate}</p>
            </Grid>
            <Grid item xs={6}>
                <p className={classes.label}>{t("Promised Date")}:</p>
                <p className={classes.data}>{data.repairOrder.promisedDate}</p>
            </Grid>
            <Grid item xs={6}>
                <p className={classes.label}>{t("Closed Date")}:</p>
                <p className={classes.data}>{data.repairOrder.closedDate}</p>
            </Grid>
            <Grid item xs={6}>
                <p className={classes.label}>{t("Service Advisor")}:</p>
                <p className={classes.data}>{data.repairOrder.serviceAdvisor}</p>
            </Grid>
            <Grid item xs={6}>
                <p className={classes.label}>{t("Tag")} #:</p>
                <p className={classes.data}>{data.repairOrder.tagNumber}</p>
            </Grid>
            <Grid item xs={6}>
                <p className={classes.label}>{t("Rate")}:</p>
                <p className={classes.data}>{Number(data.repairOrder.rate).toFixed(2)} USD</p>
            </Grid>
            <Grid item xs={6}>
                <p className={classes.label}>{t("Closed Rate")}:</p>
                <p className={classes.data}>{Number(data.repairOrder.payment).toFixed(2)} USD</p>
            </Grid>
        </Grid>
    </Grid>
}