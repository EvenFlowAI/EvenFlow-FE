import React from 'react';
import {Button, Grid} from "@material-ui/core";
import {useStyles} from "./CustomerSelect";
import {useTranslation} from "react-i18next";

const NewSelfCustomer: React.FC<{ handleNew: () => void}> = ({ handleNew }) => {
    const classes = useStyles();
    const { t } = useTranslation();

    return <Grid item xs={12} sm={12} md={6}>
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
};

export default NewSelfCustomer;