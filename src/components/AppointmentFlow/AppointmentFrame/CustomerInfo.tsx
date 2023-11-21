import React from 'react';
import {useTranslation} from "react-i18next";
import {makeStyles} from "@material-ui/core/styles";
import {useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {EUserType} from "../../../store/reducers/appointmentFrameReducer/types";

const useStyles = makeStyles({
    wrapper: {
        fontSize: 16,
        color: "#202021",
        fontWeight: 600,
    },
    title: {
        textTransform: "uppercase",
        marginBottom: 8
    }
})

const CustomerInfo = () => {
    const {customerLoadedData} = useSelector((state: RootState) => state.appointment);
    const {selectedVehicle, userType} = useSelector((state: RootState) => state.appointmentFrame);
    const classes = useStyles();
    const {t} = useTranslation();

    return userType === EUserType.Existing && customerLoadedData ? <div className={classes.wrapper}>
        <div className={classes.title}>{t("Customer")}</div>
        <div>{customerLoadedData?.firstName ?? ''} {customerLoadedData?.lastName ?? ''}</div>
        <div>{selectedVehicle?.year ?? ''}  {selectedVehicle?.make ?? ''} {selectedVehicle?.model ?? ''}</div>
    </div> : null
};

export default CustomerInfo;