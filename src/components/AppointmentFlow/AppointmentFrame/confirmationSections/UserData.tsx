import React, {useEffect} from 'react';
import {styled} from "@material-ui/core";
import {ConfirmationTitle} from "../Title";
import {TextField} from "../../../UI/TextField";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {setCustomer} from "../../../../store/reducers/appointmentFrameReducer/actions";

const Wrapper = styled('div')({
    "& label": {
        marginTop: 12
    }
})

export const UserData = () => {
    const dispatch = useDispatch();
    const customerLoadedData = useSelector((state: RootState) => state.appointment.customerLoadedData);
    const customer = useSelector((state: RootState) => state.appointmentFrame.customer);

    useEffect(() => {
        if (customerLoadedData) {
            dispatch(setCustomer({
                fullName: `${customerLoadedData.firstName} ${customerLoadedData.lastName}`.trim(),
                email: customerLoadedData?.emails[0] ?? "",
                phoneNumber: customerLoadedData?.phoneNumbers[0] ?? "",
            }));
        }
    }, [customerLoadedData, dispatch]);

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = ({target: {name, value}}) => {
        if (customer) {
            dispatch(setCustomer({...customer, [name]: value}));
        }
    }
    return (
        <Wrapper>
            <ConfirmationTitle>Customer Information</ConfirmationTitle>
            <TextField
                onChange={handleChange}
                value={customer?.fullName}
                name="fullName"
                fullWidth
                placeholder="Type here"
                label="Full Name" />
            <TextField
                onChange={handleChange}
                value={customer?.phoneNumber}
                name="phoneNumber"
                fullWidth
                placeholder="Type here"
                label="Phone Number" />
            <TextField
                onChange={handleChange}
                value={customer?.email}
                name="email"
                fullWidth
                placeholder="Type here"
                label="Email" />
        </Wrapper>
    );
};