import React, {useEffect, Dispatch, SetStateAction} from 'react';
import {styled} from "@material-ui/core";
import {ConfirmationTitle} from "../Title";
import {TextField} from "../../../UI/TextField";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {setCustomer} from "../../../../store/reducers/appointmentFrameReducer/actions";
import {useTranslation} from "react-i18next";

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
    const {t} = useTranslation();

    useEffect(() => {
        if (customerLoadedData) {
            dispatch(setCustomer({
                fullName: customerLoadedData?.fullName ?? `${customerLoadedData.firstName} ${customerLoadedData.lastName}`,
                email: customerLoadedData?.emails?.length ? customerLoadedData.emails[0] : "",
                phoneNumber: customerLoadedData?.phoneNumbers?.length ? customerLoadedData.phoneNumbers[0] : "",
                city: customerLoadedData?.city,
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
            <ConfirmationTitle>{t("Customer Information")}</ConfirmationTitle>
            <TextField
                onChange={handleChange}
                value={customer?.fullName}
                error={errors.includes('fullname')}
                name="fullName"
                fullWidth
                placeholder={t("Type here")}
                label={`${t("Full Name")}:`} />
            <TextField
                onChange={handleChange}
                value={customer?.phoneNumber}
                name="phoneNumber"
                fullWidth
                error={errors.includes('phonenumber')}
                placeholder={t("Type here")}
                label={`${t("Phone Number")}:`} />
            <TextField
                onChange={handleChange}
                value={customer?.email}
                error={errors.includes('email')}
                name="email"
                fullWidth
                placeholder={t("Type here")}
                label={`${t("Email")}:`} />
        </Wrapper>
    );
};