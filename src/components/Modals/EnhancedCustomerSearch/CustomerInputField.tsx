import React from 'react';
import {CustomerInput} from "./CustomerSearchTable";
import {ICustomerWithPhones} from "../../../store/reducers/enhancedCustomerSearch/types";

type TCustomerInputFieldProps = {
    editingElement: ICustomerWithPhones|null;
    isEdit: boolean;
    fieldName: keyof ICustomerWithPhones;
    customer: ICustomerWithPhones;
    onFieldChange: (fieldName: keyof ICustomerWithPhones) => (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CustomerInputField: React.FC<TCustomerInputFieldProps> = ({
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

export default CustomerInputField;