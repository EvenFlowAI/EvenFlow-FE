import React from 'react';
import {styled} from "@material-ui/core";
import {ConfirmationTitle} from "../Title";
import {useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {EServiceType} from "../../../../store/reducers/appointmentFrameReducer/types";

const TitleWrapper = styled('div')({
    display: "flex",
    alignItems: "center",
    gap: "8px",
    margin: '8px 0',
})

const List = styled('ul')({
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    flexDirection: "column",
    gap: "12px",
    margin: "12px 0 0",
    padding: 0,
    listStyle: "none",
    "& .service-item": {
        textTransform: "capitalize"
    }
});

const Address = () => {
    const {address, zipCode, serviceType} = useSelector((state: RootState) => state.appointmentFrame);
    return address && (serviceType === EServiceType.MobileService || serviceType === EServiceType.PikUpDropOff)
        ? <div>
            <TitleWrapper>
                <ConfirmationTitle>Address</ConfirmationTitle>
            </TitleWrapper>
            <List>
                <li className="service-item">
                    {address?.label || ""}
                </li>
                <li className="service-item">
                    ZIP: {zipCode}
                </li>
            </List>
        </div>
        : null;
};

export default Address;