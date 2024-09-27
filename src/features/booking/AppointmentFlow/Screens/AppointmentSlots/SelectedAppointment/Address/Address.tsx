import React, {useMemo} from 'react';
import {useSelector} from "react-redux";
import {RootState} from "../../../../../../../store/rootReducer";
import {EServiceType} from "../../../../../../../store/reducers/appointmentFrameReducer/types";
import {useTranslation} from "react-i18next";
import {useMediaQuery, useTheme} from "@mui/material";

const Address = () => {
    const { serviceTypeOption, address, zipCode } = useSelector((state: RootState) => state.appointmentFrame);
    const serviceType = useMemo(() => serviceTypeOption ? serviceTypeOption.type : EServiceType.VisitCenter, [serviceTypeOption]);
    const {t} = useTranslation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('mdl'));

    return serviceType !== EServiceType.VisitCenter && address
        ? <div className="service-list">
            <h4 style={isMobile ? {textTransform: 'capitalize', margin: 0} : {}}> {t("You Address")}:</h4>
            <div style={isMobile ? {fontWeight: 400} : {}}>{`${typeof address === "string" ? address : address?.label}` || ""}{zipCode ? `, ${zipCode}` : ""}</div>
        </div>
        : null
};

export default Address;