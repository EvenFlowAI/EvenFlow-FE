import React from 'react';
import {CustomerInput} from "./CustomerSearchTable";
import {ICustomerByName} from "../../../store/reducers/enhancedCustomerSearch/types";

type TCustomerInputFieldProps = {
    editingElement: ICustomerByName|null;
    isEdit: boolean;
    fieldName: keyof ICustomerByName;
    customer: ICustomerByName;
    onFieldChange: (fieldName: keyof ICustomerByName) => (e: React.ChangeEvent<HTMLInputElement>) => void;
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