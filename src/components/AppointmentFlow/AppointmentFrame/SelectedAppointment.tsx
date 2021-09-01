import React from 'react';
import {styled} from "@material-ui/core";
import {useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {EDemandCategory} from "../../../store/reducers/pricingSettings/types";


const Wrapper = styled('div')(({theme}) => ({
    display: "flex",
    alignItems: "flex-end",
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
}))
// TODO: Advisor|consultant
export const SelectedAppointment = () => {
    const appointmentData = useSelector(({appointmentFrame}: RootState) => appointmentFrame);
    const appointment = useSelector((state: RootState) => state.appointment.appointment);
    return (
        <div>
            <h4>Your selections</h4>
            <Wrapper>
                <List>
                    <li>Service Needed: {
                        appointmentData.subService?.name ?? appointmentData.service?.name ?? "-"
                    }
                    </li>
                    <li>Advisor: {
                        appointmentData.advisor?.name ?? "Any available"
                    }</li>
                    {/*<ul>*/}
                    {/*    <li>See available times for any Consultant</li>*/}
                    {/*</ul>*/}
                </List>
                {appointment
                    ? <PriceWrapper>
                        <div className="price">${appointment.price.value}<span>.00</span></div>
                        {appointment?.price?.category !== EDemandCategory.High
                            ? <div className="info">Save by booking at off peak times!</div> : null}
                    </PriceWrapper>
                    : null}
            </Wrapper>
        </div>
    );
};