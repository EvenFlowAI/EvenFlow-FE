import React from 'react';
import {makeStyles} from "@material-ui/core/styles";
import {Button} from "@material-ui/core";
import {useTranslation} from "react-i18next";
import {TCallback} from "../../../types/types";

const useStyles = makeStyles({
    wrapper: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    buttonsWrapper: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        "& > button": {
            width: 144
        },
        "& > button:first-child": {
            marginRight: 20,
        }
    },
    createNewButton: {
        textTransform: 'none',
        textDecoration: "underline",
    }
})

type TCustomerSearchResultsActionsProps = {
    onBack: TCallback;
    onNewSearch: TCallback;
    onCreateNewAppointment: TCallback;
}

const CustomerSearchResultsActions: React.FC<TCustomerSearchResultsActionsProps> = ({onBack, onNewSearch, onCreateNewAppointment}) => {
    const classes = useStyles();
    const {t} = useTranslation();

    return (
        <div className={classes.wrapper}>
            <div className={classes.buttonsWrapper}>
                <Button
                    color="primary"
                    variant="outlined"
                    onClick={onBack}>
                    {t("Back")}
                </Button>
                <Button
                    color="primary"
                    variant="contained"
                    onClick={onNewSearch}>
                    {t("New Search")}
                </Button>
            </div>
            <Button
                variant="text"
                color="primary"
                className={classes.createNewButton}
                onClick={onCreateNewAppointment}>
                {t("Create Appointment for New Customer")}
            </Button>
        </div>
    );
};

export default CustomerSearchResultsActions;