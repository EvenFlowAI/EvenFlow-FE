import { useStyles } from "../styles";
import { useTranslation } from "react-i18next";
import { Grid } from "@mui/material";
import { data } from "../mockData";
import React from "react";

export const DetailedPayments = () => {
  const { classes } = useStyles();
  const { t } = useTranslation();

  return (
    <Grid item xs={12} sm={6} container style={{ marginTop: -12 }}>
      <Grid
        item
        xs={12}
        justifyContent="space-between"
        container
        className={classes.detailsRow}
      >
        <Grid item xs={8} className={classes.greyDetails}>
          {t("Sublet Amount")}
        </Grid>
        <Grid item xs={4} justifyContent="flex-end" container>
          ${data.priceWithTaxes.subletAmount.toFixed(2)}
        </Grid>
      </Grid>
      <Grid
        item
        xs={12}
        justifyContent="space-between"
        container
        className={classes.detailsRow}
      >
        <Grid item xs={8} className={classes.greyDetails}>
          {t("Shop Supplies")}
        </Grid>
        <Grid item xs={4} justifyContent="flex-end" container>
          ${data.priceWithTaxes.shopSupplies.toFixed(2)}
        </Grid>
      </Grid>
      <Grid
        item
        xs={12}
        justifyContent="space-between"
        container
        className={classes.detailsRow}
      >
        <Grid item xs={8} className={classes.greyDetails}>
          {t("Hazardous Materials")}
        </Grid>
        <Grid item xs={4} justifyContent="flex-end" container>
          ${data.priceWithTaxes.hazardousMaterailes.toFixed(2)}
        </Grid>
      </Grid>
      <Grid
        item
        xs={12}
        justifyContent="space-between"
        container
        className={classes.detailsRow}
      >
        <Grid item xs={8} className={classes.greyDetails}>
          {t("Total Charges")}
        </Grid>
        <Grid item xs={4} justifyContent="flex-end" container>
          ${data.priceWithTaxes.totalCharges.toFixed(2)}
        </Grid>
      </Grid>
      <Grid
        item
        xs={12}
        justifyContent="space-between"
        container
        className={classes.detailsRow}
      >
        <Grid item xs={8} className={classes.greyDetails}>
          {t("Less Adjustments")}
        </Grid>
        <Grid item xs={4} justifyContent="flex-end" container>
          ${data.priceWithTaxes.lessAdjustments.toFixed(2)}
        </Grid>
      </Grid>
      <Grid
        item
        xs={12}
        justifyContent="space-between"
        container
        className={classes.detailsRow}
      >
        <Grid item xs={8} className={classes.greyDetails}>
          {t("Sales Tax")}
        </Grid>
        <Grid item xs={4} justifyContent="flex-end" container>
          ${data.priceWithTaxes.salesTax.toFixed(2)}
        </Grid>
      </Grid>
      <Grid item xs={12} justifyContent="space-between" container>
        <Grid item xs={8} className={classes.totalDue}>
          {t("Total Due")}
        </Grid>
        <Grid
          item
          xs={4}
          justifyContent="flex-end"
          container
          className={classes.totalDue}
        >
          $
          {(
            data.priceWithTaxes.subletAmount +
            data.priceWithTaxes.shopSupplies +
            data.priceWithTaxes.hazardousMaterailes +
            data.priceWithTaxes.lessAdjustments +
            data.priceWithTaxes.salesTax +
            data.priceWithTaxes.totalCharges
          ).toFixed(2)}
        </Grid>
      </Grid>
    </Grid>
  );
};
