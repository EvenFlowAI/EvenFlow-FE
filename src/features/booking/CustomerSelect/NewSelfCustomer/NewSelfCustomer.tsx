import React from "react";
import { Button, Grid, useMediaQuery, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useStyles } from "../styles";

const NewSelfCustomer: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<{ handleNew: () => void }>>
> = ({ handleNew }) => {
  const { classes } = useStyles();
  const { t } = useTranslation();
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Grid item xs={12} sm={12} md={6} style={{ padding: isSm ? "16px 0" : 16 }}>
      <div className={classes.button}>
        <span>{t("I`m a new customer")}</span>
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
  );
};

export default NewSelfCustomer;
