import React, {useEffect, Dispatch, SetStateAction} from 'react';
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

type TUserDataProps = {
    errors: string[],
    setErrors: Dispatch<SetStateAction<string[]>>,
};

export const UserData: React.FC<TUserDataProps> = ({ errors, setErrors }) => {
    const dispatch = useDispatch();
    const customerLoadedData = useSelector((state: RootState) => state.appointment.customerLoadedData);
    const customer = useSelector((state: RootState) => state.appointmentFrame.customer);

    console.log(customerLoadedData);

    useEffect(() => {
        if (customerLoadedData) {
            dispatch(setCustomer({
                fullName: customerLoadedData?.fullName ?? "",
                email: customerLoadedData?.emails[0] ?? "",
                phoneNumber: customerLoadedData?.phoneNumbers[0] ?? "",
            }));
        }
    }, [customerLoadedData, dispatch]);

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = ({target: {name, value}}) => {
        if (customer) {
            dispatch(setCustomer({...customer, [name]: value}));
        }
        setErrors(errors => errors.filter(err => err !== name.toLowerCase()));
    }
    return (
        <Wrapper>
            <ConfirmationTitle>Customer Information</ConfirmationTitle>
            <TextField
                onChange={handleChange}
                value={customer?.fullName}
                error={errors.includes('fullname')}
                name="fullName"
                fullWidth
                placeholder="Type here"
                label="Full Name:" />
            <TextField
                onChange={handleChange}
                value={customer?.phoneNumber}
                name="phoneNumber"
                fullWidth
                error={errors.includes('phonenumber')}
                placeholder="Type here"
                label="Phone Number:" />
            <TextField
                onChange={handleChange}
                value={customer?.email}
                error={errors.includes('email')}
                name="email"
                fullWidth
                placeholder="Type here"
                label="Email:" />
        </Wrapper>
    );
};