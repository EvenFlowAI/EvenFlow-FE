import React, {useMemo} from 'react';
import {useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {EServiceType} from "../../../../store/reducers/appointmentFrameReducer/types";
import {useTranslation} from "react-i18next";

const Address = () => {
    const { serviceTypeOption, address, zipCode } = useSelector((state: RootState) => state.appointmentFrame);
    const serviceType = useMemo(() => serviceTypeOption ? serviceTypeOption.type : EServiceType.VisitCenter, [serviceTypeOption]);
    const {t} = useTranslation();

    return serviceType !== EServiceType.VisitCenter && address
        ? <div className="service-list">
            <h4> {t("YOUR ADDRESS")}: <div>{`${typeof address === "string" ? address : address?.label}` || ""}{zipCode ? `, ${zipCode}` : ""}</div></h4>
        </div>
        : null
};

export default Address;