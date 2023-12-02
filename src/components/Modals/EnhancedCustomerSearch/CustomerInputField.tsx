import React from 'react';
import {CustomerInput} from "./CustomerSearchTable";
import {ICustomerWithPhones} from "../../../store/reducers/enhancedCustomerSearch/types";
import {IAddressData} from "../../../api/types";

type TCustomerInputFieldProps = {
    editingElement: ICustomerWithPhones|null;
    isEdit: boolean;
    fieldName: keyof ICustomerWithPhones;
    customer: ICustomerWithPhones;
    onFieldChange: (fieldName: keyof ICustomerWithPhones) => (e: React.ChangeEvent<HTMLInputElement>) => void;
}


type TAddressInputFieldProps = {
    editingElement: ICustomerWithPhones|null;
    isEdit: boolean;
    fieldName: keyof IAddressData;
    customer: ICustomerWithPhones;
    onFieldChange: (fieldName: keyof IAddressData) => (e: React.ChangeEvent<HTMLInputElement>) => void;
}


export const CustomerInputField: React.FC<TCustomerInputFieldProps> = ({
                                                                    editingElement,
                                                                    isEdit,
                                                                    onFieldChange,
                                                                    fieldName,
                                                                    customer
                                                                }) => {
    return isEdit && editingElement?.vehicleId === customer.vehicleId && editingElement?.customerId === customer.customerId
        ? <CustomerInput
            value={editingElement[fieldName] ?? ""}
            onChange={onFieldChange(fieldName)}/>
        : <React.Fragment>{customer[fieldName] ?? ""}</React.Fragment>;
};

export const AddressInputField:React.FC<TAddressInputFieldProps> = ({
                                                                         editingElement,
                                                                         isEdit,
                                                                         onFieldChange,
                                                                         fieldName,
                                                                         customer
                                                                     }) => {
    return isEdit && editingElement?.vehicleId === customer.vehicleId && editingElement?.customerId === customer.customerId
        ? <CustomerInput
            value={editingElement.address ? editingElement.address[fieldName] ?? "" : ""}
            onChange={onFieldChange(fieldName)}/>
        : <React.Fragment>{customer.address ? customer.address[fieldName] ?? "" : ""}</React.Fragment>;
};