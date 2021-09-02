import React from 'react';
import {styled} from "@material-ui/core";
import {useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";


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
    const selectedPackage = useSelector((state: RootState) => state.appointmentFrame.selectedPackage);
    const [selectedSR, srList] = useSelector((state: RootState) => [
        state.appointment.selectedSR,
        state.appointment.serviceRequests
    ]);
    const getService = () => {
        if (selectedPackage) {
            return selectedPackage.name;
        }
        if (selectedSR.length) {
            const filtered = srList.filter(el => selectedSR.includes(el.id)).map(el => el.description);
            return filtered.length ? filtered.map(el => <><br /><span>{el}</span></>) : "-";
        }
        if (appointmentData.subService) {
            return appointmentData.subService.name;
        }
        return appointmentData.service?.name ?? "-";
    }
    return (
        <div>
            <h4>Your selections</h4>
            <Wrapper>
                <List>
                    <li>Service Needed: {getService()}
                    </li>
                    <li>Advisor: {
                        appointmentData.advisor?.name ?? "Any available"
                    }</li>
                    {/*<ul>*/}
                    {/*    <li>See available times for any Consultant</li>*/}
                    {/*</ul>*/}
                </List>
                {selectedPackage
                    ? <PriceWrapper>
                        <div className="price">$
                            {Math.floor(selectedPackage.price)}
                            <span>
                                .{(selectedPackage.price % 1).toFixed(2).slice(2)}
                            </span>
                        </div>
                        <div className="info">Save by booking at off peak times!</div>
                    </PriceWrapper>
                    : null}
            </Wrapper>
        </div>
    );
};