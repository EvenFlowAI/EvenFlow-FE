import React from 'react';
import {styled, useMediaQuery, useTheme} from "@material-ui/core";
import {useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {getMaintenanceDescription} from "./uiUtils";


const Wrapper = styled('div')(({theme}) => ({
    display: "flex",
    alignItems: "stretch",
    justifyContent: "space-between",
    [theme.breakpoints.down("xs")]: {
        flexDirection: "column"
    }
}))


const List = styled('ul')(({theme}) => ({
    listStyle: "none",
    margin: 0,
    padding: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "18px",
    fontSize: 16,
    fontWeight: "bold",
    [theme.breakpoints.down("xs")]: {
        alignSelf: "flex-start",
    },
    "& .service-item": {
        textTransform: "capitalize"
    },
    "& ul": {
        listStyle: "none",
        marginTop: -10,
        "&>li": {
            textDecoration: "underline",
            cursor: "pointer",
            fontSize: 14,
            "&:hover": {
                textDecoration: "none"
            }
        }
    }
}));

const PriceWrapper = styled('div')(({
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    textAlign: "right",
    "& .price": {
        fontSize: 24,
        fontWeight: "bold",
        "&>span": {
            fontSize: 18
        }
    },
    "& .info": {
        color: "#27AE60"
    }
}));
const DateWrapper = styled('div')(({theme}) => ({
    marginBottom: "auto",
    textAlign: "right",
    fontSize: 16,
    fontWeight: "bold",
    [theme.breakpoints.down("xs")]: {
        marginTop: 16
    }
}))
// TODO: Advisor|consultant
export const SelectedAppointment = () => {
    const appointmentData = useSelector(({appointmentFrame}: RootState) => appointmentFrame);
    const appointment = useSelector((state: RootState) => state.appointment.appointment);
    const selectedPackage = useSelector((state: RootState) => state.appointmentFrame.selectedPackage);
    const [selectedSR, srList] = useSelector((state: RootState) => [
        state.appointment.selectedSR,
        state.appointment.serviceRequests
    ]);
    const theme = useTheme();
    const isXs = useMediaQuery(theme.breakpoints.down("xs"));

    const price = appointment?.priceWithOffer?.value
        ?? appointment?.price.value
        ?? selectedPackage?.price ?? 0;

    return (
        <div>
            <h4>Your selections</h4>
            <Wrapper>
                <List>
                    <li className="service-item">Service Needed: {isXs ? <br/> : null} {
                        getMaintenanceDescription(srList, selectedSR, selectedPackage, appointmentData.service, appointmentData.subService)
                    }
                    </li>
                        <li>Advisor: {isXs ? <br/> : null} {
                            appointmentData.advisor?.name ?? "Any available"
                        }</li>
                    {/*<ul>*/}
                    {/*    <li>See available times for any Consultant</li>*/}
                    {/*</ul>*/}
                </List>
                <PriceWrapper>
                    {appointment ? <DateWrapper>
                        Date & Time: <br /> {appointment.date.format('MMMM D, h:mm A')}
                    </DateWrapper> : null}
                    {selectedPackage
                        ? <>
                            <div className="price">$
                                {Math.floor(price)}
                                <span>
                                    .{(price % 1).toFixed(2).slice(2)}
                                </span>
                            </div>
                            <div className="info">Save by booking at off peak times!</div>
                        </> : null}
                    </PriceWrapper>
            </Wrapper>
        </div>
    );
};