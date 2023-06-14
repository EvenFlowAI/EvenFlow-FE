import React from 'react';
import {makeStyles} from "@material-ui/core/styles";
import {Button} from "@material-ui/core";
import {useTranslation} from "react-i18next";
import {TCallback} from "../../../types/types";
import {InfoOutlined} from "@material-ui/icons";

const useStyles = makeStyles({
    wrapper: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    leftWrapper: {
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
    horizontalBtnsWrapper: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-end",
      alignItems: "flex-end",
    },
    createNewButton: {
        textTransform: 'none',
        textDecoration: "underline",
        padding: '4px 8px'
    },
    newVehicleMode: {
        display: "flex",
        alignItems: 'center',
        padding: '9px 12px',
        marginLeft: 48,
        fontSize: 13,
        fontWeight: 600,
        color: "#142EA1",
        backgroundColor: "#F7F8FB",
        borderRadius: 2,
        boxShadow: '2px 2px 2px lightgray',
        "& .text": {
            marginLeft: 8,
            textTransform: "uppercase",
        }
}
})

type TCustomerSearchResultsActionsProps = {
    onBack: TCallback;
    onNewSearch: TCallback;
    onCreateNewAppointment: TCallback;
    onAppointmentForNewVehicle: TCallback;
    isNewVehicleMode: boolean;
}

const CustomerSearchResultsActions: React.FC<TCustomerSearchResultsActionsProps> = ({onBack, onNewSearch, isNewVehicleMode, onCreateNewAppointment, onAppointmentForNewVehicle}) => {
    const classes = useStyles();
    const {t} = useTranslation();

    return (
        <div className={classes.wrapper}>
            <div className={classes.leftWrapper}>
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
                {isNewVehicleMode
                    ? <div className={classes.newVehicleMode}>
                        <InfoOutlined htmlColor="#142EA1"/>
                        <div className="text">Select Customer with new vehicle</div>
                    </div>
                : null}
            </div>
            <div className={classes.horizontalBtnsWrapper}>
                <Button
                    variant="text"
                    color="primary"
                    className={classes.createNewButton}
                    onClick={onAppointmentForNewVehicle}>
                    {t("Create Appointment for New Vehicle of Existing Customer")}
                </Button>
                <Button
                    variant="text"
                    color="primary"
                    className={classes.createNewButton}
                    onClick={onCreateNewAppointment}>
                    {t("Create Appointment for New Customer")}
                </Button>
            </div>
        </div>
    );
};

export default CustomerSearchResultsActions;